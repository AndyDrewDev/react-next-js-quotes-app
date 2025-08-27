import Quote from '@/components/Quote'
import { quoteContainerStyle, emptyResponseStyle } from '@/components/styles'

export default function Quotes({ quotes, searchSubmitted = false }) {
  if (!quotes?.length && searchSubmitted) {
    return <div className={emptyResponseStyle}>No quotes found</div>
  }

  if (!quotes?.length) {
    return null
  }

  return (
    <div className={quoteContainerStyle}>
      {quotes.map((quote) => (
        <Quote key={quote.id} quote={quote} />
      ))}
    </div>
  )
}
