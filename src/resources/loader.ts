/**
 * Documentation Resources Loader
 *
 * Loads documentation from multiple sources:
 * - api/ - API documentation from docs.wavix.com (Mintlify)
 * - product/ - Product documentation from wavix.com (FAQ, Pricing)
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { logger } from "../helpers/logger.js"

const log = logger.child({ module: "resources-loader" })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface DocumentMetadata {
  id: string
  uri: string
  file: string
  title: string
  description?: string
  category?: string
  tags?: Array<string>
  relatedTools?: Array<string>
}

export interface SourceManifest {
  source: string
  type: string
  repo?: string
  exportedAt?: string
  syncedAt?: string
  uriPrefix: string
  documents: Array<DocumentMetadata>
}

export interface LoadedResource {
  uri: string
  name: string
  description: string
  mimeType: string
  metadata: DocumentMetadata
  sourcePath: string
}

// Resource sources configuration
const RESOURCE_SOURCES = [
  { dir: "api", name: "API Documentation" },
  { dir: "product", name: "Product Documentation" },
  { dir: "code-snippets", name: "Code Snippets" }
]

let cachedResources: Map<string, LoadedResource> | null = null

/**
 * Load all resources from configured sources
 */
export function loadResources(): Map<string, LoadedResource> {
  if (cachedResources) {
    return cachedResources
  }

  cachedResources = new Map()

  for (const source of RESOURCE_SOURCES) {
    const sourceDir = path.join(__dirname, source.dir)
    const manifestPath = path.join(sourceDir, "_source.json")

    if (!fs.existsSync(manifestPath)) {
      log.debug(`No manifest found for ${source.name}`, { path: manifestPath })
      continue
    }

    try {
      const manifestRaw = fs.readFileSync(manifestPath, "utf-8")
      const manifest = JSON.parse(manifestRaw) as SourceManifest
      log.info(`Loading ${source.name}`, { documents: manifest.documents.length })

      for (const doc of manifest.documents) {
        const resource: LoadedResource = {
          uri: doc.uri,
          name: doc.title,
          description: doc.description || `${doc.title} documentation`,
          mimeType: "text/markdown",
          metadata: doc,
          sourcePath: path.join(sourceDir, doc.file)
        }

        cachedResources.set(doc.uri, resource)
      }
    } catch (error) {
      log.error(`Failed to load ${source.name}`, { error })
    }
  }

  log.info(`Total resources loaded: ${cachedResources.size}`)
  return cachedResources
}

/**
 * Get a resource by URI
 */
export function getResource(uri: string): LoadedResource | undefined {
  const resources = loadResources()
  return resources.get(uri)
}

/**
 * Read resource content
 */
export function readResourceContent(resource: LoadedResource): string {
  if (!fs.existsSync(resource.sourcePath)) {
    throw new Error(`Resource file not found: ${resource.sourcePath}`)
  }

  return fs.readFileSync(resource.sourcePath, "utf-8")
}

/**
 * List all resources
 */
export function listResources(): Array<LoadedResource> {
  const resources = loadResources()
  return Array.from(resources.values())
}

/**
 * Search resources by query
 */
export function searchResources(query: string): Array<LoadedResource> {
  const resources = loadResources()
  const queryLower = query.toLowerCase()

  return Array.from(resources.values()).filter(resource => {
    return (
      resource.name.toLowerCase().includes(queryLower) ||
      resource.description.toLowerCase().includes(queryLower) ||
      resource.metadata.tags?.some(tag => tag.toLowerCase().includes(queryLower)) ||
      resource.metadata.category?.toLowerCase().includes(queryLower)
    )
  })
}

/**
 * Get resources by category
 */
export function getResourcesByCategory(category: string): Array<LoadedResource> {
  const resources = loadResources()
  return Array.from(resources.values()).filter(r => r.metadata.category === category)
}

/**
 * Clear the resources cache (for testing or refresh)
 */
export function clearResourcesCache(): void {
  cachedResources = null
}
