import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { quoteAPI } from '@/utils/apiClient'

//Hook for searching and filtering quotes

export const useQuoteSearch = ({ query }) => {
  const router = useRouter()

  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchQuotesBase = async (apiMethod, nextQuery = query) => {
    try {
      setIsLoading(true)
      setSearchSubmitted(true)

      if (nextQuery !== query) {
        router.push(`?${nextQuery}`)
      }

      const result = await apiMethod(nextQuery)

      if (result.success) {
        setQuotes(Array.isArray(result.data) ? result.data : [])
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchQuotes = (nextQuery) => fetchQuotesBase(quoteAPI.getAll, nextQuery)
  
  const fetchRandomQuotes = (nextQuery) =>
    fetchQuotesBase(quoteAPI.getRandom, nextQuery)

  return {
    quotes,
    setQuotes,
    fetchQuotes,
    fetchRandomQuotes,
    searchSubmitted,
    isLoading,
  }
}
