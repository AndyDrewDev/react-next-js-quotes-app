'use client'

import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CategoryTags from '@/app/_components/CategoryTags'
import DeleteIconButton from '@/components/DeleteIconButton'
import EditIconButton from '@/components/EditIconButton'
import { useQuoteActions } from '@/hooks/useQuoteActions'
import { isValidId } from '@/utils/validation'

export default function QuotePage({ params, selectedCategory }) {
  const { id } = params
  const router = useRouter()
  const { getQuote, deleteQuote, isLoading } = useQuoteActions()

  // Start with loading state to prevent flash of "not found" during SSR
  const [quote, setQuote] = useState(null)
  const [isClient, setIsClient] = useState(false)

  const handleDeleteQuote = async () => {
    const result = await deleteQuote(id, {
      onSuccess: () => {
        setTimeout(() => {
          router.push('/')
        }, 3000)
      },
    })

    return result.success
  }

  const fetchQuote = async () => {
    if (!isValidId(id)) {
      toast.error('Invalid quote ID. ID must be integer greater than 0.')
      return
    }

    const result = await getQuote(id)

    if (result.success) {
      setQuote(result.data)
    }
  }

  useEffect(() => {
    //to avoid hydration mismatch between server and client
    setIsClient(true)
    fetchQuote()
  }, [])

  // Show loading while API call is in progress or during SSR hydration
  if (isLoading || !isClient) {
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
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
        <h2 className='text-xl md:text-2xl text-center mt-10 pb-6 px-4 md:px-8 italic text-gray-900 dark:text-gray-100'>
          {quote.text}
        </h2>
        <p className='flex justify-center'>
          <Link className='text-2xl md:text-3xl mb-6 font-semibold text-gray-700 dark:text-gray-300 hover:text-violet-500 dark:hover:text-violet-500' href={`/search?author=${quote.author}`}> — {quote.author}</Link>
        </p>    
        <CategoryTags
          categories={quote.categories}
          selectedCategory={selectedCategory}
          isQuotePage={true}
        />
      </div>
    </div>
  )
}
