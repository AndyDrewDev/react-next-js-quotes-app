import CategoryTag from '@/app/_components/CategoryTag'

const MAX_VISIBLE_CATEGORIES = 10

export default function CategoryTags({
  categories,
  selectedCategory,
  isQuotePage,
}) {
  let displayedCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES)
  if (isQuotePage) {
    displayedCategories = categories
  }
  if (selectedCategory && categories.includes(selectedCategory)) {
    const indexOfSelectedCategory = categories.indexOf(selectedCategory)
    displayedCategories.splice(indexOfSelectedCategory, 1)
    displayedCategories.unshift(selectedCategory)
  }
  return (
    <div
      className={`${isQuotePage && 'justify-center gap-3'} flex flex-wrap mt-2`}
    >
      {displayedCategories.map((category) => (
        <CategoryTag
          key={category}
          category={category}
          selectedCategory={selectedCategory}
          isQuotePage={isQuotePage}
        />
      ))}
      {!isQuotePage && categories.length > MAX_VISIBLE_CATEGORIES && (
        <span className='text-gray-700 dark:text-gray-300 text-sm font-bold self-end pb-3'>
          ...and other
        </span>
      )}
    </div>
  )
}
