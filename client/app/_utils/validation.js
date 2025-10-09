export const CATEGORY_NAME_REGEX = /^[a-z0-9-]+$/

export const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0
}

export const parseCategories = (categoriesStr) =>
  categoriesStr
    .split(',')
    .map((str) => str.trim())
    .filter(Boolean)

export const validateLimit = (limit, { min = 1, max = 99 } = {}) => {
  const num = Number.parseInt(limit, 10) || 9
  if (!Number.isInteger(num) || num < min || num > max) {
    return 'Limit must be an integer between 1 and 99'
  }
}

export const validateSearch = ({ formData }) => {
  const { text, author, category, limit } = formData
  const errors = {}

  if (text && text.length < 3)
    errors.text = 'Text must be at least 3 characters long'
  if (author && author.length < 2)
    errors.author = 'Author must be at least 2 characters long'
  if (category && !CATEGORY_NAME_REGEX.test(category)) {
    errors.category =
      'Category must contain only lowercase letters, numbers and dashes'
  }

  const limitErr = validateLimit(limit)
  if (limitErr) errors.limit = limitErr
  return errors
}

export const validateQuoteForm = ({ formData }) => {
  const { text, author, categories } = formData
  const errors = {}

  if (!text?.trim() || text.trim().length < 10) {
    errors.text = 'Text must be at least 10 characters long'
  }
  if (
    !author?.trim() ||
    author.trim().length < 2 ||
    author.trim().length > 255
  ) {
    errors.author = 'Author must be between 2 and 255 characters'
  }

  const list = parseCategories(categories || '')

  if (!categories?.trim() || !list.length) {
    errors.categories = 'Provide at least one category'
  } else if (!list.every((category) => CATEGORY_NAME_REGEX.test(category))) {
    errors.categories =
      'Categories must contain only lowercase letters, numbers and dashes'
  }
  return errors
}

export const validateQuoteCreateForm = ({ formData }) => {
  const { text, author, categories } = formData
  const errors = {}

  if (text && text.trim().length < 10) {
    errors.text = 'Text must be at least 10 characters long'
  }
  if (author && (author.trim().length < 2 || author.trim().length > 255)) {
    errors.author = 'Author must be between 2 and 255 characters'
  }

  const list = parseCategories(categories || '')

  if (categories && (!categories?.trim() || !list.length)) {
    errors.categories = 'Provide at least one category'
  } else if (!list.every((category) => CATEGORY_NAME_REGEX.test(category))) {
    errors.categories =
      'Categories must contain only lowercase letters, numbers and dashes'
  }
  return errors
}
