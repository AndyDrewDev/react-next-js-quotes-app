import {
  inputContainerStyle,
  inputStyle,
  errorStyle,
} from '../_components/styles'

const baseField = {
  type: 'text',
  containerClassName: inputContainerStyle,
  inputClassName: inputStyle,
  errorClassName: errorStyle,
}

// Common fields for Create/Edit forms
export const getCreateEditInputFields = ({
  text,
  author,
  categories,
  setText,
  setAuthor,
  setCategories,
  validationErrors,
  onBlur,
}) => [
  {
    ...baseField,
    name: 'text',
    placeholder: 'Quote text (min 10 chars)',
    value: text,
    onChange: (e) => setText(e.target.value),
    error: validationErrors?.text,
    multiline: true,
    rows: 3,
    minRows: 4,
    onBlur,
  },
  {
    ...baseField,
    name: 'author',
    placeholder: 'Author (2-255 chars)',
    value: author,
    onChange: (e) => setAuthor(e.target.value),
    error: validationErrors?.author,
    onBlur,
  },
  {
    ...baseField,
    name: 'categories',
    placeholder: 'Categories (comma-separated, e.g. life, success)',
    value: categories,
    onChange: (e) => setCategories(e.target.value),
    error: validationErrors?.categories,
    onBlur,
  },
]

// Fields for Search form
export const getSearchInputFields = ({
  text,
  author,
  category,
  limit,
  setText,
  setAuthor,
  setCategory,
  validationErrors,
  setValidationErrors,
  validateSearch,
}) => [
  {
    ...baseField,
    name: 'text',
    placeholder: 'Search by text',
    value: text,
    onChange: (e) => setText(e.target.value),
    error: validationErrors?.text,
    onBlur: () =>
      setValidationErrors(validateSearch({ text, author, category, limit })),
  },
  {
    ...baseField,
    name: 'author',
    placeholder: 'Search by author',
    value: author,
    onChange: (e) => setAuthor(e.target.value),
    error: validationErrors?.author,
    onBlur: () =>
      setValidationErrors(validateSearch({ text, author, category, limit })),
  },
  {
    ...baseField,
    name: 'category',
    placeholder: 'Search by category',
    value: category,
    onChange: (e) => setCategory(e.target.value),
    error: validationErrors?.category,
    onBlur: () =>
      setValidationErrors(validateSearch({ text, author, category, limit })),
    errorClassName: baseField.errorClassName + ' px-5',
  },
]
