import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Read base HTML template
const template = fs.readFileSync(
  path.resolve(__dirname, "dist/client/index.html"),
  "utf-8"
);

// Serve static assets from client build
app.use(
  "/assets",
  express.static(path.resolve(__dirname, "dist/client/assets"))
);

// Universal route handler for SSR
 app.use("/{*any}", async (req, res) => {
  try {
    const { render } = await import("./dist/server/entry-server.js");
    const { appHtml, headTags, ssrData } = await render(req.originalUrl);

    const htmlWithHead = template
      .replace("<!--HEAD_TAGS-->", headTags || "")
      .replace(
        "<!--app-->",
        appHtml +
          `\n<script>window.__SSR_DATA__ = ${JSON.stringify(ssrData)}</script>`
      );

    res.status(200).set({ "Content-Type": "text/html" }).end(htmlWithHead);
  } catch (err) {
    console.error("SSR error:", err);
    res.status(500).end("Internal Server Error");
  }
});

app.listen(4173, () => {
  console.log("✅ Production server running at http://localhost:4173");
});
