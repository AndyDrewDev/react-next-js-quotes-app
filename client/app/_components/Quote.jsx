import Link from 'next/link'
import CategoryTags from '@/app/_components/CategoryTags'
import { highlightText } from '@/app/_utils/textHighlight'

const MAX_VISIBLE_LENGTH = 250

export default function Quote({ quote, searchText, selectedCategory }) {
  const { text, author, categories, id } = quote

  // Create query string with search parameters if they exist
  const quoteUrl = searchText
    ? `/quotes/${id}?searchText=${encodeURIComponent(searchText)}`
    : `/quotes/${id}`

  return (
    <div className='bg-[#faf9fc] p-4 shadow-md rounded-lg dark:bg-gray-800 hover:scale-[1.03] hover:bg-violet-100 transition-all duration-300 dark:hover:bg-gray-600'>
      <Link href={quoteUrl} className='block'>
        <p className='mb-4 text-lg italic text-gray-900 dark:text-gray-100'>
          &ldquo;
          {text.length > MAX_VISIBLE_LENGTH
            ? highlightText(
                `${text.slice(0, MAX_VISIBLE_LENGTH)}...`,
                searchText
              )
            : highlightText(text, searchText)}
          &rdquo;
        </p>
      </Link>

      <p className='flex justify-end pb-10'>
        <Link
          href={
            searchText
              ? `/search?author=${author}&text=${encodeURIComponent(
                  searchText
                )}`
              : `/search?author=${author}`
          }
          className='text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-violet-500 dark:hover:text-violet-500'
        >
          {' '}
          — {author}
        </Link>
      </p>

      <CategoryTags
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </div>
  )
}
