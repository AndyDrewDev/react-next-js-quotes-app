export default function Quote({ quote }) {
  const { text, author, categories } = quote
  return (
    <div className='bg-[#faf9fc] p-4 shadow-md rounded-lg dark:bg-gray-800'>
      <p className='mb-4 text-lg italic text-gray-900 dark:text-gray-100'>
        "{text}"
      </p>
      <p className='mb-10 text-right text-lg font-semibold text-gray-700 dark:text-gray-300'>
        — {author}
      </p>
      <div className='flex flex-wrap mt-2'>
        {categories.map((category) => (
          <span
            key={category}
            className='text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300'
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  )
}
