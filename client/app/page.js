'use client'

import { useEffect, useState } from 'react'

const RANDOM_QUOTES_URL = 'http://localhost:3000/quotes/random?limit=10'

export default function Home() {
  const [quotes, setQuotes] = useState([])

  const fetchQuotes = async () => {
    try {
      const response = await fetch(RANDOM_QUOTES_URL)
      const data = await response.json()
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-center text-3xl mb-6 dark:text-white'>
        Quotes Front-end App
      </h1>
      <div className='text-center m-6'>
        <button
          onClick={fetchQuotes}
          className='bg-violet-900 text-white text-xl px-6 py-3 rounded-lg hover:bg-violet-800 focus-outline-none focus:ring-2 focus:ring-violet-600'
        >
          Get Random Quotes
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className='bg-white p-4 shadow-md rounded-lg dark:bg-gray-800'
          >
            <p className='mb-4 text-lg italic text-gray-900 dark:text-gray-100'>
              "{quote.text}"
            </p>
            <p className='mb-10 text-right text-lg font-semibold text-gray-700 dark:text-gray-300'>
              — {quote.author}
            </p>
            <div className='flex flex-wrap mt-2'>
              {quote.categories.map((category) => (
                <span
                  key={category}
                  className='text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300'
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
