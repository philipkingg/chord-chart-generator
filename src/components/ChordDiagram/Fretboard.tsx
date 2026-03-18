import { StringState } from '../../types/chord'
import { FRET_COUNT } from '../../utils/noteUtils'

interface FretboardProps {
  strings: StringState[]
  startFret: number
  onFretClick: (stringIndex: number, fret: number) => void
}

/**
 * SVG-based clickable fretboard grid.
 * Strings run vertically (left=low E, right=high E).
 * Frets run horizontally (top=nut side).
 */
export function Fretboard({ strings, startFret, onFretClick }: FretboardProps) {
  const STRING_COUNT = 6
  const cellWidth = 36
  const cellHeight = 44
  const nutHeight = 6
  const dotRadius = 11

  const svgWidth = cellWidth * STRING_COUNT
  const svgHeight = nutHeight + cellHeight * FRET_COUNT

  const showFretLabel = startFret > 1

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
      >
        {/* Nut */}
        <rect x={0} y={0} width={svgWidth} height={nutHeight} fill="#c8a35e" />

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
                onClick={() => onFretClick(stringIndex, fret)}
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
