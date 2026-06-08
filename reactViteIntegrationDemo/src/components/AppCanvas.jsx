import { useRef, useEffect, useState, useCallback } from 'react'
import { JEELIZVTOWIDGET } from 'jeelizvtowidget'
import { DEFAULT_SKU } from '../data/glasses'
import GlassesSelector from './GlassesSelector'
import modlinkLogo from '../assets/modlink_logo.webp'

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
  const refSidebar = useRef(null)

  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdjustMode, setIsAdjustMode] = useState(false)
  const [selectedSku, setSelectedSku] = useState(DEFAULT_SKU)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    const viewer = refPlaceHolder.current
    const sidebar = refSidebar.current
    if (!viewer || !sidebar) return

    const syncSidebarHeight = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        sidebar.style.height = `${viewer.offsetHeight}px`
      } else {
        sidebar.style.height = ''
      }
    }

    syncSidebarHeight()

    const resizeObserver = new ResizeObserver(syncSidebarHeight)
    resizeObserver.observe(viewer)
    window.addEventListener('resize', syncSidebarHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', syncSidebarHeight)
    }
  }, [])

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-ink-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={modlinkLogo}
              alt="Mod Link"
              className="h-8 w-auto sm:h-9"
            />
            <div className="hidden h-6 w-px bg-ink-200 sm:block" aria-hidden="true" />
            <p className="hidden text-sm font-medium text-ink-500 sm:block">Virtual Try-On</p>
          </div>

          {isReady && !isAdjustMode && (
            <button
              type="button"
              onClick={enterAdjustMode}
              disabled={isLoading}
              className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-300 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Adjust fit
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8 lg:px-8 lg:py-8">
        <div
          ref={refPlaceHolder}
          className="relative mx-auto aspect-[3/4] w-full max-h-[min(72vh,680px)] overflow-hidden rounded-2xl border border-ink-200 bg-ink-950 shadow-viewer lg:mx-0 lg:max-h-[calc(100vh-10rem)]"
        >
          <canvas ref={refCanvas} className="viewer-canvas" />

          {isLoading && (
            <div
              className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 bg-white/90"
              aria-live="polite"
              aria-busy="true"
            >
              <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-ink-700"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-ink-600">Loading…</p>
            </div>
          )}

          {isAdjustMode && (
            <div className="absolute inset-x-0 bottom-0 z-[4] flex items-center justify-between gap-3 bg-gradient-to-t from-ink-950/90 to-ink-950/50 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-ink-200">Drag to reposition the frames</p>
              <button
                type="button"
                onClick={exitAdjustMode}
                className="shrink-0 rounded-full bg-mint-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-mint-600"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <aside className="flex w-full flex-col lg:w-[340px]">
          <div
            ref={refSidebar}
            className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-6"
          >
            {error && (
              <div
                className="mb-5 flex shrink-0 items-start justify-between gap-3 rounded-xl border border-coral-500/25 bg-coral-500/10 px-4 py-3"
                role="alert"
              >
                <p className="text-sm text-coral-600">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wide text-coral-500 hover:text-coral-600"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="hidden min-h-0 flex-1 flex-col lg:flex">
              <GlassesSelector
                selectedSku={selectedSku}
                onSelect={handleSelectModel}
                disabled={!isReady || isLoading || isAdjustMode}
                layout="vertical"
              />
              <p className="mt-4 shrink-0 text-center text-xs text-ink-400">
                Center your face in the camera view for the best preview
              </p>
            </div>

            <div className="lg:hidden">
              <GlassesSelector
                selectedSku={selectedSku}
                onSelect={handleSelectModel}
                disabled={!isReady || isLoading || isAdjustMode}
                layout="horizontal"
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
