const fs = require("fs")
const path = require("path")

const root = process.cwd()
const nm = path.join(root, "node_modules")

function walk(dir) {
  let out = []
  try {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        // Skip very large dirs that won't contain jiti source
        if (ent.name === ".git") continue
        out = out.concat(walk(p))
      } else if (ent.isFile() && ent.name === "jiti.cjs") {
        out.push(p)
      }
    }
  } catch {
    // ignore permission/ENOENT during partial installs
  }
  return out
}

if (!fs.existsSync(nm)) {
  console.log("No node_modules found; skipping jiti patch.")
  process.exit(0)
}

const targets = walk(nm)
let patched = 0

for (const file of targets) {
  try {
    const s = fs.readFileSync(file, "utf8")
    if (s.includes("node:module")) {
      fs.writeFileSync(file, s.replaceAll("node:module", "module"), "utf8")
      patched++
      console.log("Patched:", file)
    }
  } catch (e) {
    // ignore per-file issues
  }
}

console.log(`Done. Patched ${patched} file(s).`)
