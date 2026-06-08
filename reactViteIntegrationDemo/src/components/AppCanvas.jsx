import { useRef, useEffect, useState, useCallback } from 'react'
import { JEELIZVTOWIDGET } from 'jeelizvtowidget'
import { DEFAULT_SKU } from '../data/glasses'
import { useFrameFilters } from '../hooks/useFrameFilters'
import FrameFilters from './FrameFilters'
import FrameList from './FrameList'
import modlinkLogo from '../assets/modlink_logo_gray.webp'

const ERROR_MESSAGES = {
  WEBCAM_UNAVAILABLE: 'Camera access is required. Please allow camera permissions and try again.',
  INVALID_SKU: 'This frame model could not be loaded.',
  PLACEHOLDER_NULL_WIDTH: 'Display area is not ready. Please refresh the page.',
  PLACEHOLDER_NULL_HEIGHT: 'Display area is not ready. Please refresh the page.',
  FATAL: 'Something went wrong. Please refresh and try again.',
}

function initVTOWidget(placeHolder, canvas, callbacks) {
  return JEELIZVTOWIDGET.start({
    placeHolder,
    canvas,
    callbacks: {
      ADJUST_START: callbacks.onAdjustStart,
      ADJUST_END: callbacks.onAdjustEnd,
      LOADING_START: callbacks.onLoadingStart,
      LOADING_END: callbacks.onLoadingEnd,
    },
    sku: DEFAULT_SKU,
    callbackReady: callbacks.onReady,
    onError: callbacks.onError,
  })
}

export default function AppCanvas() {
  const refPlaceHolder = useRef(null)
  const refCanvas = useRef(null)

  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdjustMode, setIsAdjustMode] = useState(false)
  const [selectedSku, setSelectedSku] = useState(DEFAULT_SKU)
  const [error, setError] = useState(null)

  const {
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
    totalCount,
  } = useFrameFilters()

  const handleSelectModel = useCallback((sku) => {
    setSelectedSku(sku)
    JEELIZVTOWIDGET.load(sku)
  }, [])

  const enterAdjustMode = useCallback(() => {
    JEELIZVTOWIDGET.enter_adjustMode()
  }, [])

  const exitAdjustMode = useCallback(() => {
    JEELIZVTOWIDGET.exit_adjustMode()
  }, [])

  useEffect(() => {
    const placeHolder = refPlaceHolder.current
    const canvas = refCanvas.current
    if (!placeHolder || !canvas) return

    initVTOWidget(placeHolder, canvas, {
      onReady: () => setIsReady(true),
      onLoadingStart: () => setIsLoading(true),
      onLoadingEnd: () => setIsLoading(false),
      onAdjustStart: () => setIsAdjustMode(true),
      onAdjustEnd: () => setIsAdjustMode(false),
      onError: (errorLabel) => {
        setError(ERROR_MESSAGES[errorLabel] || ERROR_MESSAGES.FATAL)
        setIsLoading(false)
      },
    })

    return () => {
      JEELIZVTOWIDGET.destroy?.()
    }
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink-950">
      <header className="shrink-0 border-b border-ink-800 bg-ink-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={modlinkLogo} alt="Mod Link" className="h-7 w-auto sm:h-8" />
            <div className="hidden h-5 w-px bg-ink-700 sm:block" aria-hidden="true" />
            <p className="hidden text-sm font-medium text-ink-400 sm:block">Virtual Try-On</p>
          </div>

          {isReady && !isAdjustMode && (
            <button
              type="button"
              onClick={enterAdjustMode}
              disabled={isLoading}
              className="rounded-full border border-ink-700 bg-ink-800 px-3.5 py-1.5 text-sm font-semibold text-ink-200 transition hover:border-ink-600 hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Adjust fit
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 py-3 sm:px-6 lg:gap-4 lg:px-8">
        <FrameFilters
          query={query}
          onQueryChange={setQuery}
          brand={brand}
          onBrandChange={setBrand}
          type={type}
          onTypeChange={setType}
          color={color}
          onColorChange={setColor}
          brands={filterOptions.brands}
          types={filterOptions.types}
          colors={filterOptions.colors}
          resultCount={filteredModels.length}
          totalCount={totalCount}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden max-lg:grid-rows-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-4">
          <div
            ref={refPlaceHolder}
            className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-ink-800 bg-black shadow-viewer"
          >
            <canvas ref={refCanvas} className="viewer-canvas" />

            {isLoading && (
              <div
                className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 bg-ink-950/85 backdrop-blur-sm"
                aria-live="polite"
                aria-busy="true"
              >
                <div
                  className="h-9 w-9 animate-spin rounded-full border-4 border-ink-700 border-t-mint-400"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-ink-300">Loading…</p>
              </div>
            )}

            {isAdjustMode && (
              <div className="absolute inset-x-0 bottom-0 z-[4] flex items-center justify-between gap-3 bg-gradient-to-t from-black/90 to-black/50 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm text-ink-300">Drag to reposition the frames</p>
                <button
                  type="button"
                  onClick={exitAdjustMode}
                  className="shrink-0 rounded-full bg-mint-500 px-4 py-1.5 text-sm font-semibold text-ink-950 transition hover:bg-mint-400"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <aside className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-2.5 shadow-card sm:p-3">
              {error && (
                <div
                  className="mb-2 flex shrink-0 items-start justify-between gap-2 rounded-lg border border-coral-500/30 bg-coral-500/10 px-3 py-2"
                  role="alert"
                >
                  <p className="text-xs text-coral-300">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="shrink-0 text-xs font-semibold text-coral-400 hover:text-coral-300"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <FrameList
                models={filteredModels}
                selectedSku={selectedSku}
                onSelect={handleSelectModel}
                disabled={!isReady || isLoading || isAdjustMode}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
