'use client'

export default function HamburgerButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className='text-gray-800 dark:text-white py-1 transition-transform duration-200 hover:scale-105 active:scale-95'
    >
      <svg
        className={`w-8 h-8 transition-transform duration-200 ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
        />
      </svg>
    </button>
  )
}
