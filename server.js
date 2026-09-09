import express from "express";
import { createServer } from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const app = express();
const port = process.env.PORT || 3000;

// Serve your existing files (index.html, sw.js, controller/, scramjet/)
// from the project root, exactly like Render's static hosting did.
app.use(express.static("./"));

const httpServer = createServer(app);

// Route WebSocket upgrade requests under /wisp/ to the wisp server.
// Everything else (normal HTTP requests) still goes to express/static above.
httpServer.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.destroy();
    }
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
