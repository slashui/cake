'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2,
  Edit,
  Check,
  X
} from 'lucide-react'

export default function AdminDashboard() {
  const [courseData, setCourseData] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null) // Can be chapter or lesson
  const [expandedChapters, setExpandedChapters] = useState(new Set())
  const [editingItem, setEditingItem] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    loadCourseData()
  }, [])

  const loadCourseData = async () => {
    try {
      const response = await fetch('/libs/course.json')
      const data = await response.json()
      setCourseData(data)
      // Expand first chapter by default
      if (data.chapters.length > 0) {
        setExpandedChapters(new Set([data.chapters[0].id]))
      }
    } catch (error) {
      console.error('Failed to load course data:', error)
    }
  }

  const toggleChapter = (chapterId) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const startEdit = (type, id, currentValue) => {
    setEditingItem({ type, id })
    setEditValue(currentValue)
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditValue('')
  }

  const saveEdit = () => {
    if (!editingItem || !editValue.trim()) return

    const updatedData = { ...courseData }
    
    if (editingItem.type === 'chapter') {
      const chapter = updatedData.chapters.find(c => c.id === editingItem.id)
      if (chapter) {
        chapter.title = editValue.trim()
      }
    } else if (editingItem.type === 'lesson') {
      const [chapterId, lessonIndex] = editingItem.id.split('-')
      const chapter = updatedData.chapters.find(c => c.id === chapterId)
      if (chapter && chapter.lessons[parseInt(lessonIndex)]) {
        chapter.lessons[parseInt(lessonIndex)].title = editValue.trim()
      }
    }

    setCourseData(updatedData)
    setEditingItem(null)
    setEditValue('')
  }

  const addChapter = () => {
    const newChapter = {
      id: `chapter${courseData.chapters.length + 1}`,
      title: '新章节',
      description: '章节描述',
      status: 'pending',
      lessons: []
    }
    
    setCourseData({
      ...courseData,
      chapters: [...courseData.chapters, newChapter]
    })
  }

  const deleteChapter = (chapterId) => {
    if (confirm('确定要删除这个章节吗？')) {
      setCourseData({
        ...courseData,
        chapters: courseData.chapters.filter(c => c.id !== chapterId)
      })
    }
  }

  const addLesson = (chapterId) => {
    const updatedData = { ...courseData }
    const chapter = updatedData.chapters.find(c => c.id === chapterId)
    
    if (chapter) {
      const newLesson = {
        title: '新课程',
        duration: '30分钟',
        url: `/cn/aideveloper/${chapterId}/lesson${chapter.lessons.length + 1}`
      }
      
      chapter.lessons.push(newLesson)
      setCourseData(updatedData)
    }
  }

  const deleteLesson = (chapterId, lessonIndex) => {
    if (confirm('确定要删除这个课程吗？')) {
      const updatedData = { ...courseData }
      const chapter = updatedData.chapters.find(c => c.id === chapterId)
      
      if (chapter) {
        chapter.lessons.splice(lessonIndex, 1)
        setCourseData(updatedData)
        
        // Clear selection if deleted lesson was selected
        if (selectedLesson && selectedLesson.chapterId === chapterId && selectedLesson.lessonIndex === lessonIndex) {
          setSelectedLesson(null)
        }
      }
    }
  }

  const selectItem = (type, chapterId, lessonIndex = null) => {
    if (type === 'chapter') {
      setSelectedItem({ type: 'chapter', chapterId })
    } else {
      setSelectedItem({ type: 'lesson', chapterId, lessonIndex })
    }
  }

  const saveCourseData = async () => {
    // This would save to an API endpoint in a real application
    console.log('Saving course data:', courseData)
    alert('课程数据已保存！')
  }

  if (!courseData) {
    return <div className="p-8">加载中...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Course Tree */}
      <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">课程管理</h1>
            <div className="flex space-x-2">
              <button
                onClick={saveCourseData}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                保存课程
              </button>
              <button
                onClick={addChapter}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加章节
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{courseData.title}</p>
        </div>

        <div className="p-4">
          {courseData.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-4">
              {/* Chapter Header */}
              <div 
                className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedItem?.type === 'chapter' && selectedItem?.chapterId === chapter.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => selectItem('chapter', chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleChapter(chapter.id)
                      }}
                      className="mr-2 text-gray-500 hover:text-gray-700"
                    >
                      {expandedChapters.has(chapter.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    
                    <span className="font-medium text-gray-900 flex-1">
                      {chapter.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addLesson(chapter.id)
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                      title="添加课程"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChapter(chapter.id)
                      }}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      title="删除章节"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chapter Lessons */}
              {expandedChapters.has(chapter.id) && (
                <div className="ml-6 mt-2 space-y-2">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className={`p-3 rounded border-2 cursor-pointer transition-colors ${
                        selectedItem?.type === 'lesson' && selectedItem?.chapterId === chapter.id && selectedItem?.lessonIndex === lessonIndex
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-transparent hover:bg-gray-50'
                      }`}
                      onClick={() => selectItem('lesson', chapter.id, lessonIndex)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {lesson.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {lesson.duration}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteLesson(chapter.id, lessonIndex)
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title="删除课程"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Content Editor */}
      <div className="w-1/2 bg-white">
        {selectedItem ? (
          <div className="p-6">
            {selectedItem.type === 'chapter' ? (
              // Chapter Editor
              <>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    章节编辑
                  </h2>
                  <p className="text-gray-600 mt-1">
                    编辑章节信息
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      章节标题
                    </label>
                    <input
                      type="text"
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.title || ''}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter) {
                          chapter.title = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      章节描述
                    </label>
                    <textarea
                      rows={4}
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.description || ''}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter) {
                          chapter.description = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      章节状态
                    </label>
                    <select
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.status || 'pending'}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter) {
                          chapter.status = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">待完成</option>
                      <option value="completed">已完成</option>
                      <option value="draft">草稿</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              // Lesson Editor
              <>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    课程编辑
                  </h2>
                  <p className="text-gray-600 mt-1">
                    编辑课程信息
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程标题
                    </label>
                    <input
                      type="text"
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.title || ''}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter && chapter.lessons[selectedItem.lessonIndex]) {
                          chapter.lessons[selectedItem.lessonIndex].title = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程时长
                    </label>
                    <input
                      type="text"
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.duration || ''}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter && chapter.lessons[selectedItem.lessonIndex]) {
                          chapter.lessons[selectedItem.lessonIndex].duration = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程路径
                    </label>
                    <input
                      type="text"
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.url || ''}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter && chapter.lessons[selectedItem.lessonIndex]) {
                          chapter.lessons[selectedItem.lessonIndex].url = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      是否预览课程
                    </label>
                    <input
                      type="checkbox"
                      checked={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.isPreview || false}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter && chapter.lessons[selectedItem.lessonIndex]) {
                          chapter.lessons[selectedItem.lessonIndex].isPreview = e.target.checked
                          setCourseData(updatedData)
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">允许免费预览此课程</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程内容
                    </label>
                    <textarea
                      rows={8}
                      placeholder="在这里编辑课程内容..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={saveCourseData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                保存更改
              </button>
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                关闭编辑
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">选择章节或课程开始编辑</p>
              <p className="text-sm">点击左侧的章节或课程项目来编辑内容</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}