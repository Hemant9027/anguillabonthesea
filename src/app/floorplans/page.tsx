import fs from 'fs'
import path from 'path'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloorplansClient from '@/components/FloorplansClient'

export const metadata = { title: 'Floorplans — B on the Sea' }

export default function FloorplansPage() {
  const uploads = path.join(process.cwd(), 'public', 'uploads')
  const candidates = [
    path.join(uploads, 'aboutvillab', 'floorplans'),
    path.join(uploads, 'aboutvillab', 'files'),
    path.join(uploads, 'files', 'images', '1'),
  ]

  let images: string[] = []
  for (const c of candidates) {
    try {
      if (!fs.existsSync(c)) continue
      const files = fs.readdirSync(c).filter((f) => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
      if (files.length > 0) {
        images = files.map((f) => {
          // attempt to build relative path
          const rel = path.relative(path.join(process.cwd(), 'public'), path.join(c, f)).replace(/\\/g, '/')
          return '/' + rel
        })
        break
      }
    } catch (e) {
      continue
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <p className="text-sm tracking-widest text-slate-500">FLOORPLANS</p>
          <h1 className="mt-3 text-3xl font-display">Floorplans</h1>
          <p className="mt-3 text-slate-600">Explore the villa layout and level plans.</p>
        </header>

        <FloorplansClient images={images} />

      </main>
      <Footer />
    </>
  )
}
