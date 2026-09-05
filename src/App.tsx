import TopBar from './components/TopBar'
import ClothingSpotlight from './components/ClothingSpotlight'
import AboutSection from './components/AboutSection'
import items from './data/items.ts'
import './App.css'

function App() {
  return (
    <>
      <TopBar />
      <ClothingSpotlight items={items} />
      <AboutSection />
    </>
  )
}

export default App