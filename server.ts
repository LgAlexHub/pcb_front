import { serveDir } from "https://deno.land/std@0.200.0/http/file_server.ts";

Deno.serve((req) => {
  const { pathname } = new URL(req.url);

  // Routes de l'application Vue
  const vueRoutes = ["/", "/game"];
  
  // Logique pour servir index.html pour les routes Vue et les fichiers statiques
  if (
    pathname === "/" || 
    vueRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith("/assets/") ||
    pathname === "/index.html"
  ) {
    return serveDir(req, {
      fsRoot: "./dist",
      urlRoot: "",
      showIndex: true,
      showDotfiles: false,
    });
  }

  // Fallback pour toujours servir index.html (support du routing côté client)
  return serveDir(req, {
    fsRoot: "./dist",
    urlRoot: "",
    showIndex: true,
  });
});