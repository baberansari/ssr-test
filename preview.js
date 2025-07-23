import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const template = fs.readFileSync(
  path.resolve(__dirname, "dist/client/index.html"),
  "utf-8"
);

app.use(
  "/assets",
  express.static(path.resolve(__dirname, "dist/client/assets"))
);

app.use("/{*any}", async (req, res) => {
  const render = (await import("./dist/server/entry-server.js")).render;
  const { appHtml, headTags } = await render(req.originalUrl);

  const html = template
    .replace("<!--HEAD_TAGS-->", headTags || "")
    .replace("<!--app-->", appHtml);

  res.status(200).set({ "Content-Type": "text/html" }).end(html);
});

app.listen(4173, () => {
  console.log("✅ Production server running at http://localhost:4173");
});
