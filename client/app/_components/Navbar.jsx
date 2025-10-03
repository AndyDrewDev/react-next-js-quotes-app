'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useOnClickOutside } from '../_hooks/useOnClickOutside'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const pathname = usePathname()

  const linkBaseClasses =
    'text-gray-800 dark:text-white/80 hover:text-violet-600 dark:hover:text-gray-400'

  const closeMenu = () => {
    if (isOpen) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsAnimating(false)
      }, 100) // Match animation duration
    }
  }

  const menuRef = useOnClickOutside(closeMenu)

  const toggleMenu = () => {
    if (isOpen) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsAnimating(false)
      }, 100) // Match animation duration
    } else {
      setIsOpen(true)
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Match animation duration
    }
  }

  const getLinkClasses = (href) => {
    const isActive = pathname === href
    const activeClasses = 'font-bold dark:text-white'
    // border-b-2 border-violet-900 dark:border-white pb-0.5
    return `${linkBaseClasses} ${isActive ? activeClasses : ''}`
  }

  const handleLinkClick = () => {
    closeMenu()
  }

  const menuItems = [
    { href: '/', text: 'Random' },
    { href: '/search', text: 'Search' },
    { href: '/quotes/create', text: 'Create' },
  ]

  return (
    //fixed top-0 left-0 right-0 z-10
    <nav className=' bg-white p-4 dark:bg-gray-800 shadow-md'>
      <div className='flex container mx-auto  items-center justify-between md:justify-normal'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Quotes App
          </h1>
        </Link>

        <MobileMenu
          isOpen={isOpen}
          isAnimating={isAnimating}
          toggleMenu={toggleMenu}
          closeMenu={handleLinkClick}
          getLinkClasses={getLinkClasses}
          menuItems={menuItems}
          menuRef={menuRef}
        />

        <div className='pl-16 text-xl space-x-8 hidden md:flex'>
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              className={getLinkClasses(item.href)}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
