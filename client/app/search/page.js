'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import LimitSelector from '@/components/LimitSelector'
import Quotes from '@/components/Quotes'
import { createQueryString } from '@/utils/queryParams'
import { useRequest } from '@/hooks/useRequest'
import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
} from '@/components/styles'

const CATEGORY_NAME_REGEX = /^[a-z0-9-]+$/

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const buttonsContainerStyle = 'flex justify-center gap-4'
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

  const validate = () => {
    const newValidationErrors = {}

    if (text && text.length < 3) {
      newValidationErrors.text = 'Text must be at least 3 characters long'
    }

    if (author && author.length < 2) {
      newValidationErrors.author = 'Author must be at least 2 characters long'
    }

    if (category && !CATEGORY_NAME_REGEX.test(category)) {
      newValidationErrors.category =
        'Category must contain only lowercase letters, numbers and dashes'
    }

    const limitNum = Number.parseInt(limit, 10) || 9
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 99) {
      newValidationErrors.limit = 'Limit must be an integer between 1 and 99'
    }
    setValidationErrors(newValidationErrors)

    return newValidationErrors
  }

  const path = 'http://localhost:3000/quotes'

  const { quotes, fetchQuotes, searchSubmitted, setQuotes } = useRequest({
    path,
  })

  const inputFields = [
    {
      name: 'text',
      type: 'text',
      placeholder: 'Search by text',
      value: text,
      onChange: (e) => setText(e.target.value),
      onBlur: validate,
      containerClassName: inputContainerStyle,
      inputClassName: inputStyle,
      error: validationErrors?.text,
      errorClassName: errorStyle,
    },
    {
      name: 'author',
      type: 'text',
      placeholder: 'Search by author',
      value: author,
      onChange: (e) => setAuthor(e.target.value),
      onBlur: validate,
      containerClassName: inputContainerStyle,
      inputClassName: inputStyle,
      error: validationErrors?.author,
      errorClassName: errorStyle,
    },

    {
      name: 'category',
      type: 'text',
      placeholder: 'Search by category',
      value: category,
      onChange: (e) => setCategory(e.target.value),
      onBlur: validate,
      containerClassName: inputContainerStyle,
      inputClassName: inputStyle,
      error: validationErrors?.category,
      errorClassName: errorStyle + ' px-5',
    },
  ]

  const handleSearch = async ({
    searchText = text,
    searchAuthor = author,
    searchCategory = category,
    searchLimit = limit,
  }) => {
    const errors = validate()

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
          onBlur={validate}
          containerClassName={inputContainerStyle}
          inputClassName={`${inputStyle} w-42 lg:w-36`}
          error={validationErrors?.limit}
          errorClassName={errorStyle}
        />
      </div>

      <Quotes quotes={quotes} searchSubmitted={searchSubmitted} />
    </div>
  )
}