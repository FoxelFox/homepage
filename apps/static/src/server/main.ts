import * as path from "node:path";
import * as fs from "node:fs";

const publicDir = "/var/www/public";

class Backend {

    demos = () => {
        const dirs = fs.readdirSync(publicDir,  { withFileTypes: true }).filter(e => e.isDirectory()).sort((a,b) => a.name.localeCompare(b.name) )
        const data = [];
        for (let dir of dirs){
            data.push({
                name: dir.name,
                url: dir.name + '/index.html'
            })
        }
        return Response.json(data);
    };

    websocket = () => {

    };

    router = {
        '/api/demos': this.demos,
    }

    async main() {
        // init stuff
    }
}


const backend = new Backend();

backend.main().then(() => {
    Bun.serve({
        async fetch(req) {

            let requestedPath = new URL(req.url).pathname;
            console.log(requestedPath)

            let p = requestedPath.split('/');
            if (p[1] === "api") {
                return backend.router[requestedPath]();
            }


            if (requestedPath === "/") {
                requestedPath = "/index.html";
            }

            console.log(requestedPath)

            const safeSuffix = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
            const filePath = path.join(publicDir, safeSuffix);

            const file = Bun.file(filePath);

            if (await file.exists()) {
                return new Response(
                    Bun.gzipSync(await file.arrayBuffer()),
                    {
                        headers: {
                            'Content-Type': file.type,
                            'Content-Encoding': 'gzip',
                            'Cross-Origin-Embedder-Policy': 'credentialless',
                            'Cross-Origin-Opener-Policy': 'same-origin',
                            // 'Cross-Origin-Resource-Policy': 'cross-origin'
                        }
                    }
                );
            } else {
                return new Response("404!")
            }
        },
    });
});