'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/Button'
import Quote from '@/components/Quote'

const CATEGORY_NAME_REGEX = /^[a-z0-9-]+$/

const createSearchQueryString = ({ text, author, category, limit }) => {
  const params = new URLSearchParams()
  if (text) params.set('text', text)
  if (author) params.set('author', author)
  if (category) params.set('category', category)
  const finalLimit = Number.parseInt(limit, 10) || 9
  params.set('limit', finalLimit)

  return params.toString()
}

export default function SearchPage() {
  const [text, setText] = useState('')
  const [quotes, setQuotes] = useState([])
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const buttonsContainerStyle = 'flex justify-center gap-4'
  const inputsContainerStyle =
    'text-xl flex flex-col lg:flex-row justify-center gap-4 md:gap-6 mb-6 mt-10'
  const inputContainerStyle = 'w-full justify-center'
  const inputStyle =
    'w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-900'
  const errorStyle = 'p-2 px-5 text-center text-red-500 text-lg'
  const quoteContainerStyle =
    'pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
  const emptyResponseStyle =
    'pt-10 text-center text-2xl text-gray-600 dark:text-gray-400'

  const handleSearch = async () => {
    const validationErrors = validateInputs()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSearchSubmitted(true)
      setErrors({})

      //Sample query: http://localhost:3000/quotes?text=love&author=Shakespeare&category=love&limit=10
      const query = createSearchQueryString({ text, author, category, limit })
      const response = await fetch(`http://localhost:3000/quotes?${query}`)

      //Processing of the response from the server
      if (!response.ok) {
        const errorData = await response.json()

        if (!errorData.errors || !Array.isArray(errorData.errors)) {
          toast.error('Something went wrong')
          return
        }

        const fieldErrors = errorData.errors
          .filter((err) => err.type === 'field')
          .map((err) => `${err.value}, ${err.path}: ${err.msg}`)

        fieldErrors.forEach((errorMessage) => {
          toast.error(errorMessage)
        })

        return
      }

      const data = await response.json()
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error(error.message)
    }
  }

  const validateInputs = () => {
    const newErrors = {}

    if (text && text.length < 3) {
      newErrors.text = 'Text must be at least 3 characters long'
    }

    if (author && author.length < 2) {
      newErrors.author = 'Author must be at least 2 characters long'
    }

    if (category && !CATEGORY_NAME_REGEX.test(category)) {
      newErrors.category =
        'Category must contain only lowercase letters, numbers and dashes'
    }

    const limitNum = Number.parseInt(limit, 10) || 9
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 99) {
      newErrors.limit = 'Limit must be an integer between 1 and 99'
    }
    setErrors(newErrors)

    return newErrors
  }

  const clearInputs = () => {
    setText('')
    setAuthor('')
    setCategory('')
    setLimit('')
    setErrors({})
  }

  return (
    <div className='p-4'>
      {/* <h1 className='text-3xl mb-6 text-center dark:text-white'>
        Search Quotes
      </h1> */}
      <div className={buttonsContainerStyle}>
        <div className='text-center'>
          <Button onClick={handleSearch} text='Search Quotes' />
        </div>
        <div className='text-center'>
          <Button
            onClick={clearInputs}
            text='Clear Inputs'
            variant='secondary'
          />
        </div>
      </div>

      <div className={inputsContainerStyle}>
        <div className={inputContainerStyle}>
          <input
            type='text'
            placeholder='Search by text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={validateInputs}
            className={inputStyle}
          />
          {errors?.text && <p className={errorStyle}>{errors.text}</p>}
        </div>
        <div className={inputContainerStyle}>
          <input
            type='text'
            placeholder='Search by author'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onBlur={validateInputs}
            className={inputStyle}
          />
          {errors?.author && <p className={errorStyle}>{errors.author}</p>}
        </div>
        <div className={inputContainerStyle}>
          <input
            type='text'
            placeholder='Search by category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={validateInputs}
            className={inputStyle}
          />
          {errors?.category && (
            <p className={errorStyle + ' px-5'}>{errors.category}</p>
          )}
        </div>
        <div className={inputContainerStyle}>
          <div className='flex items-center gap-3 justify-center'>
            <input
              type='number'
              placeholder='Limit (1-99)'
              min={1}
              max={99}
              step={1}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              onBlur={validateInputs}
              className={`${inputStyle} w-42 lg:w-36`}
            />
            <div className='flex gap-2'>
              {[9, 18, 36, 72].map((opt) => (
                <button
                  key={opt}
                  type='button'
                  onClick={() => {
                    setLimit(String(opt))
                    validateInputs()
                  }}
                  className={`px-4 py-2 rounded border ${
                    String(opt) === String(limit || 9)
                      ? 'bg-violet-900 text-white '
                      : 'border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {errors?.limit && <p className={errorStyle}>{errors.limit}</p>}
        </div>
      </div>

      {quotes.length > 0 ? (
        <div className={quoteContainerStyle}>
          {quotes.map((quote) => (
            <Quote key={quote.id} quote={quote} />
          ))}
        </div>
      ) : (
        searchSubmitted && (
          <div className={emptyResponseStyle}>No quotes found</div>
        )
      )}
    </div>
  )
}
