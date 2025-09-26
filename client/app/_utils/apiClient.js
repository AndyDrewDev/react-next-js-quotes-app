import { toast } from 'react-toastify'
import { API_BASE_URL } from '@/config/config'

/**
 * Universal function for making API requests
 * @param {Object} options - request configuration
 * @param {string} options.endpoint - API endpoint (without base URL)
 * @param {string} options.method - HTTP method (GET, POST, PATCH, DELETE)
 * @param {Object|null} options.body - request body for POST/PATCH
 * @param {boolean} options.showSuccessToast - show toast on success
 * @param {string} options.successMessage - success message
 * @param {Function} options.onSuccess - callback for successful result
 * @param {Function} options.onError - callback for error handling
 * @param {boolean} options.throwOnError - throw error instead of showing toast
 * @returns {Promise<Object>} - request result
 */
export const apiRequest = async ({
  endpoint,
  method = 'GET',
  body = null,
  showSuccessToast = false,
  successMessage = '',
  onSuccess = null,
  onError = null,
  throwOnError = false,
}) => {
  const url = `${API_BASE_URL}${endpoint}`

  // Request configuration
  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Add body for POST/PATCH requests
  if (body && (method === 'POST' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, requestOptions)
    const data = await response.json().catch(() => ({}))

    // Handle successful responses
    if (response.ok) {
      if (showSuccessToast && successMessage) {
        toast.success(successMessage)
      }

      if (onSuccess) {
        onSuccess(data)
      }

      return { success: true, data }
    }

    // Handle errors
    if (data?.errors && Array.isArray(data.errors)) {
      const fieldErrors = data.errors
        .filter((err) => err.type === 'field')
        .map((err) => `${err.value}, ${err.path}: ${err.msg}`)

      for (const errorMsg of fieldErrors) {
        toast.error(errorMsg)
      }
      
      // Add general errors
      const generalErrors = data.errors.filter((err) => err.type !== 'field')
      for (const error of generalErrors) {
        toast.error(error.msg || error.message)
      }
    } else if (data?.message) {
      toast.error(data.message)
    } else {
      toast.error(`Request failed with status ${response.status}`)
    }

    if (onError) {
      onError(data, response.status)
    }

    if (throwOnError) {
      throw new Error(
        data?.message || `Request failed with status ${response.status}`
      )
    }

    return { success: false, data, status: response.status }
  } catch (error) {
    console.error('API Request Error:', error)

    if (throwOnError) {
      throw error
    }

    const errorMessage = error.message || 'Network error occurred'
    toast.error(errorMessage)

    if (onError) {
      onError({ message: errorMessage }, 0) // 0 - status code of unknown error
    }

    return { success: false, error: errorMessage }
  }
}

// Functions for working with quotes
export const quoteAPI = {
  // GET ALL quotes with filtering
  getAll: (queryParams = '') => {
    const endpoint = queryParams ? `/quotes?${queryParams}` : '/quotes'
    return apiRequest({ endpoint, method: 'GET' })
  },

  // GET random quotes
  getRandom: (queryParams = '') => {
    const endpoint = queryParams
      ? `/quotes/random?${queryParams}`
      : '/quotes/random'
    return apiRequest({ endpoint, method: 'GET' })
  },

  // GET a single quote
  getById: (id) => {
    return apiRequest({
      endpoint: `/quotes/${id}`,
      method: 'GET',
    })
  },

  // CREATE a new quote
  create: (quoteData, options = {}) => {
    return apiRequest({
      endpoint: '/quotes',
      method: 'POST',
      body: quoteData,
      showSuccessToast: true,
      successMessage: 'Quote created successfully',
      onSuccess: options.onSuccess,
      throwOnError: options.throwOnError || false,
    })
  },

  // UPDATE a quote
  update: (id, quoteData, options = {}) => {
    return apiRequest({
      endpoint: `/quotes/${id}`,
      method: 'PATCH',
      body: quoteData,
      showSuccessToast: true,
      successMessage: 'Quote updated successfully',
      onSuccess: options.onSuccess,
      throwOnError: options.throwOnError || false,
    })
  },

  // DELETE a quote
  delete: (id, options = {}) => {
    return apiRequest({
      endpoint: `/quotes/${id}`,
      method: 'DELETE',
      showSuccessToast: true,
      successMessage: 'Quote deleted successfully',
      onSuccess: options.onSuccess,
      throwOnError: options.throwOnError || false,
    })
  },
}

export default apiRequest
