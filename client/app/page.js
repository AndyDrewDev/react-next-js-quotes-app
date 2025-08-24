'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/Button'
import Quote from '@/components/Quote'

const LIMIT = 9
const RANDOM_QUOTES_URL = `http://localhost:3000/quotes/random?limit=${LIMIT}`

export default function Home() {
  const [quotes, setQuotes] = useState([])

  const fetchQuotes = async () => {
    try {
      const response = await fetch(RANDOM_QUOTES_URL)
      const data = await response.json()
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  return (
    <div className='p-4'>
      <Button onClick={fetchQuotes} text='Get Random Quotes' />

      <div className='pt-5 grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {quotes.map((quote) => (
          <Quote key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  )
}
