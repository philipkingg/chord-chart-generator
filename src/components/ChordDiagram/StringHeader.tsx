import { StringState } from '../../types/chord'

interface StringHeaderProps {
  strings: StringState[]
  onToggle: (stringIndex: number) => void
  tuning: readonly string[]
}

/**
 * Tuning labels + open/muted indicators above the nut.
 * Click cycles: open (○) → muted (✕) → open.
 * Shows nothing if the string has a fretted note (handled by parent as open).
 */
export function StringHeader({ strings, onToggle, tuning }: StringHeaderProps) {
  return (
    <div className="string-header-wrapper">
      <div className="string-tuning-row">
        {tuning.map((note, i) => (
          <div key={i} className="string-tuning-cell">{note}</div>
        ))}
      </div>
      <div className="string-header">
        {strings.map((state, i) => {
          const isMuted = state === 'muted'
          const isOpen = state === 'open'
          const showIndicator = isMuted || isOpen

          return (
            <div
              key={i}
              className="string-header-cell"
              onClick={() => onToggle(i)}
              title={isMuted ? 'Muted — click to open' : 'Open — click to mute'}
            >
              {showIndicator && (
                <span className={`string-indicator ${isMuted ? 'muted' : 'open'}`}>
                  {isMuted ? '✕' : '○'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
