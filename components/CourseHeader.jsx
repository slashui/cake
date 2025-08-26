import React from 'react'
import Link from 'next/link'

const CourseHeader = ({ courseData, currentChapter, currentLesson, locale }) => {
  if (!courseData || !currentChapter || !currentLesson) {
    return <div>课程信息加载中...</div>
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href={`/${locale}/dashboard`} className="hover:text-gray-700">
          {courseData.title || '课程'}
        </Link>
        <span>/</span>
        <span className="hover:text-gray-700">
          {currentChapter.chapterNumber}
        </span>
        <span>/</span>
        <span className="text-gray-900">
          {currentLesson.lessonNumber}
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2">
        {currentLesson.title || currentLesson.lessonNumber}
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>时长：{currentLesson.duration || '30分钟'}</span>
      </div>
    </div>
  )
}

export default CourseHeader