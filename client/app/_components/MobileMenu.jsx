'use client'

import Link from 'next/link'
import HamburgerButton from './HamburgerButton'

export default function MobileMenu({
  isOpen,
  isAnimating,
  toggleMenu,
  closeMenu,
  getLinkClasses,
  menuItems,
  menuRef,
}) {
  return (
    <div className='flex md:hidden relative'>
      <HamburgerButton isOpen={isOpen} onClick={toggleMenu} />

      {(isOpen || isAnimating) && (
        <div
          ref={menuRef}
          className={`absolute top-16 right-[-10px] bg-white dark:bg-gray-800 mr-1 rounded-xl shadow-xl z-20 ${
            isOpen ? 'animate-menu-appear' : 'animate-menu-disappear'
          }`}
        >
          <div className='flex flex-col items-end text-2xl gap-5 p-6 pr-0 mr-4 ml-20'>
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                className={getLinkClasses(item.href)}
                onClick={closeMenu}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
