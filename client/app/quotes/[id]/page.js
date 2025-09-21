'use client'

import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DeleteIconButton from '@/components/DeleteIconButton'
import EditIconButton from '@/components/EditIconButton'
import { isValidId } from '@/utils/validation'
import { API_BASE_URL } from '@/config/config'

export default function QuotePage({ params }) {
  const { id } = params
  const router = useRouter()
  const SINGLE_QUOTE_URL = `${API_BASE_URL}/quotes/${id}`

  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteQuote = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(SINGLE_QUOTE_URL, {
        method: 'DELETE',
      })
      setIsDeleting(false)

      if (response.ok) {
        toast.success('Quote deleted successfully')
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else if (response.status === 404) {
        toast.error(`Quote with id ${id} not found`)
        const data = await response.json()
        setError(data.message || data.errors[0].msg)
      } else {
        toast.error('Failed to delete quote')
        setError('Failed to delete quote')
      }
    } catch (error) {
      toast.error(error.message)
      console.error('Error deleting quote', error)
      setError(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const fetchQuote = async () => {
    if (!isValidId(id)) {
      toast.error('Invalid quote ID. ID must be integer greater than 0.')
      setIsLoading(false)
      return
    }
    try {
      const response = await fetch(SINGLE_QUOTE_URL)
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
      <div className=' w-full mx-auto mt-10 mb-5 lg:w-3/4 p-6 pb-10 bg-[#faf9fc] shadow-lg rounded-lg dark:bg-gray-800 relative'>
        <div className='absolute top-4 right-4 flex gap-2'>
          <Link href={`/quotes/${id}/edit`}>
            <EditIconButton />
          </Link>
          <DeleteIconButton
            onClick={() => handleDeleteQuote()}
            disabled={isDeleting}
            isLoading={isDeleting}
          />
        </div>
        <h2 className='text-xl md:text-2xl text-center mt-10 pb-6 px-4 md:px-8 italic text-gray-900 dark:text-gray-100'>
          {quote.text}
        </h2>
        <p className='text-2xl md:text-3xl text-center mb-6 font-semibold text-gray-700 dark:text-gray-300'>
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
