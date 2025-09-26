import { useState } from 'react'
import { quoteAPI } from '@/utils/apiClient'

//Hook for creating, updating and deleting quotes

export const useQuoteActions = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createQuote = async (quoteData, options = {}) => {
    setIsLoading(true)
    try {
      const result = await quoteAPI.create(quoteData, options)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuote = async (id, quoteData, options = {}) => {
    setIsLoading(true)
    try {
      const result = await quoteAPI.update(id, quoteData, options)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const deleteQuote = async (id, options = {}) => {
    setIsLoading(true)
    try {
      const result = await quoteAPI.delete(id, options)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const getQuote = async (id) => {
    setIsLoading(true)
    try {
      const result = await quoteAPI.getById(id)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createQuote,
    updateQuote,
    deleteQuote,
    getQuote,
  }
}
