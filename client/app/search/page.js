'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import Quote from '@/components/Quote'

const createSearchQueryString = ({ text, author, category }) => {
  const params = new URLSearchParams()
  if (text) params.set('text', text)
  if (author) params.set('author', author)
  if (category) params.set('category', category)
  params.set('limit', 10)

  return params.toString()
}

export default function SearchPage() {
  const [text, setText] = useState('')
  const [quotes, setQuotes] = useState([])
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false)

  const inputStyle =
    'p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white'

  const handleSearch = async () => {
    try {
      setSearchSubmitted(true)
      //Sample query: http://localhost:3000/quotes?text=love&author=Shakespeare&category=love&limit=10
      const query = createSearchQueryString({ text, author, category })
      const response = await fetch(`http://localhost:3000/quotes?${query}`)
      const data = await response.json()
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
    }
  }

  return (
    <div className='p-4'>
      {/* <h1 className='text-3xl mb-6 text-center dark:text-white'>
        Search Quotes
      </h1> */}

      <div className='text-center mb-6'>
        <Button onClick={handleSearch} text='Search Quotes' />
      </div>

      <div className='text-xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search by text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={inputStyle}
        />
        <input
          type='text'
          placeholder='Search by author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={inputStyle}
        />
        <input
          type='text'
          placeholder='Search by category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputStyle}
        />
      </div>
      
      {quotes.length > 0 ? (

      <div className='pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {quotes.map((quote) => (
          <Quote key={quote.id} quote={quote} />
        ))}
      </div>
      ) : searchSubmitted && (
        <div className='pt-10 text-center text-2xl text-gray-600 dark:text-gray-400'>No quotes found</div>
      )}
    </div>
  )
}

