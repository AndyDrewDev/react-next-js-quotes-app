import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Quotes from '@/components/Quotes'
import Quote from '@/components/Quote'
import { ClipLoader } from 'react-spinners'

jest.mock('react-spinners', () => ({
  ClipLoader: jest.fn((props) => <div data-testid='clip-loader' {...props} />),
}))

jest.mock('@/components/Quote', () => ({
  __esModule: true,
  default: jest.fn(({ quote }) => (
    <div data-testid='quote-item'>{quote.text}</div>
  )),
}))

describe('Quotes', () => {
  const baseProps = {
    quotes: [],
    searchText: '',
    selectedCategory: '',
    searchSubmitted: false,
    isLoading: false,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows loader while fetching quotes', () => {
    render(<Quotes {...baseProps} isLoading />)

    expect(screen.getByTestId('clip-loader')).toBeInTheDocument()
    expect(ClipLoader).toHaveBeenCalledTimes(1)
    expect(ClipLoader.mock.calls[0][0]).toMatchObject({
      color: '#9333EA',
      size: 80,
    })
  })

  it('renders empty state when search returns no quotes', () => {
    render(<Quotes {...baseProps} searchSubmitted />)

    expect(screen.getByText('No quotes found')).toBeInTheDocument()
  })

  it('renders nothing when no search has been submitted and no quotes', () => {
    const { container } = render(<Quotes {...baseProps} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders quotes when data is available', () => {
    const quotes = [
      {
        id: '1',
        text: 'First life quote',
        author: 'Author One',
        categories: ['Life'],
      },
      {
        id: '2',
        text: 'Second life quote',
        author: 'Author Two',
        categories: ['Life'],
      },
    ]

    render(
      <Quotes
        {...baseProps}
        quotes={quotes}
        searchText='life'
        selectedCategory='Life'
      />
    )

    expect(screen.getAllByTestId('quote-item')).toHaveLength(quotes.length)
    expect(Quote).toHaveBeenCalledTimes(quotes.length)

    quotes.forEach((quote, index) => {
      const callArgs = Quote.mock.calls[index][0]
      expect(callArgs).toMatchObject({
        quote,
        searchText: 'life',
        selectedCategory: 'Life',
      })
    })
  })

  it('suppresses empty state when quotes are returned after search', () => {
    const quotes = [
      {
        id: '3',
        text: 'Search match quote',
        author: 'Searcher',
        categories: ['Search'],
      },
    ]

    render(<Quotes {...baseProps} quotes={quotes} searchSubmitted />)

    expect(screen.queryByText('No quotes found')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('quote-item')).toHaveLength(1)
  })

  it('keeps showing loader when loading even if quotes are provided', () => {
    const quotes = [
      {
        id: '4',
        text: 'Loading quote',
        author: 'Loader',
        categories: ['Info'],
      },
    ]

    render(<Quotes {...baseProps} quotes={quotes} isLoading />)

    expect(screen.getByTestId('clip-loader')).toBeInTheDocument()
    expect(Quote).not.toHaveBeenCalled()
  })

  it('applies layout classes to the quotes container', () => {
    const quotes = [
      {
        id: '5',
        text: 'Styled quote',
        author: 'Stylist',
        categories: ['Style'],
      },
    ]

    const { container } = render(<Quotes {...baseProps} quotes={quotes} />)

    const wrapper = container.firstChild

    expect(wrapper).toHaveClass(
      'pt-5',
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'gap-6'
    )
  })

  it('removes loader and renders quotes after loading completes', () => {
    const quotes = [
      {
        id: '6',
        text: 'Post-load quote',
        author: 'Poster',
        categories: ['After'],
      },
    ]

    const { rerender } = render(<Quotes {...baseProps} isLoading />)

    expect(screen.getByTestId('clip-loader')).toBeInTheDocument()
    expect(Quote).not.toHaveBeenCalled()

    jest.clearAllMocks()

    rerender(<Quotes {...baseProps} quotes={quotes} isLoading={false} />)

    expect(screen.queryByTestId('clip-loader')).not.toBeInTheDocument()
    expect(Quote).toHaveBeenCalledTimes(1)
    expect(Quote.mock.calls[0][0]).toMatchObject({
      quote: quotes[0],
    })
  })
})
