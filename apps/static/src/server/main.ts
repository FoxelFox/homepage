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

            let p = requestedPath.split('/');
            if (p[1] === "api") {
                return backend.router[requestedPath]();
            }

            if (requestedPath === "/") {
                requestedPath = "/index.html";
            }

            const safeSuffix = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
            const filePath = path.join(publicDir, safeSuffix);

            const file = Bun.file(filePath);

            if (await file.exists()) {
                console.log(new Date().toLocaleString(), 200, requestedPath);
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
                console.log(new Date().toLocaleString(), 404, requestedPath);
                return new Response("404 😔",{status: 404});
            }
        },
    });
});