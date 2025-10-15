import { createQueryString } from '@/utils/queryParams'

describe('createQueryString', () => {
  it('should create a query string with the correct parameters', () => {
    const formData = {
      text: 'test ',
      author: 'test',
      category: 'test',
      limit: '9',
    }
    const queryString = createQueryString({ formData })
    expect(queryString).toBe('text=test&author=test&category=test&limit=9')
  })

  it('should create a query string with the correct parameters when formData is not provided', () => {
    const queryString = createQueryString({})
    expect(queryString).toBe('limit=9')
  })

  it('should filter out empty string, undefined, and null parameters', () => {
    const formData = {
      text: '',
      author: 'test',
      category: undefined,
      foo: null,
      limit: '9',
    }
    const queryString = createQueryString({ formData })
    expect(queryString).toBe('author=test&limit=9')
  })
  
  it('should filter out disallowed parameters', () => {
    const formData = {
      text: 'life',
      author: 'Einstein',
      foo: 'bar',
    }
    const queryString = createQueryString({ formData })
    expect(queryString).toBe('text=life&author=Einstein&limit=9')
  })

  it('should handle invalid limit', () => {
    const formData = {
      text: 'life',
      author: 'Einstein',
      limit: 'foo',
    }
    const queryString = createQueryString({ formData })
    expect(queryString).toBe('text=life&author=Einstein&limit=9')
  })

  it('should return empty string when no valid parameters are provided', () => {
    const formData = {
      text: '  ',
      foo: 'bar',
      bar: 'baz',
    }
    const queryString = createQueryString({ formData })
    expect(queryString).toBe('limit=9')
  })
 
})

