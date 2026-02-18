import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { highlightText } from '@/utils/textHighlight'

describe('highlightText', () => {
  it('returns original text when searchText is empty or too short', () => {
    expect(highlightText('Hello world', '')).toBe('Hello world')
    expect(highlightText('Hello world', 'he')).toBe('Hello world')
    expect(highlightText('', 'hello')).toBe('')
  })

  it('wraps matched parts with span elements (case-insensitive)', () => {
    render(<div>{highlightText('Hello world, hello again', 'hello')}</div>)
    const spans = screen.getAllByText(/hello/i)
    expect(spans).toHaveLength(2)
    spans.forEach((el) => {
      expect(el.tagName).toBe('SPAN')
      expect(el).toHaveClass('bg-yellow-200')
    })
  })

  it('escapes special regex characters in search text', () => {
    render(<div>{highlightText('Price is $5.00', '$5.00')}</div>)
    const span = screen.getByText('$5.00')
    expect(span).toBeInTheDocument()
    expect(span.tagName).toBe('SPAN')
    expect(span).toHaveClass('bg-yellow-200')
  })
})
