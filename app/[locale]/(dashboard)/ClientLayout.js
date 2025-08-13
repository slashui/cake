// ClientLayout.js
'use client'
import { useState } from 'react'
import Aside from '@/components/Aside'
import Providers from '@/libs/themes/providers'

export default function ClientLayout({ children, params }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const locale = params.locale

  return (
    <Providers>
      <div className="flex flex-row w-full h-screen relative">
        {/* 汉堡菜单按钮 */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* 移动端遮罩层 */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 侧边栏 */}
        <div className={`
          fixed md:relative md:w-[330px] w-[280px] h-screen z-40
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Aside locale={locale} />
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto h-screen w-full bg-neutral-bg dark:bg-dark-neutral-bg">
          <div className="overflow-x-scroll scrollbar-hide flex markdown flex-col dark:bg-[#d9cfff] bg-gray-100 justify-between pt-[42px] px-[23px] pb-[28px]">
            {children}
          </div>
        </div>
      </div>
    </Providers>
  )
}