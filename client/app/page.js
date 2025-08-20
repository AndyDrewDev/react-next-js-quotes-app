'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    const fetchQuotes = async () => {
      const response = await fetch(
        'http://localhost:3000/quotes/random?limit=10'
      )
      const data = await response.json()
      setQuotes(data)
    }

    fetchQuotes()
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-center text-3xl mb-6 dark:text-white'>
        Quotes Front-end App
      </h1>
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
