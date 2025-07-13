
import './App.css'
import { SearchProvider } from './context/search_context'
import HomePage from './view/HomePage/homepage'

function App() {

  return (
    <>
    <SearchProvider>
      <HomePage />
    </SearchProvider>
    </>
  )
}

export default App
