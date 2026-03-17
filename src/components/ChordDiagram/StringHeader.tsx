import { StringState } from '../../types/chord'

interface StringHeaderProps {
  strings: StringState[]
  onToggle: (stringIndex: number) => void
}

/**
 * Row of open/muted indicators above the nut.
 * Click cycles: open (○) → muted (✕) → open.
 * Shows nothing if the string has a fretted note (handled by parent as open).
 */
export function StringHeader({ strings, onToggle }: StringHeaderProps) {
  return (
    <div className="string-header">
      {strings.map((state, i) => {
        const isMuted = state === 'muted'
        const isOpen = state === 'open'
        // Only show indicator for open or muted strings
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
  )
}
