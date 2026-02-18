import {
  CATEGORY_NAME_REGEX,
  isValidId,
  parseCategories,
  validateLimit,
  validateSearch,
  validateQuoteForm,
  validateQuoteCreateForm,
} from '@/utils/validation.js'

describe('validation utils', () => {
  describe('isValidId', () => {
    it('returns true for positive integers', () => {
      expect(isValidId(1)).toBe(true)
      expect(isValidId('2')).toBe(true)
    })

    it('returns false for zero, negatives, non-integers and NaN', () => {
      expect(isValidId(0)).toBe(false)
      expect(isValidId(-1)).toBe(false)
      expect(isValidId('1.5')).toBe(false)
      expect(isValidId('abc')).toBe(false)
    })
  })

  describe('parseCategories', () => {
    it('splits, trims, and filters empty values', () => {
      expect(parseCategories('life,  science , , art')).toEqual([
        'life',
        'science',
        'art',
      ])
      expect(parseCategories('  ')).toEqual([])
    })
  })

  describe('validateLimit', () => {
    it('passes for integer within default range', () => {
      expect(validateLimit('5')).toBeUndefined()
      expect(validateLimit(9)).toBeUndefined()
    })

    it('fails for values outside default range (other than 0 which falls back to 9)', () => {
      // '0' falls back to 9 due to `|| 9` behavior
      expect(validateLimit('0')).toBeUndefined()
      expect(validateLimit('100')).toBe(
        'Limit must be an integer between 1 and 99',
      )
      expect(validateLimit('-1')).toBe(
        'Limit must be an integer between 1 and 99',
      )
    })
  })

  describe('validateSearch', () => {
    it('validates individual fields and category regex', () => {
      const errors = validateSearch({
        formData: { text: 'ab', author: 'a', category: 'Bad', limit: '200' },
      })
      expect(errors.text).toBe('Text must be at least 3 characters long')
      expect(errors.author).toBe('Author must be at least 2 characters long')
      expect(errors.category).toBe(
        'Category must contain only lowercase letters, numbers and dashes',
      )
      expect(errors.limit).toBe('Limit must be an integer between 1 and 99')
    })

    it('returns no errors for valid input and trims values', () => {
      const errors = validateSearch({
        formData: {
          text: 'life',
          author: 'Al',
          category: 'inspiration',
          limit: '9',
        },
      })
      expect(errors).toEqual({})
    })

    it('returns limit error when form data is empty', () => {
      const errors = validateSearch({ formData: {} })
      expect(errors).toEqual({
        limit: 'Limit must be an integer between 1 and 99',
      })
    })
  })

  describe('validateQuoteForm', () => {
    it('requires text, author in range, and at least one valid category', () => {
      const errors = validateQuoteForm({
        formData: { text: 'short', author: 'A', categories: '' },
      })
      expect(errors.text).toBe('Text must be at least 10 characters long')
      expect(errors.author).toBe('Author must be between 2 and 255 characters')
      expect(errors.categories).toBe('Provide at least one category')
    })

    it('validates category characters against regex', () => {
      const errors = validateQuoteForm({
        formData: {
          text: 'This is long enough',
          author: 'Alan',
          categories: 'good, Bad',
        },
      })
      expect(errors.categories).toBe(
        'Categories must contain only lowercase letters, numbers and dashes',
      )
    })

    it('passes for valid form data', () => {
      const errors = validateQuoteForm({
        formData: {
          text: 'A very meaningful quote',
          author: 'Author Name',
          categories: 'life,inspiration',
        },
      })
      expect(errors).toEqual({})
    })
  })

  describe('validateQuoteCreateForm', () => {
    it('allows empty fields (optional), but validates if provided', () => {
      expect(validateQuoteCreateForm({ formData: {} })).toEqual({})

      const errors1 = validateQuoteCreateForm({
        formData: { text: 'short', author: 'A' },
      })
      expect(errors1.text).toBe('Text must be at least 10 characters long')
      expect(errors1.author).toBe('Author must be between 2 and 255 characters')

      // categories are optional; empty string should not produce an error
      const errors2 = validateQuoteCreateForm({
        formData: { categories: '' },
      })
      expect(errors2).toEqual({})
    })

    it('validates categories if provided and passes otherwise', () => {
      const errors = validateQuoteCreateForm({
        formData: { categories: 'good,Bad' },
      })
      expect(errors.categories).toBe(
        'Categories must contain only lowercase letters, numbers and dashes',
      )

      const ok = validateQuoteCreateForm({
        formData: {
          text: 'This text is long enough',
          author: 'Alan',
          categories: 'life',
        },
      })
      expect(ok).toEqual({})
    })
  })

  describe('CATEGORY_NAME_REGEX', () => {
    it('matches lowercase letters, digits, and dashes only', () => {
      expect(CATEGORY_NAME_REGEX.test('inspiration')).toBe(true)
      expect(CATEGORY_NAME_REGEX.test('life-2024')).toBe(true)
      expect(CATEGORY_NAME_REGEX.test('Life')).toBe(false)
      expect(CATEGORY_NAME_REGEX.test('bad!')).toBe(false)
      expect(CATEGORY_NAME_REGEX.test('with space')).toBe(false)
    })
  })
})
