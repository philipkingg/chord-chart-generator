import { useState, useEffect } from 'react'
import { DiagramState, StringState } from '../../types/chord'
import { detectChord } from '../../utils/chordDetection'
import { getMinFret, FRET_COUNT } from '../../utils/noteUtils'
import { Fretboard } from './Fretboard'
import { StringHeader } from './StringHeader'
import { ChordInfo } from '../ChordInfo'

const INITIAL_STATE: DiagramState = ['open', 'open', 'open', 'open', 'open', 'open']

export function ChordDiagram() {
  const [strings, setStrings] = useState<DiagramState>(INITIAL_STATE)
  const [selectedChord, setSelectedChord] = useState<string>('')
  const [chords, setChords] = useState<string[]>([])

  // Recompute chord whenever string state changes
  useEffect(() => {
    const result = detectChord(strings)
    setChords(result.chords)
    setSelectedChord(result.chords[0] ?? '')
  }, [strings])

  // Calculate fretboard window: show frets startFret..startFret+FRET_COUNT-1
  const minFret = getMinFret(strings)
  const startFret = minFret > FRET_COUNT ? minFret : 1

  function handleFretClick(stringIndex: number, fret: number) {
    setStrings((prev) => {
      const next = [...prev] as DiagramState
      const current = prev[stringIndex]
      if (typeof current === 'number' && current === fret) {
        // Clicking the active fret clears it back to open
        next[stringIndex] = 'open'
      } else {
        next[stringIndex] = fret
      }
      return next
    })
  }

  function handleHeaderToggle(stringIndex: number) {
    setStrings((prev) => {
      const next = [...prev] as DiagramState
      const current = prev[stringIndex]
      if (current === 'muted') {
        next[stringIndex] = 'open'
      } else {
        // Any state (open or fretted) → muted when clicking header toggle
        next[stringIndex] = 'muted'
      }
      return next
    })
  }

  // For the string header, show 'open' for fretted strings (dot is on fretboard)
  const headerStates: StringState[] = strings.map((s) =>
    typeof s === 'number' ? 'open' : s
  )

  function handleReset() {
    setStrings(INITIAL_STATE)
  }

  return (
    <div className="chord-diagram">
      <ChordInfo
        chords={chords}
        selectedChord={selectedChord}
        onSelectChord={setSelectedChord}
      />
      <StringHeader strings={headerStates} onToggle={handleHeaderToggle} />
      <Fretboard
        strings={strings}
        startFret={startFret}
        onFretClick={handleFretClick}
      />
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}
