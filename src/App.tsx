import { useState } from 'react'
import { ChordDiagram } from './components/ChordDiagram/ChordDiagram'

function App() {
  const [debugMode, setDebugMode] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h2 className="app-title">Chord Chart Generator</h2>
        <button
          className={`debug-btn${debugMode ? ' active' : ''}`}
          onClick={() => setDebugMode(d => !d)}
          aria-pressed={debugMode}
        >
          Debug
        </button>
      </header>
      <main className="app-main">
        <ChordDiagram debugMode={debugMode} />
      </main>
      <footer className="app-footer">
        <p>Click frets to place fingers · Click ○/✕ above to toggle open/muted</p>
      </footer>
    </div>
  )
}

export default App
