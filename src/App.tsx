import './App.css'
import { AppStoreProvider } from './lib/useAppStore'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import QuestionPage from './pages/QuestionPage'
import ProfileHeader from './components/ProfileHeader'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <AppStoreProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <ProfileHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/question/:id" element={<QuestionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </AppStoreProvider>
  )
}

export default App
