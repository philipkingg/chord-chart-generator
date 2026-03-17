interface ChordInfoProps {
  chords: string[]
  selectedChord: string
  onSelectChord: (chord: string) => void
}

/**
 * Displays the detected chord name. If multiple matches exist,
 * shows a dropdown of alternatives.
 */
export function ChordInfo({ chords, selectedChord, onSelectChord }: ChordInfoProps) {
  const displayName = selectedChord || 'Unknown'

  return (
    <div className="chord-info">
      <h1 className="chord-name">{displayName}</h1>
      {chords.length > 1 && (
        <div className="chord-alternatives">
          <label htmlFor="chord-select" className="chord-alt-label">
            Also:
          </label>
          <select
            id="chord-select"
            className="chord-select"
            value={selectedChord}
            onChange={(e) => onSelectChord(e.target.value)}
          >
            {chords.map((chord) => (
              <option key={chord} value={chord}>
                {chord}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
