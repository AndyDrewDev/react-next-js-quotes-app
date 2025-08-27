import { useState } from 'react'
import { toast } from 'react-toastify'

export const useRequest = ({ path, query }) => {
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [quotes, setQuotes] = useState([])

  const fetchQuotes = async () => {
    try {
      setSearchSubmitted(true)

      const response = await fetch(`${path}?${query}`)

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

        setQuotes([])
        return
      }

      const data = await response.json()
      setQuotes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error(error.message)
    }
  }

  return {
    quotes,
    setQuotes,
    fetchQuotes,
    searchSubmitted,
  }
}
