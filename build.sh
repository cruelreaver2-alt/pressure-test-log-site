#!/bin/sh
# Assemble the Cloudflare Pages output.
# Published files only. Docs, the local server, and this script stay in git
# and are not copied into dist/.
set -eu
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist
cp index.html robots.txt _headers _redirects dist/
cp -R css js assets fonts dist/
