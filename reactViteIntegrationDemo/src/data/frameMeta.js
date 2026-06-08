const BRAND_NAMES = {
  rayban: 'Ray-Ban',
  oakley: 'Oakley',
  carrera: 'Carrera',
  gucci: 'Gucci',
  prada: 'Prada',
  dior: 'Dior',
  burberry: 'Burberry',
  persol: 'Persol',
  polaroid: 'Polaroid',
  mykita: 'Mykita',
  thierry: 'Thierry Lasry',
  blaze: 'Blaze',
  blazeaviator: 'Blaze Aviator',
  catalyst: 'Catalyst',
  frogskins: 'Frogskins',
  holbrook: 'Holbrook',
  latch: 'Latch',
  marshal: 'Marshal',
  flak: 'Flak',
  outdoorsman: 'Outdoorsman',
  smcc: 'SMCC',
  aliexpress: 'AliExpress',
}

const TYPE_LABELS = {
  aviator: 'Aviator',
  wayfarer: 'Wayfarer',
  new: 'New Wayfarer',
  clubmaster: 'Clubmaster',
  clubmasterfleck: 'Clubmaster',
  clubround: 'Clubround',
  round: 'Round',
  doublebridge: 'Double Bridge',
  erika: 'Erika',
  justin: 'Justin',
  boyfriend: 'Boyfriend',
  chris: 'Chris',
  cockpit: 'Cockpit',
  predator: 'Predator',
  caravan: 'Caravan',
  andy: 'Andy',
  steampunk: 'Steampunk',
  cateye: 'Cat Eye',
  cateye01: 'Cat Eye',
  cateye02: 'Cat Eye',
  holbrook: 'Holbrook',
  frogskins: 'Frogskins',
  radar: 'Radar',
  jawbreak: 'Jawbreaker',
  latch: 'Latch',
  marshal: 'Marshal',
  flak: 'Flak',
  catalyst: 'Catalyst',
  shooter: 'Shooter',
  hexagonal: 'Hexagonal',
  ferrari: 'Ferrari',
  thuglife: 'Thug Life',
  veithdia: 'Veithdia',
  polarsnow: 'Polarsnow',
  genral: 'General',
  db: 'DB',
  rb4380n: 'RB4380N',
  po0649: 'PO0649',
  po3105s: 'PO3105S',
  po0714: 'PO0714',
  '118s': '118/S',
  '113s': '113/S',
  '119s': '119/S',
  '114s': '114/S',
  '116s': '116/S',
  '5029': '5029',
  '5003': '5003',
  '6008': '6008',
  m2: 'M2',
  '7009': '7009',
}

const COLOR_RULES = [
  { color: 'Black', match: /noir|black|matteblack|mat_black/i },
  { color: 'Havana', match: /havane|havana|tortoise/i },
  { color: 'Blue', match: /bleu|blue/i },
  { color: 'Green', match: /vert|green|greeb/i },
  { color: 'Grey', match: /gris|grey|gray/i },
  { color: 'Gold', match: /(?:^|_)or(?:_|$)|gold|cuivre/i },
  { color: 'Silver', match: /argent|silver/i },
  { color: 'Brown', match: /marron|brown|brass/i },
  { color: 'Bronze', match: /bronze/i },
  { color: 'Purple', match: /violet|purple|lilas/i },
  { color: 'Pink', match: /rose|pink/i },
  { color: 'Orange', match: /orange/i },
  { color: 'Red', match: /red/i },
  { color: 'Gunmetal', match: /gun|gunmetal/i },
  { color: 'Denim', match: /denim/i },
  { color: 'Cyan', match: /cyan/i },
  { color: 'Yellow', match: /yellow|jaune/i },
  { color: 'White', match: /white/i },
  { color: 'Clear', match: /transparent|clear/i },
]

export function formatBrand(brandKey) {
  const key = brandKey.toLowerCase()
  if (BRAND_NAMES[key]) return BRAND_NAMES[key]
  return brandKey.charAt(0).toUpperCase() + brandKey.slice(1)
}

const PRODUCT_LINE_PREFIXES = new Set([
  'flak',
  'holbrook',
  'frogskins',
  'latch',
  'marshal',
  'catalyst',
  'blaze',
  'blazeaviator',
  'outdoorsman',
  'mykita',
  'thierry',
  'smcc',
  'gucci',
  'prada',
  'dior',
  'burberry',
  'polaroid',
  'persol',
])

export function extractType(parts) {
  if (parts.length < 2) return 'Other'

  const brandKey = parts[0].toLowerCase()

  if (brandKey === 'oakley') {
    if (parts[1]?.toLowerCase() === 'radar' && parts[2]?.toLowerCase() === 'path') return 'Radar Path'
    const oakleyType = parts[1]?.toLowerCase()
    if (TYPE_LABELS[oakleyType]) return TYPE_LABELS[oakleyType]
  }

  if (PRODUCT_LINE_PREFIXES.has(brandKey)) {
    return TYPE_LABELS[brandKey] || formatBrand(brandKey)
  }

  const second = parts[1].toLowerCase()
  const third = parts[2]?.toLowerCase()

  if (second === 'new' && third === 'wayfarer') return 'New Wayfarer'
  if (second === 'round' && third === 'doublebridge') return 'Double Bridge'
  if (second === 'wayfarer' && third === 'style') return 'Wayfarer Style'
  if (second === 'clubmaster' && third === 'style') return 'Clubmaster Style'

  const key = second.replace(/[^a-z0-9]/gi, '')
  if (TYPE_LABELS[key]) return TYPE_LABELS[key]

  if (key.startsWith('clubmaster')) return 'Clubmaster'
  if (key.startsWith('wayfarer')) return 'Wayfarer'
  if (key.startsWith('cateye')) return 'Cat Eye'

  return parts[1]
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (char) => char.toUpperCase())
}

export function extractColors(parts) {
  const body = parts.slice(1).join('_')
  const colors = new Set()

  COLOR_RULES.forEach(({ color, match }) => {
    if (match.test(body)) colors.add(color)
  })

  return colors.size > 0 ? [...colors].sort() : ['Other']
}

export function buildFilterOptions(models) {
  const brands = new Set()
  const types = new Set()
  const colors = new Set()

  models.forEach((model) => {
    brands.add(model.brand)
    types.add(model.type)
    model.colors.forEach((value) => colors.add(value))
  })

  return {
    brands: [...brands].sort(),
    types: [...types].sort(),
    colors: [...colors].sort(),
  }
}

export function buildCascadingFilterOptions(models, filters) {
  const brands = buildFilterOptions(
    filterModels(models, { ...filters, brand: 'all' }),
  ).brands
  const types = buildFilterOptions(
    filterModels(models, { ...filters, type: 'all' }),
  ).types
  const colors = buildFilterOptions(
    filterModels(models, { ...filters, color: 'all' }),
  ).colors

  return { brands, types, colors }
}

export function filterModels(models, { query, brand, type, color }) {
  const normalizedQuery = query.trim().toLowerCase()

  return models.filter((model) => {
    if (brand !== 'all' && model.brand !== brand) return false
    if (type !== 'all' && model.type !== type) return false
    if (color !== 'all' && !model.colors.includes(color)) return false

    if (!normalizedQuery) return true

    return (
      model.sku.toLowerCase().includes(normalizedQuery) ||
      model.name.toLowerCase().includes(normalizedQuery) ||
      model.brand.toLowerCase().includes(normalizedQuery) ||
      model.type.toLowerCase().includes(normalizedQuery) ||
      model.colors.some((value) => value.toLowerCase().includes(normalizedQuery))
    )
  })
}
