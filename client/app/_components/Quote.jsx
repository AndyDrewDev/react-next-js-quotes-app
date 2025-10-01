import Link from 'next/link'
import CategoryTags from '@/app/_components/CategoryTags'

const MAX_VISIBLE_LENGTH = 250

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

      <CategoryTags
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </div>
  )
}
