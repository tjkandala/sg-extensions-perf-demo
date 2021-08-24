This approach appears to work!

![Good waterfall](https://user-images.githubusercontent.com/37420160/130646800-e7fc8f1c-f1f6-40d7-8746-498d03c745d1.png)

How to reproduce:

1. If you've already run this demo, clear your browser cache
2. Open network panel and go to localhost:3000/demo.html
3. Observe that the Web Worker bundle request read from disk cache

Notes:

If the preload is still in process when the `importScripts()` requests the same bundle, the Web Worker is still blocked until the preload is finished. However, the whole process should only take as long as the slowest extension bundle download.

![Quirky waterfall](https://user-images.githubusercontent.com/37420160/130647521-2e197601-0778-498d-bc7e-6dbd8eb10c4f.png)
