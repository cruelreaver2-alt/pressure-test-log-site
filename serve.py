"""Serve dist/ locally. Cloudflare Pages does not run this file."""

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

SimpleHTTPRequestHandler.extensions_map.update(
    {
        ".webp": "image/webp",
        ".woff2": "font/woff2",
        ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
    }
)


def main() -> None:
    if not os.path.isfile(os.path.join(ROOT, "index.html")):
        raise SystemExit("dist/index.html is missing. Run: bash build.sh")
    handler = partial(SimpleHTTPRequestHandler, directory=ROOT)
    server = ThreadingHTTPServer(("0.0.0.0", 4178), handler)
    print("Serving dist/ on http://127.0.0.1:4178", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
