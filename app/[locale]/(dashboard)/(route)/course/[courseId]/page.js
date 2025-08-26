'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function CourseOverviewPage({ params }) {
  const { data: session } = useSession()
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const { courseId, locale } = params

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // 获取课程结构
        const courseResponse = await fetch(`/api/courses?courseId=${courseId}&includeStructure=true`)
        if (courseResponse.ok) {
          const courseInfo = await courseResponse.json()
          setCourseData(courseInfo)
          
          // 自动重定向到第一个章节的第一个课时
          if (courseInfo.fileSystemStructure?.chapters?.length > 0) {
            const firstChapter = courseInfo.fileSystemStructure.chapters[0]
            if (firstChapter.lessons?.length > 0) {
              const firstLesson = firstChapter.lessons[0]
              router.replace(`/${locale}/course/${courseId}/${firstChapter.chapterNumber}/${firstLesson.lessonNumber}`)
              return
            }
          }
        }
      } catch (error) {
        console.error('Failed to load course:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId, locale, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">课程未找到</h2>
          <p className="mb-6 text-gray-600">无法找到指定的课程内容。</p>
          <button
            className="bg-[#5d31ff] hover:bg-[#4a28d9] text-white px-6 py-2 rounded-full font-bold transition-colors"
            onClick={() => router.push(`/${locale}/dashboard`)}
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  // 如果没有章节，显示课程概览
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{courseData.title}</h1>
        <p className="text-gray-600 mb-6">{courseData.description}</p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">课程开发中</h2>
          <p className="text-yellow-700">
            此课程暂无内容，请联系管理员添加章节和课时。
          </p>
        </div>
      </div>
    </div>
  )
}