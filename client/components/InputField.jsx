export default function InputField({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  containerClassName = '',
  inputClassName = '',
  error,
  errorClassName = '',
}) {
  return (
    <div className={containerClassName}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={inputClassName}
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}
