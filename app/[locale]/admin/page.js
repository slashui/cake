'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2,
  Edit,
  Check,
  X,
  Upload,
  Video,
  FileVideo
} from 'lucide-react'

export default function AdminDashboard() {
  const [courseData, setCourseData] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null) // Can be chapter or lesson
  const [expandedChapters, setExpandedChapters] = useState(new Set())
  const [editingItem, setEditingItem] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [mdxContent, setMdxContent] = useState('')
  const [loadingMdx, setLoadingMdx] = useState(false)

  useEffect(() => {
    loadCourseData()
  }, [])

  // 当选择课程时加载MDX内容
  useEffect(() => {
    if (selectedItem && selectedItem.type === 'lesson') {
      load_mdx_content(selectedItem.chapterId, selectedItem.lessonIndex)
    } else {
      setMdxContent('')
    }
  }, [selectedItem])

  const loadCourseData = async () => {
    try {
      console.log('Fetching course data from /course.json')
      const response = await fetch('/course.json?t=' + Date.now(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      console.log('Response text length:', text.length)
      console.log('First 100 chars:', text.substring(0, 100))
      
      const data = JSON.parse(text)
      console.log('Parsed data:', data)
      
      setCourseData(data)
      // Expand first chapter by default
      if (data.chapters && data.chapters.length > 0) {
        setExpandedChapters(new Set([data.chapters[0].id]))
      }
    } catch (error) {
      console.error('Failed to load course data:', error)
      console.error('Error details:', error.message)
      // Set some default data for testing
      setCourseData({
        title: "默认课程",
        chapters: [
          {
            id: "chapter1",
            title: "测试章节",
            description: "测试描述",
            status: "completed",
            lessons: [
              {
                title: "测试课程",
                duration: "30分钟",
                url: "/test"
              }
            ]
          }
        ]
      })
    }
  }

  // 加载MDX内容
  const load_mdx_content = async (chapterId, lessonIndex) => {
    if (!chapterId || lessonIndex === undefined) return
    
    setLoadingMdx(true)
    try {
      const slug = `${chapterId}/lesson${lessonIndex + 1}`
      const response = await fetch(`/api/lessons/content?slug=${slug}`)
      if (response.ok) {
        const data = await response.json()
        setMdxContent(data.content || '')
      } else {
        console.error('Failed to load MDX content')
        setMdxContent('欢迎学习本节课程！\n\n在这里编写课程内容...')
      }
    } catch (error) {
      console.error('Error loading MDX content:', error)
      setMdxContent('欢迎学习本节课程！\n\n在这里编写课程内容...')
    } finally {
      setLoadingMdx(false)
    }
  }

  // 保存MDX内容
  const save_mdx_content = async (chapterId, lessonIndex, content) => {
    if (!chapterId || lessonIndex === undefined) return false
    
    try {
      const slug = `${chapterId}/lesson${lessonIndex + 1}`
      const response = await fetch('/api/lessons/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, content })
      })
      
      if (response.ok) {
        return true
      } else {
        console.error('Failed to save MDX content')
        return false
      }
    } catch (error) {
      console.error('Error saving MDX content:', error)
      return false
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
        url: `/cn/course/${chapterId}/lesson${chapter.lessons.length + 1}`
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
    try {
      console.log('Saving course data:', courseData)
      const response = await fetch('/api/update-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      const result = await response.json()
      alert('课程数据已保存到 course.json！')
      console.log('Course data saved successfully:', result)
    } catch (error) {
      console.error('Save error:', error)
      alert('保存失败，请重试')
    }
  }

  // VideoUpload Component
  const VideoUpload = ({ lessonId, onUploadComplete, currentVideoUrl, currentStreamId, currentThumbnail }) => {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragOver, setDragOver] = useState(false)

    const handleFileSelect = async (file) => {
      if (!file || !file.type.startsWith('video/')) {
        alert('请选择有效的视频文件')
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        formData.append('video', file)
        formData.append('lessonId', lessonId)

        const response = await fetch('/api/upload-video', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('上传失败')
        }

        const result = await response.json()
        onUploadComplete(result)
        alert('视频上传成功！')
      } catch (error) {
        console.error('Upload error:', error)
        alert('视频上传失败，请重试')
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    }

    const handleDrop = (e) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      setDragOver(true)
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      setDragOver(false)
    }

    return (
      <div className="space-y-4">
        {/* Current Video Display */}
        {currentVideoUrl && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Video className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">当前视频</span>
            </div>
            
            {/* Thumbnail */}
            {currentThumbnail && (
              <div className="mb-3">
                <img 
                  src={currentThumbnail} 
                  alt="Video thumbnail"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
            
            {/* Stream ID */}
            {currentStreamId && (
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500">Stream ID: </span>
                <span className="text-xs text-gray-700 font-mono bg-gray-200 px-1 rounded">{currentStreamId}</span>
              </div>
            )}
            
            {/* Video URL */}
            <div>
              <span className="text-xs font-medium text-gray-500">URL: </span>
              <div className="text-xs text-gray-600 break-all mt-1">{currentVideoUrl}</div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="space-y-3">
              <FileVideo className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
              <div>
                <div className="text-sm text-gray-600 mb-2">上传中...</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  拖拽视频文件到此处，或
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
                    点击选择文件
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect(e.target.files[0])
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  支持 MP4, MOV, AVI 等格式，最大 500MB
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload to CloudFlare Stream Notice */}
        <div className="text-xs text-gray-500 text-center">
          视频将上传到 CloudFlare Stream 流媒体服务
        </div>
      </div>
    )
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      章节访问权限
                    </label>
                    <div className="space-y-3">
                      {['FREE', 'PRIME', 'VIP'].map((role) => (
                        <label key={role} className="flex items-center">
                          <input
                            type="radio"
                            name="chapterRole"
                            value={role}
                            checked={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.requiredRole?.toUpperCase() === role}
                            onChange={(e) => {
                              console.log('Changing chapter requiredRole to:', e.target.value)
                              const updatedData = { ...courseData }
                              const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                              if (chapter) {
                                chapter.requiredRole = e.target.value
                                console.log('Updated chapter:', chapter)
                                setCourseData(updatedData)
                              }
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className={`ml-3 text-sm font-medium ${
                            role === 'VIP' ? 'text-orange-600' :
                            role === 'PRIME' ? 'text-purple-600' :
                            'text-gray-600'
                          }`}>
                            {role === 'FREE' ? '免费用户' : role + '会员'}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      设置访问此章节所需的用户角色等级
                    </p>
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
                      内容权限
                    </label>
                    <select
                      value={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.requiredRole || 'free'}
                      onChange={(e) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter && chapter.lessons[selectedItem.lessonIndex]) {
                          chapter.lessons[selectedItem.lessonIndex].requiredRole = e.target.value
                          setCourseData(updatedData)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="free">免费 (Free)</option>
                      <option value="vip">VIP会员</option>
                      <option value="prime">Prime会员</option>
                    </select>
                    <span className="text-sm text-gray-600 mt-1 block">设置访问此课程所需的用户等级</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      视频上传
                    </label>
                    <VideoUpload 
                      lessonId={`${selectedItem.chapterId}-lesson${selectedItem.lessonIndex}`}
                      onUploadComplete={(result) => {
                        const updatedData = { ...courseData }
                        const chapter = updatedData.chapters.find(c => c.id === selectedItem.chapterId)
                        if (chapter && chapter.lessons[selectedItem.lessonIndex]) {
                          chapter.lessons[selectedItem.lessonIndex].videoUrl = result.videoUrl
                          chapter.lessons[selectedItem.lessonIndex].streamId = result.streamId
                          chapter.lessons[selectedItem.lessonIndex].thumbnail = result.thumbnail
                          setCourseData(updatedData)
                        }
                      }}
                      currentVideoUrl={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.videoUrl}
                      currentStreamId={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.streamId}
                      currentThumbnail={courseData.chapters.find(c => c.id === selectedItem.chapterId)?.lessons[selectedItem.lessonIndex]?.thumbnail}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程内容 (MDX)
                    </label>
                    {loadingMdx ? (
                      <div className="w-full h-64 border border-gray-300 rounded-md flex items-center justify-center">
                        <div className="text-gray-500">加载中...</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={12}
                          value={mdxContent}
                          onChange={(e) => setMdxContent(e.target.value)}
                          placeholder="在这里编辑课程内容...&#10;&#10;支持 Markdown 格式:&#10;**加粗文本**&#10;*斜体文本*&#10;## 标题&#10;- 列表项&#10;&#10;视频和标题信息已在上方管理，这里只需要编写课程的文字内容。"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              const success = await save_mdx_content(selectedItem.chapterId, selectedItem.lessonIndex, mdxContent)
                              if (success) {
                                alert('MDX内容保存成功！')
                              } else {
                                alert('保存失败，请重试')
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            保存MDX内容
                          </button>
                          <button
                            onClick={() => {
                              load_mdx_content(selectedItem.chapterId, selectedItem.lessonIndex)
                            }}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            重新加载
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      支持Markdown格式，标题和视频信息由系统管理。文件将保存到: course/{selectedItem?.chapterId}/lesson{(selectedItem?.lessonIndex || 0) + 1}/index.mdx
                    </div>
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