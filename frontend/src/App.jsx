import './App.css'

import Home from './pages/Home'
import Standards from './pages/Standards'
import StandardDetails from './pages/StandardDetails'
import AssistantPage from './pages/AssistantPage'
import Certification from './pages/Certification'
import Laboratories from './pages/Laboratories'
import Multilingual from './pages/Multilingual'

function App() {
  const path = window.location.pathname

  if (path === '/standards') {
    return <Standards />
  }

  if (path.startsWith('/standards/')) {
    return <StandardDetails />
  }

  if (path === '/assistant') {
    return <AssistantPage />
  }

  if (path === '/certification') {
    return <Certification />
  }

  if (path === '/laboratories') {
    return <Laboratories />
  }

  if (path === '/multilingual') {
    return <Multilingual />
  }

  return <Home />
}

export default App