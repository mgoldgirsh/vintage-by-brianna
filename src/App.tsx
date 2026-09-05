import TopBar from './components/TopBar'
import ClothingSpotlight from './components/ClothingSpotlight'
import AboutSection from './components/AboutSection'
import items from './data/items.json'
import type { ClothingItem } from './components/ClothingSpotlight'
import './App.css'

function App() {
  return (
    <>
      <TopBar />
      <ClothingSpotlight items={items as ClothingItem[]} />
      <AboutSection />
    </>
  )
}

export default App