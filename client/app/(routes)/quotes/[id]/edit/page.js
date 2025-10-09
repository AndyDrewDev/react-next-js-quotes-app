'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'
import InputField from '@/components/InputField'
import SaveIconButton from '@/components/SaveIconButton'
import { getCreateEditInputFields } from '@/app/_config/InputFields'
import { useQuoteActions } from '@/hooks/useQuoteActions'
import {
  validateQuoteForm,
  parseCategories,
  isValidId,
} from '@/utils/validation'
import { INITIAL_FORM_DATA } from '@/utils/constants'

export default function EditQuotePage({ params }) {
  const { id } = params
  const router = useRouter()
  const { updateQuote, getQuote, isLoading } = useQuoteActions()

  const [quote, setQuote] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [validationErrors, setValidationErrors] = useState(() => ({}))
  const [isClient, setIsClient] = useState(false)

  const fetchQuote = async () => {
    if (!isValidId(id)) {
      toast.error('Invalid quote ID. ID must be integer greater than 0.')
      return
    }

    const result = await getQuote(id)

    if (result.success) {
      const data = result.data
      setQuote(data)
      setFormData({
        text: data.text,
        author: data.author,
        categories: data.categories.join(', '),
      })
    }
  }

  useEffect(() => {
    //to avoid hydration mismatch between server and client
    setIsClient(true)
    fetchQuote()
  }, [])

  const validate = () => {
    const errors = validateQuoteForm({
      formData,
    })
    setValidationErrors(errors)
    return errors
  }

  const handleSave = async () => {
    const errors = validate()

    if (Object.keys(errors).length > 0) {
      return
    }

    const categoryList = parseCategories(formData.categories)
    const quoteData = {
      text: formData.text.trim(),
      author: formData.author.trim(),
      categories: categoryList,
    }

    const result = await updateQuote(id, quoteData, {
      onSuccess: (data) => {
        if (data?.id) {
          router.push(`/quotes/${data.id}`)
        }
      },
    })

    return result.success
  }

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

  const inputFields = getCreateEditInputFields({
    formData,
    setFormData,
    validationErrors,
    onBlur: validate,
  })

  const isHasErrors = Object.keys(validationErrors).length > 0

  return (
    <div className='w-full mx-auto mt-10 mb-5 lg:w-3/4 py-10 bg-[#faf9fc] shadow-lg rounded-lg dark:bg-gray-800 relative'>
      <div className='absolute top-4 right-4'>
        <SaveIconButton
          onClick={handleSave}
          disabled={isLoading || isHasErrors}
          isLoading={isLoading}
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
