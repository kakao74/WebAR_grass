import { GLASSES_MODELS } from '../data/glasses'

export default function GlassesSelector({ selectedSku, onSelect, disabled, layout = 'horizontal' }) {
  const isVertical = layout === 'vertical'

  return (
    <section
      aria-label="Frame selection"
      className={isVertical ? 'flex min-h-0 flex-1 flex-col gap-4' : 'flex flex-col gap-4'}
    >
      <div className="shrink-0">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">Choose your frame</h2>
        <p className="mt-1 text-sm text-ink-500">Select a style to try on in real time</p>
      </div>

      <div
        role="listbox"
        aria-label="Available frames"
        className={
          isVertical
            ? 'scrollbar-thin flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1'
            : 'scrollbar-thin -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1'
        }
      >
        {GLASSES_MODELS.map((model) => {
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
                'rounded-xl border text-left transition-all duration-200',
                isVertical ? 'w-full px-4 py-3.5' : 'min-w-[148px] shrink-0 px-4 py-3.5',
                isActive
                  ? 'border-mint-500 bg-mint-500/10 shadow-card ring-1 ring-mint-500/30'
                  : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="block text-[0.68rem] font-semibold uppercase tracking-widest text-coral-500">
                {model.brand}
              </span>
              <span className="mt-1.5 block text-sm font-semibold text-ink-800">{model.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
