import { useState, useEffect } from 'react'
import { DiagramState, StringState } from '../../types/chord'
import { detectChord } from '../../utils/chordDetection'
import { FRET_COUNT, TUNING_PITCH_CLASSES, getNote } from '../../utils/noteUtils'
import { Fretboard } from './Fretboard'
import { StringHeader } from './StringHeader'
import { ChordInfo } from '../ChordInfo'

const INITIAL_STATE: DiagramState = ['open', 'open', 'open', 'open', 'open', 'open']
const MAX_FRET = 24

interface ChordDiagramProps {
  debugMode?: boolean
}

export function ChordDiagram({ debugMode = false }: ChordDiagramProps) {
  const [strings, setStrings] = useState<DiagramState>(INITIAL_STATE)
  const [startFret, setStartFret] = useState(1)
  const [selectedChord, setSelectedChord] = useState<string>('')
  const [chords, setChords] = useState<string[]>([])

  useEffect(() => {
    const result = detectChord(strings)
    setChords(result.chords)
    setSelectedChord(result.chords[0] ?? '')
  }, [strings])

  function handleFretClick(stringIndex: number, fret: number) {
    setStrings((prev) => {
      const next = [...prev] as DiagramState
      const current = prev[stringIndex]
      next[stringIndex] = typeof current === 'number' && current === fret ? 'open' : fret
      return next
    })
  }

  function handleHeaderToggle(stringIndex: number) {
    setStrings((prev) => {
      const next = [...prev] as DiagramState
      next[stringIndex] = prev[stringIndex] === 'muted' ? 'open' : 'muted'
      return next
    })
  }

  function handleReset() {
    setStrings(INITIAL_STATE)
    setStartFret(1)
  }

  const headerStates: StringState[] = strings.map((s) =>
    typeof s === 'number' ? 'open' : s
  )

  const debugNotes = strings.map((s, i) => {
    if (s === 'muted') return '✕'
    const fret = s === 'open' ? 0 : s
    return getNote(i, fret)
  })

  return (
    <div className="chord-diagram">
      <ChordInfo
        chords={chords}
        selectedChord={selectedChord}
        onSelectChord={setSelectedChord}
      />
      <StringHeader
        strings={headerStates}
        onToggle={handleHeaderToggle}
        tuning={TUNING_PITCH_CLASSES}
      />
      <div className="fretboard-row">
        <button
          className="fret-nav-btn"
          onClick={() => setStartFret((f) => Math.max(1, f - 1))}
          disabled={startFret === 1}
          aria-label="Move up"
        >
          ▲
        </button>
        <Fretboard
          strings={strings}
          startFret={startFret}
          onFretClick={handleFretClick}
        />
        <button
          className="fret-nav-btn"
          onClick={() => setStartFret((f) => Math.min(MAX_FRET - FRET_COUNT + 1, f + 1))}
          disabled={startFret >= MAX_FRET - FRET_COUNT + 1}
          aria-label="Move down"
        >
          ▼
        </button>
      </div>
      {debugMode && (
        <div className="debug-notes-row">
          {debugNotes.map((note, i) => (
            <div key={i} className="debug-note-cell">{note}</div>
          ))}
        </div>
      )}
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}
