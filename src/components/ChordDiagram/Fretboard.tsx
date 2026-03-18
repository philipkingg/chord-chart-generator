import { useRef, useEffect } from 'react'
import { StringState } from '../../types/chord'
import { FRET_COUNT } from '../../utils/noteUtils'

interface FretboardProps {
  strings: StringState[]
  startFret: number
  onFretSet: (stringIndex: number, fret: number, active: boolean) => void
}

/**
 * SVG-based clickable fretboard grid with click-and-drag support.
 * Strings run vertically (left=low E, right=high E).
 * Frets run horizontally (top=nut side).
 */
export function Fretboard({ strings, startFret, onFretSet }: FretboardProps) {
  const STRING_COUNT = 6
  const cellWidth = 36
  const cellHeight = 44
  const nutHeight = 6
  const dotRadius = 11

  const svgWidth = cellWidth * STRING_COUNT
  const svgHeight = nutHeight + cellHeight * FRET_COUNT

  const showFretLabel = startFret > 1

  const INLAY_FRETS = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21, 24])
  const DOUBLE_INLAY_FRETS = new Set([12, 24])
  const inlayRadius = 4
  const inlayColor = '#27272f'

  // Drag state: null when not dragging, otherwise tracks whether we're activating or deactivating
  const dragRef = useRef<{ action: 'activate' | 'deactivate' } | null>(null)

  useEffect(() => {
    const handleMouseUp = () => { dragRef.current = null }
    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  function handleCellMouseDown(stringIndex: number, fret: number, e: React.MouseEvent) {
    e.preventDefault()
    const current = strings[stringIndex]
    const isActive = typeof current === 'number' && current === fret
    dragRef.current = { action: isActive ? 'deactivate' : 'activate' }
    onFretSet(stringIndex, fret, !isActive)
  }

  function handleCellMouseEnter(stringIndex: number, fret: number) {
    if (!dragRef.current) return
    onFretSet(stringIndex, fret, dragRef.current.action === 'activate')
  }

  // Compute barre bars: contiguous runs of 2+ strings at the same fret (visible in window)
  const byFret = new Map<number, number[]>()
  strings.forEach((s, i) => {
    if (typeof s !== 'number') return
    const offset = s - startFret
    if (offset < 0 || offset >= FRET_COUNT) return
    const arr = byFret.get(s) ?? []
    arr.push(i)
    byFret.set(s, arr)
  })

  const bars: { stringStart: number; stringEnd: number; fretOffset: number }[] = []
  for (const [fret, indices] of byFret) {
    if (indices.length < 2) continue
    const sorted = [...indices].sort((a, b) => a - b)
    let runStart = sorted[0]
    let prev = sorted[0]
    for (let i = 1; i <= sorted.length; i++) {
      const cur = sorted[i]
      if (i === sorted.length || cur !== prev + 1) {
        if (prev - runStart >= 1) {
          bars.push({ stringStart: runStart, stringEnd: prev, fretOffset: fret - startFret })
        }
        runStart = cur
      }
      prev = cur
    }
  }

  return (
    <div className="fretboard-container">
      {showFretLabel && (
        <div className="fret-label">{startFret}fr</div>
      )}
      <svg
        width={svgWidth}
        height={svgHeight}
        className="fretboard-svg"
        aria-label="Guitar fretboard"
        onMouseLeave={() => { dragRef.current = null }}
      >
        {/* Nut */}
        <rect x={0} y={0} width={svgWidth} height={nutHeight} fill="#c8a35e" />

        {/* Inlay dots */}
        {Array.from({ length: FRET_COUNT }, (_, fretOffset) => {
          const fret = startFret + fretOffset
          if (!INLAY_FRETS.has(fret)) return null
          const cy = nutHeight + fretOffset * cellHeight + cellHeight / 2
          if (DOUBLE_INLAY_FRETS.has(fret)) {
            return (
              <g key={`inlay-${fret}`}>
                <circle cx={svgWidth / 3} cy={cy} r={inlayRadius} fill={inlayColor} />
                <circle cx={svgWidth * 2 / 3} cy={cy} r={inlayRadius} fill={inlayColor} />
              </g>
            )
          }
          return <circle key={`inlay-${fret}`} cx={svgWidth / 2} cy={cy} r={inlayRadius} fill={inlayColor} />
        })}

        {/* Fret lines */}
        {Array.from({ length: FRET_COUNT + 1 }, (_, fretIndex) => (
          <line
            key={`fret-${fretIndex}`}
            x1={0}
            y1={nutHeight + fretIndex * cellHeight}
            x2={svgWidth}
            y2={nutHeight + fretIndex * cellHeight}
            stroke="#1c1c22"
            strokeWidth={1}
          />
        ))}

        {/* String lines */}
        {Array.from({ length: STRING_COUNT }, (_, stringIndex) => (
          <line
            key={`string-${stringIndex}`}
            x1={cellWidth * stringIndex + cellWidth / 2}
            y1={0}
            x2={cellWidth * stringIndex + cellWidth / 2}
            y2={svgHeight}
            stroke="#36363e"
            strokeWidth={1.5}
          />
        ))}

        {/* Barre bars (rendered before dots so dots sit on top) */}
        {bars.map(({ stringStart, stringEnd, fretOffset }) => {
          const cy = nutHeight + fretOffset * cellHeight + cellHeight / 2
          const x1 = cellWidth * stringStart + cellWidth / 2
          const x2 = cellWidth * stringEnd + cellWidth / 2
          return (
            <rect
              key={`bar-${stringStart}-${stringEnd}-${fretOffset}`}
              x={x1 - dotRadius}
              y={cy - dotRadius}
              width={x2 - x1 + dotRadius * 2}
              height={dotRadius * 2}
              rx={dotRadius}
              ry={dotRadius}
              fill="#e2e2de"
            />
          )
        })}

        {/* Clickable cells + finger dots */}
        {Array.from({ length: FRET_COUNT }, (_, fretOffset) => {
          const fret = startFret + fretOffset
          const cellY = nutHeight + fretOffset * cellHeight

          return Array.from({ length: STRING_COUNT }, (_, stringIndex) => {
            const state = strings[stringIndex]
            const isActive = typeof state === 'number' && state === fret
            const cx = cellWidth * stringIndex + cellWidth / 2
            const cy = cellY + cellHeight / 2

            return (
              <g
                key={`cell-${stringIndex}-${fretOffset}`}
                onMouseDown={(e) => handleCellMouseDown(stringIndex, fret, e)}
                onMouseEnter={() => handleCellMouseEnter(stringIndex, fret)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`String ${stringIndex + 1}, fret ${fret}`}
                aria-pressed={isActive}
              >
                {/* Invisible hit area */}
                <rect
                  x={cellWidth * stringIndex}
                  y={cellY}
                  width={cellWidth}
                  height={cellHeight}
                  fill="transparent"
                />
                {/* Finger dot */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={dotRadius}
                    fill="#e2e2de"
                  />
                )}
              </g>
            )
          })
        })}
      </svg>
    </div>
  )
}
