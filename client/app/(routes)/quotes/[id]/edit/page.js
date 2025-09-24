'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'
import InputField from '@/components/InputField'
import SaveIconButton from '@/components/SaveIconButton'
import { getCreateEditInputFields } from '@/app/_config/InputFields'
import { API_BASE_URL } from '@/config/config'
import {
  validateQuoteForm,
  parseCategories,
  isValidId,
} from '@/utils/validation'


export default function EditQuotePage({ params }) {
  const { id } = params
  const router = useRouter()
  const SINGLE_QUOTE_URL = `${API_BASE_URL}/quotes/${id}`

  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [categories, setCategories] = useState('')
  const [validationErrors, setValidationErrors] = useState(() => ({}))

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
        return
      }

      if (response.ok) {
        setQuote(data)
        setText(data.text)
        setAuthor(data.author)
        setCategories(data.categories.join(', '))
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

  const validate = () => {
    const errors = validateQuoteForm({
      text: text.trim(),
      author: author.trim(),
      categoriesStr: categories,
    })
    setValidationErrors(errors)
    return errors
  }

  const handleSave = async () => {
    const errors = validate()

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSaving(true)

    try {
      const categoryList = parseCategories(categories)

      const response = await fetch(SINGLE_QUOTE_URL, {
        method: 'PATCH',
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
          data.errors
            .filter((err) => err.type === 'field')
            .forEach((err) =>
              toast.error(`${err.value}, ${err.path}: ${err.msg}`)
            )
        } else if (data?.message) {
          toast.error(data.message)
        } else {
          toast.error('Failed to save changes')
        }
        return
      }

      toast.success('Quote updated successfully')
      if (data?.id) {
        router.push(`/quotes/${data.id}`)
      }
      
    } catch (error) {
      toast.error(error.message)
      console.error('Error saving quote', error)
    } finally {
      setIsSaving(false)
    }
  }

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

  const isHasErrors = Object.keys(validationErrors).length > 0

  return (
    <div className=' w-full mx-auto mt-10 mb-5 lg:w-3/4 py-10 bg-[#faf9fc] shadow-lg rounded-lg dark:bg-gray-800 relative'>
      <div className='absolute top-4 right-4'>
        <SaveIconButton
          onClick={handleSave}
          disabled={isSaving || isHasErrors}
          isLoading={isSaving}
        />
      </div>

      <div className='flex flex-col gap-4 max-w-3xl text-xl mx-auto my-6 px-10'>
        {inputFields.map((field) => (
          <InputField key={field.name} {...field} />
        ))}
      </div>
    </div>
  )
}
