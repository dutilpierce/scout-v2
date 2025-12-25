const fs = require("fs")
const path = require("path")

const assetsDir = path.join(process.cwd(), "assets")
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true })

// A simple valid 1x1 PNG (black) encoded as base64.
// We will write the same PNG bytes to each icon file to satisfy Plasmo.
// Chrome accepts any valid PNG file regardless of its pixel size for dev builds.
const base64Png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/ax0lL8AAAAASUVORK5CYII="

const buf = Buffer.from(base64Png, "base64")

for (const size of [16, 32, 48, 64, 128]) {
  const file = path.join(assetsDir, `icon${size}.png`)
  fs.writeFileSync(file, buf)
  console.log("Wrote", file)
}

console.log("Done.")
