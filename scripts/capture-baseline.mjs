import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const chromePath = process.env.KAMRAN_CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.KAMRAN_BASE_URL ?? 'http://127.0.0.1:4173'
const debugPort = 9223 + Math.floor(Math.random() * 500)
const outputRoot = resolve('docs/baseline/screenshots')

const routes = [
  ['home-en', '/'],
  ['works-en', '/works'],
  ['work-detail-en', '/works/latent-for-her'],
  ['about-en', '/about'],
  ['credits-en', '/credits'],
  ['contact-en', '/contact'],
  ['home-fa', '/fa'],
  ['works-fa', '/fa/works'],
  ['work-detail-fa', '/fa/works/latent-for-her'],
  ['about-fa', '/fa/about'],
  ['credits-fa', '/fa/credits'],
  ['contact-fa', '/fa/contact'],
]

const viewports = [
  ['desktop', 1440, 1000],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
]
const viewportName = process.argv[2]
const activeViewport = viewports.find(([name]) => name === viewportName)
if (!activeViewport) {
  throw new Error(`Choose one viewport: ${viewports.map(([name]) => name).join(', ')}`)
}

const sleep = (milliseconds) => new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds))

async function waitForDebugger() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`)
      if (response.ok) {
        const targets = await response.json()
        const page = targets.find((target) => target.type === 'page')
        if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
      }
    } catch {}
    await sleep(250)
  }
  throw new Error('Chrome DevTools endpoint did not become ready')
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl)
  const pending = new Map()
  let commandId = 0

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (!message.id) return
    const command = pending.get(message.id)
    if (!command) return
    pending.delete(message.id)
    if (message.error) command.reject(new Error(message.error.message))
    else command.resolve(message.result)
  })

  const ready = new Promise((resolveReady, rejectReady) => {
    socket.addEventListener('open', resolveReady, { once: true })
    socket.addEventListener('error', rejectReady, { once: true })
  })

  return {
    async send(method, params = {}) {
      await ready
      commandId += 1
      const id = commandId
      const result = new Promise((resolveCommand, rejectCommand) => {
        pending.set(id, { resolve: resolveCommand, reject: rejectCommand })
      })
      socket.send(JSON.stringify({ id, method, params }))
      return result
    },
    close() {
      socket.close()
    },
  }
}

const profileDir = await mkdtemp(join(tmpdir(), 'kamran-baseline-'))
const [, targetWidth, targetHeight] = activeViewport
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    '--window-size=1440,1000',
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true },
)

let client

try {
  const webSocketUrl = await waitForDebugger()
  client = createCdpClient(webSocketUrl)
  await client.send('Page.enable')
  await client.send('Runtime.enable')

  for (const [viewportName] of [activeViewport]) {
    const viewportDir = join(outputRoot, viewportName)
    await mkdir(viewportDir, { recursive: true })

    for (const [fileName, route] of routes) {
      let screenshotData
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        await client.send('Page.navigate', { url: `${baseUrl}${route}` })
        await sleep(attempt === 1 ? 900 : 1800)
        await client.send('Emulation.setDeviceMetricsOverride', {
          width: targetWidth,
          height: targetHeight,
          screenWidth: targetWidth,
          screenHeight: targetHeight,
          deviceScaleFactor: 1,
          mobile: false,
        })
        await sleep(200)
        await client.send('Runtime.evaluate', {
          expression: `Promise.race([
            Promise.all([
              document.fonts.ready,
              ...Array.from(document.images, (image) => image.complete ? Promise.resolve() : new Promise((done) => {
                image.addEventListener('load', done, { once: true });
                image.addEventListener('error', done, { once: true });
              }))
            ]),
            new Promise((done) => setTimeout(done, 1500))
          ]).then(() => window.scrollTo(0, 0))`,
          awaitPromise: true,
        })
        await sleep(250)
        const screenshot = await client.send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
          captureBeyondViewport: false,
        })
        screenshotData = Buffer.from(screenshot.data, 'base64')
        if (screenshotData.length >= 8000) break
      }
      if (!screenshotData || screenshotData.length < 8000) {
        throw new Error(`Capture remained blank for ${viewportName} ${route}`)
      }
      const filePath = join(viewportDir, `${fileName}.png`)
      await writeFile(filePath, screenshotData)
      console.log(`${viewportName.padEnd(7)} ${fileName}`)
    }
  }
} finally {
  client?.close()
  chrome.kill()
  await sleep(500)
  if (profileDir.startsWith(tmpdir())) {
    await rm(profileDir, { recursive: true, force: true }).catch(() => {})
  }
}
