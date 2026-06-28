'use client'
import { useState, useEffect } from 'react'
export default function Home() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState({ words: 0, characters: 0, sentences: 0, paragraphs: 0, reading_time: '0 min' })
  useEffect(() => {
    if (!text) { setStats({ words: 0, characters: 0, sentences: 0, paragraphs: 0, reading_time: '0 min' }); return }
    const words = text.split(/\s+/).filter(Boolean).length
    const characters = text.length
    const sentences = (text.match(/[.!?]+/g) || []).length
    const paragraphs = text.split(/\n\n+/).filter(s => s.trim()).length
    const minutes = words / 200
    setStats({ words, characters, sentences, paragraphs, reading_time: `${minutes.toFixed(1)} min` })
  }, [text])
  const statCards = [
    { label: 'Words', value: stats.words, color: 'from-purple-500 to-pink-500' },
    { label: 'Characters', value: stats.characters, color: 'from-blue-500 to-cyan-500' },
    { label: 'Sentences', value: stats.sentences, color: 'from-green-500 to-emerald-500' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'from-orange-500 to-red-500' },
  ]
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">WordCounter</h1>
        <p className="text-gray-400 mb-8">Instant word and character count</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className={`bg-gradient-to-r ${s.color} rounded-2xl p-5 text-center`}>
              <p className="text-3xl font-bold">{s.value.toLocaleString()}</p>
              <p className="text-white/80 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-2 mb-4">
          <textarea value={text} onChange={e => setText(e.target.value)}
            className="w-full h-64 bg-transparent p-4 text-white placeholder-gray-400 resize-none focus:outline-none"
            placeholder="Start typing or paste your text here..." />
        </div>
        <div className="text-center text-gray-400 text-sm">⏱ Reading time: {stats.reading_time}</div>
      </div>
    </main>
  )
}
