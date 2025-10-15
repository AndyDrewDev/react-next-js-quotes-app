const DEFAULT_LIMIT = 9

export const createQueryString = ({ formData = {} }) => {
  const { text, author, category, limit } = formData
  const params = new URLSearchParams()

  const trimmedText = text?.trim()
  const trimmedAuthor = author?.trim()
  const trimmedCategory = category?.trim()

  if (trimmedText) params.set('text', trimmedText)
  if (trimmedAuthor) params.set('author', trimmedAuthor)
  if (trimmedCategory) params.set('category', trimmedCategory)
  params.set('limit', Number.parseInt(limit, 10) || DEFAULT_LIMIT)

  return params.toString()
}
