'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import LimitSelector from '@/components/LimitSelector'
import Quotes from '@/components/Quotes'
import { getSearchInputFields } from '@/app/_config/InputFields'
import { useQuoteSearch } from '@/hooks/useQuoteSearch'
import { createQueryString } from '@/utils/queryParams'
import { validateSearch } from '@/utils/validation'
import { INITIAL_SEARCH_DATA } from '@/utils/constants'
import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
  buttonsContainerStyle,
} from '@/components/styles'

export default function SearchQuotesPage() {
  const searchParams = useSearchParams()
  const lastQueryRef = useRef('')

  const [formData, setFormData] = useState(INITIAL_SEARCH_DATA)
  const [validationErrors, setValidationErrors] = useState({})

  const inputsContainerStyle =
    'text-xl flex flex-col lg:flex-row justify-center gap-4 md:gap-6 mb-6 mt-6'

  useEffect(() => {
    const searchDataFromQueryString = {
      text: searchParams.get('text') || '',
      author: searchParams.get('author') || '',
      category: searchParams.get('category') || '',
      limit: searchParams.get('limit') || '',
    }

    setFormData(searchDataFromQueryString)

    handleSearch({ searchData: searchDataFromQueryString })
  }, [searchParams])

  const { quotes, fetchQuotes, searchSubmitted, isLoading } = useQuoteSearch({})

  const inputFields = getSearchInputFields({
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    validateSearch,
  })

  const handleSearch = async ({ searchData = formData } = {}) => {
    const errors = validateSearch({
      formData: {
        ...searchData,
      },
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    const nextQuery = createQueryString({
      formData: {
        ...searchData,
      },
    })

    if (lastQueryRef.current === nextQuery) {
      return
    }
    lastQueryRef.current = nextQuery
    fetchQuotes(nextQuery)
  }

  const clearInputs = () => {
    setFormData({ ...INITIAL_SEARCH_DATA, limit: 9 })
    setValidationErrors({})
  }

  return (
    <div className='p-4'>
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
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          onBlur={() => setValidationErrors(validateSearch({ formData }))}
          containerClassName={inputContainerStyle}
          inputClassName={`${inputStyle} w-42 lg:w-36`}
          error={validationErrors?.limit}
          errorClassName={errorStyle}
        />
      </div>

      <Quotes
        quotes={quotes}
        selectedCategory={formData.category}
        searchText={formData.text}
        searchSubmitted={searchSubmitted}
        isLoading={isLoading}
      />
    </div>
  )
}
