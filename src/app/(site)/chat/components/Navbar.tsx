import React, { ReactNode } from 'react'

const Navbar = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex justify-between mb-4 px-1 py-3 bg-gray-200 dark:bg-slate-900 h-16 items-center shadow-sm shadow-gray-300 dark:shadow-none'>
            {children}
        </div>
    )
}

export default Navbar