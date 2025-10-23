import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Quote from '@/components/Quote'
import CategoryTags from '@/components/CategoryTags'
import { highlightText } from '@/utils/textHighlight'

jest.mock('@/components/CategoryTags', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid='category-tags' />),
}))

jest.mock('@/utils/textHighlight', () => ({
  highlightText: jest.fn((text) => text),
}))

const baseQuote = {
  id: 'q-1',
  text: 'Life is beautiful when shared with friends',
  author: 'John Doe',
  categories: ['Life', 'Friendship'],
}

describe('Testing Quote component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render quote text with quotation marks', () => {
    render(<Quote quote={baseQuote} searchText='' selectedCategory='Life' />)

    const textElement = screen.getByText(/Life is beautiful/, { exact: false })
    expect(textElement).toBeInTheDocument()
    expect(textElement.textContent).toContain('“')
    expect(textElement.textContent).toContain('”')
  })

  it('should pass truncated text to highlightText when exceeding max length', () => {
    const longText = `${'Long quote '.repeat(30)}tail`
    const longQuote = { ...baseQuote, id: 'q-2', text: longText }

    render(<Quote quote={longQuote} searchText='quote' selectedCategory='' />)

    expect(highlightText).toHaveBeenCalled()
    const [passedText, passedSearchText] = highlightText.mock.calls[0]
    expect(passedSearchText).toBe('quote')
    expect(passedText).toMatch(/\.\.\.$/)
    expect(passedText.length).toBeLessThan(longText.length)
  })

  it('should build quote link with encoded search text', () => {
    render(
      <Quote
        quote={baseQuote}
        searchText='Life is beautiful'
        selectedCategory=''
      />
    )

    const quoteLink = screen.getByRole('link', { name: /Life is beautiful/ })
    expect(quoteLink).toHaveAttribute(
      'href',
      `/quotes/${baseQuote.id}?searchText=${encodeURIComponent(
        'Life is beautiful'
      )}`
    )
  })

  it('should build author link and highlights search query', () => {
    render(
      <Quote
        quote={baseQuote}
        searchText='life'
        selectedCategory='Friendship'
      />
    )

    const authorLink = screen.getByRole('link', { name: /— John Doe/ })

    expect(authorLink).toHaveAttribute(
      'href',
      `/search?author=${baseQuote.author}&text=${encodeURIComponent('life')}`
    )
    expect(highlightText).toHaveBeenCalledWith(baseQuote.text, 'life')
  })

  it('should pass props to CategoryTags', () => {
    render(<Quote quote={baseQuote} searchText='' selectedCategory='Life' />)

    expect(CategoryTags).toHaveBeenCalledTimes(1)
    expect(CategoryTags.mock.calls[0][0]).toEqual({
      categories: baseQuote.categories,
      selectedCategory: 'Life',
    })
    expect(screen.getByTestId('category-tags')).toBeInTheDocument()
  })

  it('should omit search query from links when searchText is empty', () => {
    render(<Quote quote={baseQuote} searchText='' selectedCategory='' />)

    const quoteLink = screen.getByRole('link', { name: /Life is beautiful/ })
    expect(quoteLink).toHaveAttribute('href', `/quotes/${baseQuote.id}`)

    const authorLink = screen.getByRole('link', { name: /— John Doe/ })
    expect(authorLink).toHaveAttribute(
      'href',
      `/search?author=${baseQuote.author}`
    )
  })

  it('should highlight search text inside quote content with yellow background', () => {
    const { highlightText: realHighlight } = jest.requireActual(
      '@/utils/textHighlight'
    )
    highlightText.mockImplementation(realHighlight)

    render(
      <Quote quote={baseQuote} searchText='life' selectedCategory='Life' />
    )

    const highlighted = screen.getByText(/life/i, { selector: 'span' })
    expect(highlighted).toBeInTheDocument()
    expect(highlighted).toHaveClass('bg-yellow-200')
  })
})
