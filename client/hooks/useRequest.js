import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export const useRequest = ({ path, query }) => {
  const router = useRouter()

  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const hasValidationErrors = async (response) => {
    if (!response.ok) {
      const errorData = await response.json()

      if (!errorData?.errors || !Array.isArray(errorData?.errors)) {
        toast.error('Something went wrong')
        return
      }

      const fieldErrors = errorData.errors
        .filter((err) => err.type === 'field')
        .map((err) => `${err.value}, ${err.path}: ${err.msg}`)

      for (const msg of fieldErrors) {
        toast.error(msg)
      }
      return true
    }
  }

  const fetchQuotes = async (nextQuery = query) => {
    try {
      setIsLoading(true)
      setSearchSubmitted(true)
      if (nextQuery !== query) {
        router.push(`?${nextQuery}`)
      }
      const response = await fetch(`${path}?${nextQuery}`)

      const hasErrors = await hasValidationErrors(response)
      if (hasErrors) {
        return
      }

      const data = await response.json()
      setQuotes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    quotes,
    setQuotes,
    fetchQuotes,
    searchSubmitted,
    isLoading,
  }
}
