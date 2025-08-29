'use client'

import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

export default function QuotePage({ params }) {
  const { id } = params
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isValidId = (id) => {
    return !Number.isInteger(Number(id)) || Number(id) <= 0
  }

  const fetchQuote = async () => {

    if (isValidId(id)) {
        toast.error('Invalid quote ID. ID must be integer greater than 0.')
        setIsLoading(false)
        return
    }
    try {
      const response = await fetch(`http://localhost:3000/quotes/${id}`)
      const data = await response.json()

      if (response.status === 404 || response.status === 400) {
        toast.error(data.message || data.errors[0].msg)
        console.log(data.message || data.errors[0].msg)
        return
      }

      if (response.ok) {
        setQuote(data)
      }
    } catch (error) {
      toast.error(error.message)
      console.error('Error fetching quote', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [id])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader color='#9333EA' size={80} />
      </div>
    )
  }

  if (!quote) {
    return (
      <p className='text-center text-3xl mt-10 text-gray-700 dark:text-gray-300'>{`Quote with id "${id}" not found.`}</p>
    )
  }

  return (
    <div>
      {/* <h1>{quote.text}</h1>
      <p> — {quote.author}</p>
      <p>{quote.categories?.join(', ')}</p> */}
      {/* msx-w-4xl */}
      <div className=' w-full mx-auto mt-10 lg:w-3/4 p-6 bg-[#faf9fc] shadow-lg rounded-lg dark:bg-gray-800'>
        <h2 className='text-xl md:text-2xl text-center mb-6 italic text-gray-900 dark:text-gray-100'>
          {quote.text}
        </h2>
        <p className='text-3xl text-center mb-4 font-semibold text-gray-700 dark:text-gray-300'>
          — {quote.author}
        </p>
        <div className='flex justify-center gap-3 flex-wrap'>
          {quote.categories?.map((category) => (
            <span
              key={category}
              className='text-lg bg-violet-900 text-white px-4 py-2 rounded-lg'
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
