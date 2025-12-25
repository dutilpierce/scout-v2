import type { PlasmoManifest } from "plasmo"

const manifest: PlasmoManifest = {
  manifest_version: 3,
  name: "Scout v2",
  version: "0.1.0",
  description: "AI recommendation sidebar for Google Search",
  action: {
    default_title: "Scout v2"
  },
  permissions: ["storage"],
  host_permissions: ["https://www.google.com/search*", "https://www.google.com/*"],
  background: {
    service_worker: "background.ts",
    type: "module"
  }
}

export default manifest
