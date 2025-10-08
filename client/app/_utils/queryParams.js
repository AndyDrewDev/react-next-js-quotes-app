const DEFAULT_LIMIT = 9

export const createQueryString = ({ formData }) => {
  const { text, author, category, limit } = formData
  const params = new URLSearchParams()
  if (text) params.set('text', text)
  if (author) params.set('author', author)
  if (category) params.set('category', category)
  params.set('limit', Number.parseInt(limit, 10) || DEFAULT_LIMIT) 

  return params.toString()
}
