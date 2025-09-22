import ClipLoader from 'react-spinners/ClipLoader'

export default function SaveIconButton({
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg focus:outline-none shadow-md transition-colors duration-200'
  const sizeStyles = 'w-8 h-8'
  const enabledColorStyles =
    'bg-green-500 hover:bg-green-600 active:bg-green-700'
  const disabledStyles = 'bg-gray-400 text-white cursor-not-allowed'

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${
        disabled || isLoading ? disabledStyles : enabledColorStyles
      } ${className}`}
      disabled={disabled || isLoading}
      aria-label='Save changes'
      title='Save'
    >
      {isLoading ? (
        <ClipLoader color='#ffffff' size={18} />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          className='w-5 h-5 text-gray-900'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z' />
          <path d='M17 3v6H7V3' />
          <path d='M7 13h10' />
          <path d='M9 17h6' />
        </svg>
      )}
    </button>
  )
}
