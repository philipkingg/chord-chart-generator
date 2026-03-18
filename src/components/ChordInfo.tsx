import { parseChordName, splitQuality, formatChordText } from '../utils/chordDisplay'

interface ChordInfoProps {
  chords: string[]
  selectedChord: string
  onSelectChord: (chord: string) => void
}

function ChordNameDisplay({ name }: { name: string }) {
  const { letter, accidental, quality } = parseChordName(name)

  const renderedQuality = splitQuality(quality).map((part, i) =>
    part.type === 'accidental'
      ? <span key={i} className="chord-quality-accidental">{part.content}</span>
      : <span key={i}>{part.content}</span>
  )

  return (
    <>
      {letter}
      {accidental && <span className="chord-accidental">{accidental}</span>}
      {renderedQuality}
    </>
  )
}

/**
 * Displays the detected chord name. If multiple matches exist,
 * shows a dropdown of alternatives.
 */
export function ChordInfo({ chords, selectedChord, onSelectChord }: ChordInfoProps) {
  const displayName = selectedChord || 'Unknown'

  return (
    <div className="chord-info">
      <h1 className="chord-name"><ChordNameDisplay name={displayName} /></h1>
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
                {formatChordText(chord)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
