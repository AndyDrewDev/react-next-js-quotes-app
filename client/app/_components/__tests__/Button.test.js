import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from '@/components/Button'

describe('Button', () => {
  const baseClasses = [
    'text-xl',
    'px-6',
    'py-3',
    'rounded-lg',
    'focus:outline-none',
  ]

  const mockOnClick = jest.fn()

  afterEach(() => {
    jest.clearAllMocks() // Clear all mock calls after each test
  })

  it('renders provided text', () => {
    render(<Button text='Click me' onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: 'Click me' })

    expect(button).toBeInTheDocument()
    baseClasses.forEach((className) => {
      expect(button).toHaveClass(className)
    })
    expect(button).toHaveClass(
      'bg-violet-900',
      'text-white',
      'hover:bg-violet-800',
      'active:bg-violet-950'
    )
  })

  it('applies secondary variant styles when requested', () => {
    render(
      <Button text='Secondary' variant='secondary' onClick={mockOnClick} />
    )

    const button = screen.getByRole('button', { name: 'Secondary' })

    expect(button).toHaveClass(
      'bg-gray-500',
      'text-white',
      'hover:bg-gray-400',
      'active:bg-gray-400'
    )
  })

  it('applies disabled styles and prevents clicks when disabled', () => {
    render(<Button text='Disabled' disabled onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: 'Disabled' })

    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      'bg-gray-300',
      'text-white',
      'hover:bg-gray-300',
      'active:bg-gray-400'
    )
    fireEvent.click(button)
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('calls onClick when pressed and enabled', () => {
    render(<Button text='Submit' onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: 'Submit' })

    fireEvent.click(button)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
