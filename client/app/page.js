'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Quote from '@/components/Quote'

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

      <Button onClick={fetchQuotes} text='Get Random Quotes'/>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {quotes.map((quote) => 
          <Quote key={quote.id} quote={quote} />
        )}
      </div>
    </div>
  )
}
