'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
  buttonsContainerStyle,
} from '@/components/styles'
  import {API_BASE_URL} from '@/config/config'

const CATEGORY_NAME_REGEX = /^[a-z0-9-]+$/

export default function CreateQuotePage() {
  const router = useRouter()

  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [categories, setCategories] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newValidationErrors = {}

    if (text && text.trim().length < 10) {
      newValidationErrors.text = 'Text must be at least 10 characters long'
    }

    if (author && (author.trim().length < 2 || author.trim().length > 255)) {
      newValidationErrors.author = 'Author must be between 2 and 255 characters'
    }

    const categoryList = categories
      .split(',')
      .map((category) => category.trim())
      .filter(Boolean)

    if (categories && categoryList.length < 1) {
      newValidationErrors.categories = 'Provide at least one category'
    } else if (
      !categoryList.every((category) => CATEGORY_NAME_REGEX.test(category))
    ) {
      newValidationErrors.categories =
        'Categories must contain only lowercase letters, numbers and dashes'
    }

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
      const categoryList = categories
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean)

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

  const inputs = [
    {
      name: 'text',
      type: 'text',
      placeholder: 'Quote text (min 10 chars)',
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
      placeholder: 'Author (2-255 chars)',
      value: author,
      onChange: (e) => setAuthor(e.target.value),
      onBlur: validate,
      containerClassName: inputContainerStyle,
      inputClassName: inputStyle,
      error: validationErrors?.author,
      errorClassName: errorStyle,
    },
    {
      name: 'categories',
      type: 'text',
      placeholder: 'Categories (comma-separated, e.g. life, success)',
      value: categories,
      onChange: (e) => setCategories(e.target.value),
      onBlur: validate,
      containerClassName: inputContainerStyle,
      inputClassName: inputStyle,
      error: validationErrors?.categories,
      errorClassName: errorStyle,
    },
  ]

  const isFormInvalid =
    !text.trim() ||
    text.trim().length < 10 ||
    !author.trim() ||
    author.trim().length < 2 ||
    author.trim().length > 255 ||
    !categories.trim()

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
        {inputs.map((field) => (
          <InputField key={field.name} {...field} />
        ))}
      </div>
    </div>
  )
}
