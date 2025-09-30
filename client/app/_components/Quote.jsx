import Link from 'next/link'

const MAX_VISIBLE_LENGTH = 250
const MAX_VISIBLE_CATEGORIES = 10

export default function Quote({ quote, selectedCategory }) {
  const { text, author, categories, id } = quote
  return (
    <div className='bg-[#faf9fc] p-4 shadow-md rounded-lg dark:bg-gray-800 hover:scale-[1.03] hover:bg-violet-100 transition-all duration-300 dark:hover:bg-gray-600'>
      <Link href={`/quotes/${id}`}>
        <p className='mb-4 text-lg italic text-gray-900 dark:text-gray-100'>
          &ldquo;
          {text.length > MAX_VISIBLE_LENGTH
            ? `${text.slice(0, MAX_VISIBLE_LENGTH)}...`
            : text}
          &rdquo;
        </p>
        <p className='mb-10 text-right text-lg font-semibold text-gray-700 dark:text-gray-300'>
          — {author}
        </p>
      </Link>

      <div className='flex flex-wrap mt-2'>
        {categories.slice(0, MAX_VISIBLE_CATEGORIES).map((category) => (
          <Link
            key={category}
            href={`/search?category=${category}`}
            className={`${
              category === selectedCategory
                ? 'bg-violet-900 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            } text-sm px-2 py-1 rounded-full mr-2 mb-2`}
          >
            {category}
          </Link>
        ))}
        {categories.length > MAX_VISIBLE_CATEGORIES && (
          <span className='text-gray-700 dark:text-gray-300 text-sm font-bold self-end pb-3'>
            ...and other
          </span>
        )}
      </div>
    </div>
  )
}
