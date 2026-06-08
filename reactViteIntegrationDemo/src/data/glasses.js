import csvText from '../../../glassesSKU.csv?raw'
import { extractColors, extractType, formatBrand } from './frameMeta'

function parseGlassesCSV(text) {
  return text
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => {
      const commaIndex = line.indexOf(',')
      if (commaIndex === -1) return null

      const sku = line.slice(0, commaIndex).trim()
      const name = line.slice(commaIndex + 1).trim()
      if (!sku) return null

      const parts = sku.split('_')
      const brandKey = parts[0]

      return {
        sku,
        name: name || sku,
        brand: formatBrand(brandKey),
        type: extractType(parts),
        colors: extractColors(parts),
      }
    })
    .filter(Boolean)
}

export const GLASSES_MODELS = parseGlassesCSV(csvText)
export const DEFAULT_SKU = GLASSES_MODELS[0]?.sku ?? 'rayban_aviator_or_vertFlash'
