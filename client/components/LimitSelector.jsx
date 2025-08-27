const DEFAULT_OPTIONS = [9, 18, 36, 72]

export default function LimitSelector({
  type = 'number',
  placeholder,
  value,
  onChange,
  onBlur,
  inputClassName = '',
  containerClassName = '',
  error,
  errorClassName = '',
  options = DEFAULT_OPTIONS,
  min = 1,
  max = 99,
  step = 1,
}) {
  return (
    <div className={containerClassName}>
      <div className='flex items-center gap-3 justify-center'>
        <input
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClassName}
        />
        <div className='flex gap-2'>
          {options.map((opt) => (
            <button
              key={opt}
              type='button'
              onClick={() => {
                onChange({ target: { value: String(opt) } })
                if (onBlur) onBlur()
              }}
              className={`px-4 py-2 rounded border ${
                String(opt) === String(value || 9)
                  ? 'bg-violet-900 text-white '
                  : 'border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}
