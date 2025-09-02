import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className='bg-white p-4 dark:bg-gray-800 shadow-md'>
      <div className='container mx-auto flex  items-center'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Quotes App
          </h1>
        </Link>

        <div className='flex pl-16 text-xl space-x-8'>
          <Link
            href='/'
            className='text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-400'
          >
            Random
          </Link>
          <Link
            href='/search'
            className='text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-400'
          >
            Search
          </Link>
          <Link
            href='/create'
            className='text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-400'
          >
            Create
          </Link>
        </div>
      </div>
    </nav>
  )
}
