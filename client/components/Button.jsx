const styleVariants = {
  base: 'text-xl px-6 py-3 rounded-lg focus:outline-none',
  primary: 'bg-violet-900 text-white hover:bg-violet-800 active:bg-violet-950',
  secondary: 'bg-gray-500 text-white hover:bg-gray-400 active:bg-gray-400',
  disabled: 'bg-gray-300 text-white hover:bg-gray-300 active:bg-gray-400',
  // danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 ring-red-600',
}

export default function Button({ onClick, text, variant = 'primary', disabled = false }) {
  const buttonStyle = `${styleVariants.base} ${disabled ? styleVariants.disabled : styleVariants[variant]}`

  return (
    <div className='text-center m-5'>
      <button onClick={onClick} className={buttonStyle} disabled={disabled}>
       {text}
      </button>
    </div>
  )
}
