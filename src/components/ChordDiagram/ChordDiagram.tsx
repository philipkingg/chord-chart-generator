import { useState, useEffect } from 'react'
import { DiagramState, StringState } from '../../types/chord'
import { detectChord } from '../../utils/chordDetection'
import { FRET_COUNT, TUNING_PITCH_CLASSES, getNote } from '../../utils/noteUtils'
import { exportChordDiagram } from '../../utils/exportPng'
import { Fretboard } from './Fretboard'
import { StringHeader } from './StringHeader'
import { ChordInfo } from '../ChordInfo'

const INITIAL_STATE: DiagramState = ['open', 'open', 'open', 'open', 'open', 'open']
const MAX_FRET = 24
const LS_STATE_KEY = 'tabby_chord_state'
const LS_FRET_KEY = 'tabby_start_fret'

function loadState(): DiagramState {
  try {
    const raw = localStorage.getItem(LS_STATE_KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 6) return INITIAL_STATE
    const valid = parsed.every((s: unknown) => s === 'muted' || s === 'open' || typeof s === 'number')
    return valid ? (parsed as DiagramState) : INITIAL_STATE
  } catch { return INITIAL_STATE }
}

function loadStartFret(): number {
  try {
    const raw = localStorage.getItem(LS_FRET_KEY)
    if (!raw) return 1
    const n = parseInt(raw, 10)
    return isNaN(n) || n < 1 ? 1 : n
  } catch { return 1 }
}

interface ChordDiagramProps {
  debugMode?: boolean
  onDebugToggle?: () => void
}

export function ChordDiagram({ debugMode = false, onDebugToggle }: ChordDiagramProps) {
  const [strings, setStrings] = useState<DiagramState>(loadState)
  const [startFret, setStartFret] = useState(loadStartFret)
  const [chords, setChords] = useState<string[]>(() => detectChord(loadState()).chords)
  const [selectedChord, setSelectedChord] = useState<string>(() => detectChord(loadState()).chords[0] ?? '')

  useEffect(() => {
    const result = detectChord(strings)
    setChords(result.chords)
    setSelectedChord(result.chords[0] ?? '')
  }, [strings])

  useEffect(() => {
    localStorage.setItem(LS_STATE_KEY, JSON.stringify(strings))
    localStorage.setItem(LS_FRET_KEY, String(startFret))
  }, [strings, startFret])

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
    localStorage.removeItem(LS_STATE_KEY)
    localStorage.removeItem(LS_FRET_KEY)
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
      <div className="diagram-controls">
        <button className="reset-button" onClick={handleReset}>Reset</button>
        <button
          className="save-btn"
          onClick={() => exportChordDiagram(strings, startFret, selectedChord)}
        >
          Save PNG
        </button>
        {onDebugToggle && (
          <button
            className={`debug-btn${debugMode ? ' active' : ''}`}
            onClick={onDebugToggle}
            aria-pressed={debugMode}
          >
            debug
          </button>
        )}
      </div>
    </div>
  )
}
