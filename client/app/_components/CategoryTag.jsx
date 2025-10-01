import Link from 'next/link'

export default function CategoryTag({
  category,
  selectedCategory,
  isQuotePage,
}) {
  return (
    <Link
      href={`/search?category=${category}`}
      className={`${
        category === selectedCategory
          ? 'bg-violet-900 text-white'
          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      } ${
        isQuotePage
          ? 'text-lg bg-violet-900 text-white px-4 py-2 rounded-lg hover:scale-105'
          : 'text-sm px-2 py-1 rounded-full mr-2 mb-2 hover:scale-105'
      }`}
    >
      {category}
    </Link>
  )
}
