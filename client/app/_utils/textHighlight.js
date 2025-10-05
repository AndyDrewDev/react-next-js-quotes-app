/**
 * Highlights search text within a given text by wrapping matches in a span with yellow background
 * @param {string} text - The original text to search in
 * @param {string} searchText - The text to highlight
 * @returns {JSX.Element|string} - JSX with highlighted text or original text if no search term
 */
export function highlightText(text, searchText) {
  if (!searchText || searchText.length < 3 || !text) {
    return text
  }

  // Escape special regex characters in search text
  const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create regex for case-insensitive search
  const regex = new RegExp(`(${escapedSearchText})`, 'gi')

  // Split text by the search term and create highlighted version
  const parts = text.split(regex)

  return parts.map((part, index) => {
    // Check if this part matches the search text (case-insensitive)
    if (part && searchText && part.toLowerCase() === searchText.toLowerCase()) {
      return (
        <span
          key={index}
          className='bg-yellow-200 dark:bg-yellow-400/90 py-0.5 rounded-sm'
        >
          {part}
        </span>
      )
    }
    return part
  })
}
