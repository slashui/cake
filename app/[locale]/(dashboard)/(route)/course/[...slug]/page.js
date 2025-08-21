'use client'

import CourseTemplate from '@/components/CourseTemplate'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import courseData from '@/public/course.json'
import { useSession } from 'next-auth/react'

export default function CoursePage({ params }) {
  const { data: session } = useSession()
  const [lessonData, setLessonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug
  const chapterId = Array.isArray(params.slug) ? params.slug[0] : params.slug.split('/')[0]
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
  
  // 找到当前课程 - 简化匹配逻辑
  let currentLesson = null
  console.log('DEBUG: 当前slug:', slug)
  console.log('DEBUG: 当前locale:', locale)
  
  if (chapter.lessons) {
    chapter.lessons.forEach((lesson, index) => {
      console.log('DEBUG: lesson.url:', lesson.url)
      
      // 简化匹配：直接从lesson.url提取路径进行匹配
      // /cn/course/chapter1/lesson1 → chapter1/lesson1
      const lessonPath = lesson.url.replace(/^\/[^\/]+\/course\//, '')
      console.log('DEBUG: lessonPath:', lessonPath, 'slug:', slug)
      
      if (lessonPath === slug) {
        currentLesson = lesson
        console.log('DEBUG: 匹配成功!', lesson)
      }
    })
  }
  
  console.log('DEBUG: 最终currentLesson:', currentLesson)
  console.log('DEBUG: chapter.lessons[0] (raw from JSON):', chapter?.lessons?.[0])
  
  // 直接检查course.json中第一个lesson的数据
  if (chapter?.lessons?.[0]) {
    console.log('DEBUG: 第一个lesson的完整数据:', JSON.stringify(chapter.lessons[0], null, 2))
  }

  // 构建课程信息，保留视频相关字段
  const lessonInfo = currentLesson ? {
    ...currentLesson,
    // 如果currentLesson没有title，从frontmatter获取
    title: currentLesson.title || lessonData.frontmatter.title,
    duration: currentLesson.duration || lessonData.frontmatter.duration || '30分钟',
    // 确保视频字段被传递
    videoUrl: currentLesson.videoUrl,
    streamId: currentLesson.streamId,
    thumbnail: currentLesson.thumbnail
  } : {
    title: lessonData.frontmatter.title,
    duration: lessonData.frontmatter.duration || '30分钟',
    // 没有找到currentLesson时，视频字段为undefined
    videoUrl: undefined,
    streamId: undefined,
    thumbnail: undefined
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
            onClick={() => { window.location.href = '/cn/login'; }}
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  console.log('DEBUG: session:', session)
  console.log('DEBUG: lessonData:', lessonData)
  console.log('DEBUG: currentLesson:', currentLesson)
  console.log('DEBUG: lessonInfo passed to CourseTemplate:', lessonInfo)

  return (
    <CourseTemplate
      chapterId={chapterId}
      chapter={chapter}
      currentLesson={lessonInfo}
      lessonUrl={`/${locale}/course/${slug}`}
      content={lessonData.content}
      frontmatter={lessonData.frontmatter}
    />
  )
}