const inputClassName =
  'h-8 w-full min-w-0 rounded-lg border border-ink-700 bg-ink-800 px-2.5 text-sm text-ink-100 outline-none transition placeholder:text-ink-500 focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25'

const selectClassName =
  'h-8 w-full min-w-0 rounded-lg border border-ink-700 bg-ink-800 px-2 text-sm text-ink-100 outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25'

export default function FrameFilters({
  query,
  onQueryChange,
  brand,
  onBrandChange,
  type,
  onTypeChange,
  color,
  onColorChange,
  brands,
  types,
  colors,
  resultCount,
  totalCount,
  hasActiveFilters,
  onClear,
}) {
  return (
    <div className="shrink-0 rounded-xl border border-ink-800 bg-ink-900 px-3 py-2 shadow-card sm:px-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
        <div className="flex shrink-0 items-center gap-2 lg:min-w-[148px]">
          <h2 className="whitespace-nowrap text-sm font-semibold text-ink-100">Frames</h2>
          <span className="whitespace-nowrap text-xs text-ink-400">
            {resultCount}/{totalCount}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="whitespace-nowrap text-xs font-semibold text-coral-400 transition hover:text-coral-300"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <input
            id="frame-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search…"
            aria-label="Search frames"
            className={`${inputClassName} sm:min-w-[120px] sm:flex-[1.2]`}
          />

          <select
            id="brand-filter"
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
            aria-label="Filter by brand"
            className={`${selectClassName} sm:min-w-[100px] sm:flex-1`}
          >
            <option value="all">All brands</option>
            {brands.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <select
            id="type-filter"
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
            aria-label="Filter by type"
            className={`${selectClassName} sm:min-w-[96px] sm:flex-1`}
          >
            <option value="all">All types</option>
            {types.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <select
            id="color-filter"
            value={color}
            onChange={(event) => onColorChange(event.target.value)}
            aria-label="Filter by color"
            className={`${selectClassName} sm:min-w-[96px] sm:flex-1`}
          >
            <option value="all">All colors</option>
            {colors.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
