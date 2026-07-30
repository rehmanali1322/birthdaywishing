import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const dirFlag = args.indexOf("--dir");
const portFlag = args.indexOf("--port");
const root = path.resolve(dirFlag >= 0 ? args[dirFlag + 1] : ".");
const port = Number(portFlag >= 0 ? args[portFlag + 1] : process.env.PORT || 3000);
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".webp":"image/webp", ".gif":"image/gif", ".wav":"audio/wav", ".mp3":"audio/mpeg", ".ogg":"audio/ogg", ".json":"application/json" };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const requested = path.resolve(root, `.${pathname}`);
    if (!requested.startsWith(root)) throw new Error("Invalid path");
    let filePath = requested;
    try {
      const info = await stat(filePath);
      if (info.isDirectory()) filePath = path.join(filePath, "index.html");
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream", "cache-control":"no-store" });
    res.end(body);
  } catch {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bad request");
  }
});
server.listen(port, "0.0.0.0", () => console.log(`Birthday site running at http://localhost:${port} (root: ${root})`));
