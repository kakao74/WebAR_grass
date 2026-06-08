import { useEffect, useMemo, useState } from 'react'
import { GLASSES_MODELS } from '../data/glasses'
import { buildCascadingFilterOptions, filterModels } from '../data/frameMeta'

export function useFrameFilters() {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [type, setType] = useState('all')
  const [color, setColor] = useState('all')

  const filters = useMemo(
    () => ({ query, brand, type, color }),
    [query, brand, type, color],
  )

  const filterOptions = useMemo(
    () => buildCascadingFilterOptions(GLASSES_MODELS, filters),
    [filters],
  )

  const filteredModels = useMemo(
    () => filterModels(GLASSES_MODELS, filters),
    [filters],
  )

  useEffect(() => {
    if (brand !== 'all' && !filterOptions.brands.includes(brand)) setBrand('all')
    if (type !== 'all' && !filterOptions.types.includes(type)) setType('all')
    if (color !== 'all' && !filterOptions.colors.includes(color)) setColor('all')
  }, [brand, type, color, filterOptions.brands, filterOptions.types, filterOptions.colors])

  const hasActiveFilters =
    query.trim() !== '' || brand !== 'all' || type !== 'all' || color !== 'all'

  const clearFilters = () => {
    setQuery('')
    setBrand('all')
    setType('all')
    setColor('all')
  }

  return {
    query,
    setQuery,
    brand,
    setBrand,
    type,
    setType,
    color,
    setColor,
    filteredModels,
    hasActiveFilters,
    clearFilters,
    filterOptions,
    totalCount: GLASSES_MODELS.length,
  }
}
