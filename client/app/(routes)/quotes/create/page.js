'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'
import InputField from '@/components/InputField'
import Button from '@/components/Button'
import { getCreateEditInputFields } from '@/app/_config/InputFields'
import { API_BASE_URL } from '@/config/config'
import { validateQuoteCreateForm, parseCategories } from '@/utils/validation'
import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
  buttonsContainerStyle,
} from '@/components/styles'

export default function CreateQuotePage() {
  const router = useRouter()

  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [categories, setCategories] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setIsSubmitting(true)

    try {
      const categoryList = parseCategories(categories || '')

      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          author: author.trim(),
          categories: categoryList,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (data?.errors && Array.isArray(data.errors)) {
          const fieldErrors = data.errors
            .filter((err) => err.type === 'field')
            .map((err) => `${err.value}, ${err.path}: ${err.msg}`)
          fieldErrors.forEach((msg) => toast.error(msg))
        } else if (data?.message) {
          toast.error(data.message)
        } else {
          toast.error('Failed to create quote')
        }
        return
      }

      toast.success('Quote created successfully')
      if (data?.id) {
        router.push(`/quotes/${data.id}`)
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
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

  if (isSubmitting) {
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
            text={isSubmitting ? 'Creating...' : 'Create Quote'}
            disabled={isSubmitting || isFormInvalid}
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
