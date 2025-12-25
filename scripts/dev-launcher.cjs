const { spawn } = require("child_process")

function runEnsure() {
  try {
    require("./ensure-plasmo-icons.cjs")
  } catch (e) {
    console.error("ensure-plasmo-icons failed:", e?.message || e)
  }
}

runEnsure()

// Start plasmo dev as a child process
const child = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["plasmo", "dev"], {
  stdio: "inherit"
})

// Re-apply icons shortly after start (Plasmo can recreate .plasmo quickly)
setTimeout(runEnsure, 1000)
setTimeout(runEnsure, 3000)

child.on("exit", (code) => process.exit(code ?? 0))
