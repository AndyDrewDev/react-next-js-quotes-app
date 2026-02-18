import { toast } from 'react-toastify'
import apiRequest, { quoteAPI } from '@/utils/apiClient'

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/config/config', () => ({
  API_BASE_URL: 'http://api.test',
}))

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    jest.clearAllMocks()
  })

  describe('apiRequest', () => {
    it('handles successful response and optional success toast', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'ok' }),
      })

      const result = await apiRequest({
        endpoint: '/test',
        method: 'GET',
        showSuccessToast: true,
        successMessage: 'Done',
      })

      expect(result).toEqual({ success: true, data: { message: 'ok' } })
      expect(toast.success).toHaveBeenCalledWith('Done')
      expect(global.fetch).toHaveBeenCalledWith('http://api.test/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    })

    it('handles field and general errors with toasts', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          errors: [
            { type: 'field', path: 'author', value: 'a', msg: 'too short' },
            { type: 'general', msg: 'bad request' },
          ],
        }),
      })

      const result = await apiRequest({
        endpoint: '/test',
        method: 'POST',
        body: { a: 1 },
      })

      expect(result.success).toBe(false)
      expect(toast.error).toHaveBeenCalledWith('a, author: too short')
      expect(toast.error).toHaveBeenCalledWith('bad request')
    })

    it('throws on error when throwOnError is true', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'server error' }),
      })

      await expect(
        apiRequest({ endpoint: '/boom', throwOnError: true })
      ).rejects.toThrow('server error')
    })

    it('handles network failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network down'))
      const result = await apiRequest({ endpoint: '/x' })
      expect(result.success).toBe(false)
      expect(toast.error).toHaveBeenCalledWith('Network down')
    })
  })

  describe('quoteAPI', () => {
    it('builds endpoints correctly', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) })

      await quoteAPI.getAll('text=life')
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.test/quotes?text=life',
        expect.any(Object)
      )

      await quoteAPI.getRandom()
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.test/quotes/random',
        expect.any(Object)
      )

      await quoteAPI.getById(5)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.test/quotes/5',
        expect.any(Object)
      )

      await quoteAPI.create({ text: 't' })
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.test/quotes',
        expect.objectContaining({ method: 'POST' })
      )

      await quoteAPI.update(3, { text: 't' })
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.test/quotes/3',
        expect.objectContaining({ method: 'PATCH' })
      )

      await quoteAPI.delete(2)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.test/quotes/2',
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })
})
