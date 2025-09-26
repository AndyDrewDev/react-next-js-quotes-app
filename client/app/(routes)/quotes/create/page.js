'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClipLoader from 'react-spinners/ClipLoader'
import InputField from '@/components/InputField'
import Button from '@/components/Button'
import { getCreateEditInputFields } from '@/app/_config/InputFields'
import { validateQuoteCreateForm, parseCategories } from '@/utils/validation'
import { useQuoteActions } from '@/hooks/useQuoteActions'
import { buttonsContainerStyle } from '@/components/styles'

export default function CreateQuotePage() {
  const router = useRouter()
  const { createQuote, isLoading } = useQuoteActions()

  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [categories, setCategories] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const validate = () => {
    const newValidationErrors = validateQuoteCreateForm({
      text,
      author,
      categoriesStr: categories,
    })

    setValidationErrors(newValidationErrors)
    return newValidationErrors
  }

  const handleSubmit = async () => {
    const errors = validate()

    if (Object.keys(errors).length > 0) {
      return
    }

    const categoryList = parseCategories(categories || '')
    const quoteData = {
      text: text.trim(),
      author: author.trim(),
      categories: categoryList,
    }

    const result = await createQuote(quoteData, {
      onSuccess: (data) => {
        if (data?.id) {
          router.push(`/quotes/${data.id}`)
        }
      },
    })

    return result.success
  }

  const inputFields = getCreateEditInputFields({
    text,
    author,
    categories,
    setText,
    setAuthor,
    setCategories,
    validationErrors,
    onBlur: validate,
  })

  const isInputsEmpty = !text.trim() || !author.trim() || !categories.trim()
  const isHasErrors = Object.keys(validationErrors).length > 0
  const isFormInvalid = isInputsEmpty || isHasErrors

  const clearInputs = () => {
    setText('')
    setAuthor('')
    setCategories('')
    setValidationErrors({})
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader color='#9333EA' size={80} />
      </div>
    )
  }

  return (
    <div className='p-4'>
      <div className={buttonsContainerStyle}>
        <div className='text-center'>
          <Button
            onClick={handleSubmit}
            text={isLoading ? 'Creating...' : 'Create Quote'}
            disabled={isLoading || isFormInvalid}
          />
        </div>
        <div className='text-center'>
          <Button
            onClick={clearInputs}
            text='Clear Inputs'
            variant='secondary'
          />
        </div>
      </div>

      <div className='flex flex-col gap-4 max-w-3xl text-xl mx-auto my-6'>
        {inputFields.map((field) => (
          <InputField key={field.name} {...field} />
        ))}
      </div>
    </div>
  )
}
