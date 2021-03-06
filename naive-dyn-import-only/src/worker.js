console.log("worker init");

const extensionIDs = ["1", "2", "3"];

function createAPI() {
  const context = { id: undefined };

  return {
    api: {
      app: {
        log: (message) => {
          // determine what to do during init tick when context isn't set
          console.log(`from extension ${context.id}:`, message);
        },
      },
    },
    initContext: (id) => {
      context.id = id;
    },
  };
}

// queue of API contexts
const initContextQueue = [];

globalThis.require = () => {
  // TODO: determine best way to limit extensions to importing "sourcegraph" once
  const { api, initContext } = createAPI();

  initContextQueue.push(initContext);

  return api;
};

const exports = {};
self.exports = exports;
self.module = { exports };

// Even when all extensions are returned at the same time, seems to be:
//   extension execution: 1-2-3----
// promise callback call: -1-2-3---
//               timeout: ------123
// which works for us since we can capture each extension's
// exports despite being imported asynchronously!
//
// as opposed to
//   extension execution: 123---
// promise callback call: ---123
Promise.all(
  extensionIDs.map((id) =>
    import(`./extensions/${id}/dist/index.js`)
      .then((module) => {
        // queueMicrotask(() => console.log(`microtask: ${id}`));
        setTimeout(() => console.log(`timeout: ${id}`), 0);

        const extensionExports = self.module.exports;

        initContextQueue.shift()(id);

        extensionExports.activate();
      })
      .catch((error) => console.log(error))
  )
);
