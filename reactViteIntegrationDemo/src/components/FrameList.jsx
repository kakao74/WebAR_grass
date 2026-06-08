export default function FrameList({ models, selectedSku, onSelect, disabled }) {
  return (
    <div
      role="listbox"
      aria-label="Available frames"
      className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1"
    >
      {models.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-ink-400">No frames match your filters.</p>
      ) : (
        models.map((model) => {
          const isActive = model.sku === selectedSku
          return (
            <button
              key={model.sku}
              type="button"
              role="option"
              aria-selected={isActive}
              disabled={disabled}
              onClick={() => onSelect(model.sku)}
              className={[
                'w-full rounded-lg border px-3 py-2 text-left transition-all duration-200',
                isActive
                  ? 'border-mint-500 bg-mint-500/15 shadow-card ring-1 ring-mint-500/40'
                  : 'border-ink-700 bg-ink-800/60 hover:border-ink-600 hover:bg-ink-800',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-mint-400">
                  {model.brand}
                </span>
                <span className="shrink-0 rounded-full bg-ink-700 px-2 py-0.5 text-[0.65rem] font-medium text-ink-300">
                  {model.type}
                </span>
              </div>
              <span className="mt-1 block text-xs font-semibold leading-snug text-ink-100 line-clamp-2">
                {model.name}
              </span>
              <span className="mt-1 block text-[0.7rem] text-ink-400 line-clamp-1">
                {model.colors.join(' · ')}
              </span>
            </button>
          )
        })
      )}
    </div>
  )
}
