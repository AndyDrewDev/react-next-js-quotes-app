const styleVariants = {
  base: 'text-xl px-6 py-3 rounded-lg focus:outline-none',
  primary: 'bg-violet-900 text-white hover:bg-violet-800 active:bg-violet-950',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
  // danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 ring-red-600',
}

export default function Button({ onClick, text, variant = 'primary' }) {
  const buttonStyle = `${styleVariants.base} ${styleVariants[variant]}`

  return (
    <div className='text-center m-5'>
      <button onClick={onClick} className={buttonStyle}>
        {text}
      </button>
    </div>
  )
}
