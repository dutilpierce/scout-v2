const fs = require("fs")
const path = require("path")

const root = process.cwd()
const assets = path.join(root, "assets")

// Valid tiny PNG placeholder (1x1).
const base64Png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/ax0lL8AAAAASUVORK5CYII="
const buf = Buffer.from(base64Png, "base64")
const sizes = [16, 32, 48, 64, 128]

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function ensureAssets() {
  ensureDir(assets)
  for (const s of sizes) {
    const f = path.join(assets, `icon${s}.png`)
    if (!fs.existsSync(f)) fs.writeFileSync(f, buf)
  }
}

function copyToGenAssets(genDir) {
  ensureDir(genDir)
  for (const s of sizes) {
    const from = path.join(assets, `icon${s}.png`)
    const to = path.join(genDir, `icon${s}.plasmo.png`)
    fs.copyFileSync(from, to)
  }
}

function run() {
  ensureAssets()

  const plasmoRoot = path.join(root, ".plasmo")
  const targets = [
    path.join(plasmoRoot, "gen-assets"),
    path.join(plasmoRoot, "chrome-mv3", "gen-assets"),
    path.join(plasmoRoot, "chrome-mv3-dev", "gen-assets")
  ]

  for (const t of targets) {
    if (fs.existsSync(path.dirname(t)) || t.includes("gen-assets")) {
      try {
        copyToGenAssets(t)
      } catch {}
    }
  }

  console.log("Ensured Plasmo gen-assets icons in:", targets.join(", "))
}

run()
