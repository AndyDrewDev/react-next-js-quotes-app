import ClipLoader from 'react-spinners/ClipLoader'

export default function EditIconButton({
  disabled = false,
  isLoading = false,
  className = '',
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 focus:outline-none shadow-md transition-colors duration-200'
  const sizeStyles = 'w-8 h-8'
  const disabledStyles =
    'opacity-60 cursor-not-allowed hover:bg-yellow-300 active:bg-yellow-300'

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${
        disabled || isLoading ? disabledStyles : ''
      } ${className}`}
      disabled={disabled || isLoading}
      aria-label='Edit quote'
      title='Edit'
    >
      {isLoading ? (
        <ClipLoader color='#ffffff' size={18} />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-edit text-gray-800'
        >
          <path d='M12 20h9'></path>
          <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path>
        </svg>
      )}
    </button>
  )
}
