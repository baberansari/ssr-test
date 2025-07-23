import express from "express";
import { createServer as createViteServer } from "vite";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

// Ensure __dirname works in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  // Create Vite dev server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom", // required for middleware usage
  });

  // Use Vite's middleware
  app.use(vite.middlewares);

  // Catch all requests
  app.use("/{*any}", async (req, res) => {
    try {
      const url = req.originalUrl;

      // Read and transform the HTML template
      let template = await readFile(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);

      // Import your SSR render function
      const { render } = await vite.ssrLoadModule("/src/entry-server.js");

      // Call the render function to get app HTML and head tags
      const { appHtml, headTags } = await render(url);

      // Inject head tags before </head> and app HTML into the template
      const htmlWithHead = template
        .replace("<!--HEAD_TAGS-->", headTags || "")
        .replace("<!--app-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(htmlWithHead);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error("❌ SSR error:", e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
  });
}

createServer();
