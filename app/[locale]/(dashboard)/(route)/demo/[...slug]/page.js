'use client'

import CourseTemplate from '@/components/CourseTemplate'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import courseData from '@/libs/course.json'
import { useSession } from 'next-auth/react'

export default function CoursePage({ params }) {
  const { data: session } = useSession()
  const [lessonData, setLessonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const slug = params.slug.join('/')
  const [chapterId] = params.slug
  const locale = params.locale || 'cn'

  console.log('Params:', params)
  console.log('ChapterId:', chapterId)
  console.log('Slug:', slug)
  
  const chapter = courseData.chapters.find(c => c.id === chapterId)
  console.log('Found chapter:', chapter)
  
  const loadCourse = useCallback(async () => {
    console.log('Loading course data...')
    try {
      const response = await fetch(`/api/lessons?slug=${slug}`)
      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        router.replace(`/${locale}/404`)
        return
      }
      
      const data = await response.json()
      console.log('Received lesson data:', data)
      setLessonData(data)
    } catch (error) {
      console.error('Course loading error details:', {
        message: error.message,
        stack: error.stack,
        slug,
        locale
      })
      setError(error)
      router.replace(`/${locale}/404`)
    } finally {
      setLoading(false)
    }
  }, [slug, locale, router])

  useEffect(() => {
    console.log('Effect triggered with:', { slug, locale })
    loadCourse()
  }, [loadCourse])

  if (loading) {
    console.log('Rendering loading state')
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  if (error || !lessonData || !chapter) {
    console.log('Rendering null due to:', { 
      hasError: !!error, 
      hasLessonData: !!lessonData, 
      hasChapter: !!chapter 
    })
    return null
  }
  
  // 找到当前课程
  let currentLesson = null
  let lessonList = []

  if (chapter.sections) {
    chapter.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        if (lesson.url === slug) {
          currentLesson = lesson
        }
        lessonList.push(lesson)
      })
    })
  } else {
    currentLesson = chapter.lessons.find(lesson => lesson.url === slug)
    lessonList = chapter.lessons
  }

  // 如果找不到课程，使用 frontmatter 的信息
  const lessonInfo = currentLesson || {
    title: lessonData.frontmatter.title,
    duration: lessonData.frontmatter.duration || '30分钟'
  }

  const canPreview = currentLesson && currentLesson.isPreview === true;
  const isLoggedIn = !!session;
  if (!canPreview && !isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">请先登录/购买</h2>
          <p className="mb-6 text-gray-600">本课程仅限已购买或已登录用户观看。</p>
          <button
            className="bg-[#5d31ff] hover:bg-[#4a28d9] text-white px-6 py-2 rounded-full font-bold transition-colors"
            onClick={() => { window.location.href = '/cn/(auth)/login'; }}
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseTemplate
      chapterId={chapterId}
      chapter={chapter}
      currentLesson={lessonInfo}
      lessonUrl={`/${locale}/aideveloper/${slug}`}
      content={lessonData.content}
      frontmatter={lessonData.frontmatter}
    />
  )
}