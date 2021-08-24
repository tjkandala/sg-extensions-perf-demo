"use-strict";
console.log("hey");

// Simulate time between preload and parsing/executing web app
setTimeout(() => {
  new Worker("worker.js");
}, 2000);
