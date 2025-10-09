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
const setFormDataHandler = (e, formData, setFormData) => {
  // console.log('setFormDataHandler', e.target.name, e.target.value, e.target)
  setFormData({ ...formData, [e.target.name]: e.target.value })
}

// Common fields for Create/Edit forms
export const getCreateEditInputFields = ({
  formData,
  setFormData,
  validationErrors,
  onBlur,
}) => {
  const onChangeHandler = (e) => setFormDataHandler(e, formData, setFormData)
  return [
    {
      ...baseField,
      name: 'text',
      placeholder: 'Quote text (min 10 chars)',
      value: formData.text,
      onChange: onChangeHandler,
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
      value: formData.author,
      onChange: onChangeHandler,
      error: validationErrors?.author,
      onBlur,
    },
    {
      ...baseField,
      name: 'categories',
      placeholder: 'Categories (comma-separated, e.g. life, success)',
      value: formData.categories,
      onChange: onChangeHandler,
      error: validationErrors?.categories,
      onBlur,
    },
  ]
}

// Fields for Search form
export const getSearchInputFields = ({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors,
  validateSearch,
}) => {
  const onChangeHandler = (e) => setFormDataHandler(e, formData, setFormData)
  const onBlurHandler = () => setValidationErrors(validateSearch({ ...formData }))

  return [
    {
      ...baseField,
      name: 'text',
      placeholder: 'Search by text',
      value: formData.text,
      onChange: onChangeHandler,
      error: validationErrors?.text,
      onBlur: onBlurHandler,
    },
    {
      ...baseField,
      name: 'author',
      placeholder: 'Search by author',
      value: formData.author,
      onChange: onChangeHandler,
      error: validationErrors?.author,
      onBlur: onBlurHandler,
    },
    {
      ...baseField,
      name: 'category',
      placeholder: 'Search by category',
      value: formData.category,
      onChange: onChangeHandler,
      error: validationErrors?.category,
      onBlur: onBlurHandler,
      errorClassName: baseField.errorClassName + ' px-5',
    },
  ]
}
