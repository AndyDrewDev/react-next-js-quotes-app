'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const linkBaseClasses =
    'text-gray-800 dark:text-white/80 hover:text-violet-600 dark:hover:text-gray-400'

  const getLinkClasses = (href) => {
    const isActive = pathname === href
    const activeClasses = 'font-bold dark:text-white'
    // border-b-2 border-violet-900 dark:border-white pb-0.5
    return `${linkBaseClasses} ${isActive ? activeClasses : ''}`
  }

  return (
    <nav className='bg-white p-4 dark:bg-gray-800 shadow-md'>
      <div className='container mx-auto flex  items-center'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Quotes App
          </h1>
        </Link>

        <div className='flex pl-16 text-xl space-x-8'>
          <Link href='/' className={getLinkClasses('/')}>
            Random
          </Link>
          <Link href='/search' className={getLinkClasses('/search')}>
            Search
          </Link>
          <Link
            href='/quotes/create'
            className={getLinkClasses('/quotes/create')}
          >
            Create
          </Link>
        </div>
      </div>
    </nav>
  )
}
