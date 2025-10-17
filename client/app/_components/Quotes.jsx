import Quote from '@/components/Quote'
import { ClipLoader } from 'react-spinners'
import { quoteContainerStyle, emptyResponseStyle } from '@/components/styles'

export default function Quotes({
  quotes,
  searchText,
  selectedCategory,
  searchSubmitted = false,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center pt-10'>
        <ClipLoader color='#9333EA' size={80} />
      </div>
    )
  }
  if (!quotes?.length && searchSubmitted) {
    return <div className={emptyResponseStyle}>No quotes found</div>
  }

  if (!quotes?.length) {
    return null
  }

  return (
    <div className={quoteContainerStyle}>
      {quotes.map((quote) => (
        <Quote
          key={quote.id}
          quote={quote}
          searchText={searchText}
          selectedCategory={selectedCategory}
        />
      ))}
    </div>
  )
}
