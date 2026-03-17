import { ChordDiagram } from './components/ChordDiagram/ChordDiagram'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h2 className="app-title">Chord Chart Generator</h2>
      </header>
      <main className="app-main">
        <ChordDiagram />
      </main>
      <footer className="app-footer">
        <p>Click frets to place fingers · Click ○/✕ above to toggle open/muted</p>
      </footer>
    </div>
  )
}

export default App
