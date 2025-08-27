'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Quotes from '@/components/Quotes'
import LimitSelector from '@/components/LimitSelector'
import { createQueryString } from '@/utils/queryParams'
import { useRequest } from '@/hooks/useRequest'
import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
} from '@/components/styles'

export default function Home() {
  const [limit, setLimit] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const validate = () => {
    const newValidationErrors = {}

    const limitNum = Number.parseInt(limit, 10) || 9
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 99) {
      newValidationErrors.limit = 'Limit must be an integer between 1 and 99'
    }
    setValidationErrors(newValidationErrors)

    return newValidationErrors
  }

  const path = 'http://localhost:3000/quotes/random'
  const query = createQueryString({ limit })

  const { quotes, fetchQuotes, searchSubmitted } = useRequest({
    path,
    query,
  })

  const handleSearch = async () => {
    const errors = validate()

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    fetchQuotes()
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className='p-4'>
      <Button onClick={handleSearch} text='Get Random Quotes' />

      <LimitSelector
        name='limit'
        type='number'
        placeholder='Limit (1-99)'
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        onBlur={validate}
        containerClassName={`${inputContainerStyle} text-xl mt-11 mb-6`}
        inputClassName={`${inputStyle} w-1/3 lg:w-1/5 xl:w-1/6`}
        min={1}
        max={99}
        options={[9, 18, 36, 72]}
        error={validationErrors?.limit}
        errorClassName={errorStyle}
      />

      <Quotes quotes={quotes} searchSubmitted={searchSubmitted} />
    </div>
  )
}
