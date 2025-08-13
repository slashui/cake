import React from 'react'
import Link from 'next/link'
import courseData from '@/libs/course.json'

const CourseHeader = ({ chapterId, lessonUrl }) => {
  // 查找当前章节和课程
  const chapter = courseData.chapters.find(c => c.id === chapterId)
  
  let currentLesson = null
  let lessonList = []

  // 处理普通章节和带sections的章节
  if (chapter.sections) {
    chapter.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        if (lesson.url === lessonUrl) {
          currentLesson = lesson
        }
        lessonList.push(lesson)
      })
    })
  } else {
    currentLesson = chapter.lessons.find(lesson => lesson.url === lessonUrl)
    lessonList = chapter.lessons
  }

  if (!chapter || !currentLesson) {
    return <div>课程信息加载中...</div>
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/cn/dashboard" className="hover:text-gray-700">洛克AI编程基础课</Link>
        <span>/</span>
        <Link href={`/cn/dashboard/courses/${chapterId}`} className="hover:text-gray-700">
          {`第${chapterId.replace('chapter', '')}章：${chapter.title}`}
        </Link>
        <span>/</span>
        
      </div>
      <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>时长：{currentLesson.duration}</span>
        <span>讲师：洛克船长</span>
      </div>
    </div>
  )
}

export default CourseHeader