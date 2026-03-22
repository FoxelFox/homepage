import * as path from 'node:path'
import * as fs from 'node:fs'

const publicDir = '/var/www/public'

class Backend {
  demos = async () => {
    const dirs = fs
      .readdirSync(publicDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
    const data = []
    for (let dir of dirs) {
      const entry = {
        name: dir.name,
        url: dir.name + '/index.html',
        meta: undefined,
      }
      try {
        entry.meta = await Bun.file(publicDir + '/' + dir.name + '/meta.json').json()
      } catch (e) {}

      data.push(entry)
    }
    return Response.json(data)
  }

  websocket = () => {}

  router = {
    '/api/demos': this.demos,
  }

  async main() {
    // init stuff
  }
}

const backend = new Backend()

backend.main().then(() => {
  Bun.serve({
    async fetch(req) {
      let requestedPath = new URL(req.url).pathname

      let p = requestedPath.split('/')
      if (p[1] === 'api') {
        return backend.router[requestedPath]()
      }

      if (requestedPath === '/') {
        requestedPath = '/index.html'
      }

      const safeSuffix = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '')
      const filePath = path.join(publicDir, safeSuffix)

      const file = Bun.file(filePath)
      if (await file.exists()) {
        // TODO Use this if bun can handle it
        // const fileStream = file.stream();
        // const compressionStream = new CompressionStream('gzip');
        // const compressedStream = fileStream.pipeThrough(compressionStream);

        console.log(new Date().toLocaleString(), 200, requestedPath)
        return new Response(
          //compressedStream, // TODO replace with compressedStream
          Bun.gzipSync(await file.arrayBuffer()),
          {
            headers: {
              'Content-Type': file.type,
              'Content-Encoding': 'gzip',
              'Cross-Origin-Embedder-Policy': 'credentialless',
              'Cross-Origin-Opener-Policy': 'same-origin',
              // 'Cross-Origin-Resource-Policy': 'cross-origin'
            },
          },
        )
      } else {
        console.log(new Date().toLocaleString(), 404, requestedPath)
        return new Response('404 😔', { status: 404 })
      }
    },
  })
})
