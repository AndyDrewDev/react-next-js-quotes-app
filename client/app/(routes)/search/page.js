'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import LimitSelector from '@/components/LimitSelector'
import Quotes from '@/components/Quotes'
import { getSearchInputFields } from '@/app/_config/InputFields'
import { useQuoteSearch } from '@/hooks/useQuoteSearch'
import { createQueryString } from '@/utils/queryParams'
import { validateSearch } from '@/utils/validation'
import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
  buttonsContainerStyle,
} from '@/components/styles'

export default function SearchQuotesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lastQueryRef = useRef('')

  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const inputsContainerStyle =
    'text-xl flex flex-col lg:flex-row justify-center gap-4 md:gap-6 mb-6 mt-6'

  useEffect(() => {
    const initialText = searchParams.get('text') || ''
    const initialAuthor = searchParams.get('author') || ''
    const initialCategory = searchParams.get('category') || ''
    const initialLimit = searchParams.get('limit') || ''

    if (initialText || initialAuthor || initialCategory || initialLimit) {
      initialText && setText(initialText)
      initialAuthor && setAuthor(initialAuthor)
      initialCategory && setCategory(initialCategory)
      initialLimit && setLimit(initialLimit)

      handleSearch({
        searchText: initialText,
        searchAuthor: initialAuthor,
        searchCategory: initialCategory,
        searchLimit: initialLimit,
      })
    }
  }, [searchParams])

  const { quotes, fetchQuotes, searchSubmitted, setQuotes, isLoading } =
    useQuoteSearch({})

  const inputFields = getSearchInputFields({
    text,
    author,
    category,
    limit,
    setText,
    setAuthor,
    setCategory,
    validationErrors,
    setValidationErrors,
    validateSearch,
  })

  const handleSearch = async ({
    searchText = text,
    searchAuthor = author,
    searchCategory = category,
    searchLimit = limit,
  } = {}) => {
    const errors = validateSearch({
      text: searchText,
      author: searchAuthor,
      category: searchCategory,
      limit: searchLimit,
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    const nextQuery = createQueryString({
      text: searchText,
      author: searchAuthor,
      category: searchCategory,
      limit: searchLimit,
    })

    if (lastQueryRef.current === nextQuery) {
      return
    }
    lastQueryRef.current = nextQuery
    fetchQuotes(nextQuery)
  }

  const clearInputs = () => {
    setText('')
    setAuthor('')
    setCategory('')
    setLimit('')
    setValidationErrors({})
    setQuotes([])
    router.push('/search')
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
        {inputFields.map((field) => (
          <InputField key={field.name} {...field} />
        ))}

        <LimitSelector
          name='limit'
          type='number'
          placeholder='Limit (1-99)'
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          onBlur={() =>
            setValidationErrors(
              validateSearch({ text, author, category, limit })
            )
          }
          containerClassName={inputContainerStyle}
          inputClassName={`${inputStyle} w-42 lg:w-36`}
          error={validationErrors?.limit}
          errorClassName={errorStyle}
        />
      </div>

      <Quotes
        quotes={quotes}
        searchSubmitted={searchSubmitted}
        isLoading={isLoading}
      />
    </div>
  )
}
