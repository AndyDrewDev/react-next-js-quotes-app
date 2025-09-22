import ClipLoader from 'react-spinners/ClipLoader'

export default function DeleteIconButton({
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none shadow-md transition-colors duration-200'
  const sizeStyles = 'w-8 h-8'
  const disabledStyles =
    'opacity-60 cursor-not-allowed hover:bg-red-600 active:bg-red-600'

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${
        disabled || isLoading ? disabledStyles : ''
      } ${className}`}
      disabled={disabled || isLoading}
      aria-label='Delete quote'
      title='Delete'
    >
      {isLoading ? (
        <ClipLoader color='#ffffff' size={18} />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          className='w-5 h-5 text-white'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='M3 6h18' />
          <path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
          <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' />
          <line x1='10' y1='11' x2='10' y2='17' />
          <line x1='14' y1='11' x2='14' y2='17' />
        </svg>
      )}
    </button>
  )
}
