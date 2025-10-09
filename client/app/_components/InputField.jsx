export default function InputField({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  containerClassName = '',
  inputClassName = '',
  error,
  errorClassName = '',
  multiline = false,
  rows = 4,
  minRows = 5,
}) {
  const minHeightStyle = multiline ? { minHeight: `${minRows * 1.5}rem` } : {}

  return (
    <div className={containerClassName}>
      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClassName}
          rows={rows}
          style={minHeightStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClassName}
        />
      )}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}
