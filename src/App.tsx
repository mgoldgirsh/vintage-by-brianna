import { useState } from 'react'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import DepopLink from './components/DepopLink'
import ProductModal from './components/ProductModal'
import rawProducts from './data/items.json'
import type { Product } from './types'
import './App.css'

const products = rawProducts as Product[]

function App() {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <>
      <TopBar />
      <main>
        <Hero featured={products[0]} onOpen={setSelected} />
        <Catalog products={products} onOpen={setSelected} />
        <AboutSection />
      </main>
      <Footer />
      <DepopLink />
      {selected && (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

export default App