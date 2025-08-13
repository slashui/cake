"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import courseData from '@/libs/course.json'

const Aside = ({ locale }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [expandedChapter, setExpandedChapter] = useState('chapter3')

  const hasContent = (chapter) => {
    return chapter.id === 'chapter1' ||
      chapter.id === 'chapter2' ||
      chapter.id === 'chapter3' ||
      chapter.id === 'chapter4' ||
      chapter.id === 'chapter6' ||
      chapter.id === 'chapter9'
  }

  const toggleChapter = (chapter) => {
    if (hasContent(chapter)) {
      if (expandedChapter === chapter.id) {
        setExpandedChapter(null)
      } else {
        setExpandedChapter(chapter.id)
      }
    }
  }

  const renderLessons = (lessons) => {
    return lessons.map((lesson, index) => (
      <Link href={lesson.url} key={index}>
        <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
          <img src="/play.svg" className="w-4 h-4 text-gray-400 flex-shrink-0" alt="播放" />
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{lesson.title}</span>
            <span className="text-xs text-gray-600">({lesson.duration})</span>
          </div>
        </li>
      </Link>
    ))
  }

  const renderSection = (section) => {
    return (
      <div key={section.title}>
        <li className='font-bold text-sm text-gray-400'>{section.title} ({section.duration})</li>
        {renderLessons(section.lessons)}
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      // 先清除本地存储
      localStorage.clear()
      sessionStorage.clear()

      // 使用 signOut 但不自动重定向
      await signOut({ redirect: false })

      // 手动跳转到登录页面
      router.push(`/${locale}/login`)
    } catch (error) {
      console.error('Logout error:', error)
      // 如果出错，也尝试跳转到登录页面
      router.push(`/${locale}/login`)
    }
  }

  const handleLogin = () => {
    router.push(`/${locale}/login`)
  }

  return (
    <div className="flex flex-col h-screen bg-[#fff] border-r-2 border-dark overflow-auto relative">
      <div className="flex-1">
        <Link href="/" className="block m-8">
          <img src="/logo.png" className="w-[120px]" alt="Logo" />
        </Link>

        <nav className="space-y-3">
          <div className="space-y-0">
            {courseData.chapters.map((chapter) => {
              const isDisabled = !hasContent(chapter);

              return (
                <div key={chapter.id} className="overflow-hidden">
                  <div
                    className={`w-full flex items-center justify-between p-3 py-5 transition-all duration-200
                      ${isDisabled
                        ? 'pointer-events-none opacity-50'
                        : 'hover:bg-[#9458FE]/10 cursor-pointer'
                      } 
                      border-t-2 border-b-1 border-gray-300`}
                    onClick={() => !isDisabled && toggleChapter(chapter)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isDisabled ? 'text-gray-400' : 'text-[#302645]'
                        }`}>
                        ({chapter.id.replace('chapter', '')}){chapter.title}
                      </span>
                      {isDisabled && (
                        <span className="text-xs text-gray-400">(即将上线)</span>
                      )}
                    </div>
                    {!isDisabled && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${expandedChapter === chapter.id ? 'transform rotate-180' : ''
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>

                  {!isDisabled && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedChapter === chapter.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <div className="p-3 text-xs text-gray-600">{chapter.description}</div>
                      <ul className="px-3 pb-3 space-y-2">
                        {chapter.sections ?
                          chapter.sections.map(section => renderSection(section)) :
                          renderLessons(chapter.lessons)
                        }
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* 添加退出按钮区域 */}
      <div className="border-t border-gray-200 p-4 mt-auto hidden">
        {session ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-white bg-[#5d31ff] hover:bg-[#4a28d9] rounded-lg transition-colors font-bold justify-center shadow-md"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3h9Zm3-10H5a2 2 0 0 0-2 2v6h2V5h14v14H5v-6H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>
            <span className="text-sm font-medium">退出登录</span>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full flex items-center gap-3 px-4 py-2 text-white bg-[#5d31ff] hover:bg-[#4a28d9] rounded-lg transition-colors font-bold justify-center shadow-md"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3h9Zm3-10H5a2 2 0 0 0-2 2v6h2V5h14v14H5v-6H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>
            <span className="text-sm font-medium">我要登录</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Aside