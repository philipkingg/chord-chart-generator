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

  // Show fret position label if not starting at fret 1
  const showFretLabel = startFret > 1

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
        <rect x={0} y={0} width={svgWidth} height={nutHeight} fill="#1a1a1a" />

        {/* Fret lines */}
        {Array.from({ length: FRET_COUNT + 1 }, (_, fretIndex) => (
          <line
            key={`fret-${fretIndex}`}
            x1={0}
            y1={nutHeight + fretIndex * cellHeight}
            x2={svgWidth}
            y2={nutHeight + fretIndex * cellHeight}
            stroke="#333"
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
            stroke="#666"
            strokeWidth={1.5}
          />
        ))}

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
                    fill="#1a1a1a"
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
