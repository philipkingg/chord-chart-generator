import { useState } from 'react'
import { NavBar, Page } from './components/NavBar'
import { ChordNotator } from './pages/ChordNotator'
import { TabNotator } from './pages/TabNotator'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'

function App() {
  const [page, setPage] = useState<Page>('chords')

  return (
    <div className="app">
      <NavBar activePage={page} onNavigate={setPage} />
      <main className="app-main">
        {page === 'chords' && <ChordNotator />}
        {page === 'tabs' && <TabNotator />}
        {page === 'profile' && <Profile />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default App
