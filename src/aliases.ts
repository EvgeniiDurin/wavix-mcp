/**
 * Module aliases registration
 * Must be imported at the top of the entry point (index.ts)
 *
 * This enables path aliases like @config, @helpers, etc.
 * to work at runtime after TypeScript compilation.
 */

import { addAliases } from "module-alias"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Determine if we're running from source (src/) or build (build/)
const isBuilt = __dirname.includes("/build")
const baseDir = isBuilt ? __dirname : join(__dirname)

addAliases({
  "@root": baseDir,
  "@config": join(baseDir, "config"),
  "@interfaces": join(baseDir, "interfaces"),
  "@helpers": join(baseDir, "helpers"),
  "@tools": join(baseDir, "tools"),
  "@api": join(baseDir, "api"),
  "@resources": join(baseDir, "resources")
})
