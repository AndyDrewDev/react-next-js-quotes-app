export default function Button({ onClick, text }) {
  return (
    <div className='text-center m-6'>
      <button
        onClick={onClick}
        className='bg-violet-900 text-white text-xl px-6 py-3 rounded-lg hover:bg-violet-800 focus-outline-none focus:ring-2 focus:ring-violet-600'
      >
        {text}
      </button>
    </div>
  )
}
