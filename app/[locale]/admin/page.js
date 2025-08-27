'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
  FileVideo,
  BookOpen,
  Settings,
  Users,
  Info
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null) // Can be course, chapter or lesson
  const [expandedChapters, setExpandedChapters] = useState(new Set())
  const [editingItem, setEditingItem] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [mdxContent, setMdxContent] = useState('')
  const [loadingMdx, setLoadingMdx] = useState(false)
  const [activeTab, setActiveTab] = useState('courses') // courses, users
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userSearch, setUserSearch] = useState('')
  const [searchedUser, setSearchedUser] = useState(null)
  const [searchingUser, setSearchingUser] = useState(false)
  const [grantingAccess, setGrantingAccess] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [editName, setEditName] = useState('')
  const [chapterEditData, setChapterEditData] = useState({ showName: '', description: '' })
  const [lessonEditData, setLessonEditData] = useState({ showName: '', duration: '', url: '', videoUrl: '', streamId: '', thumbnail: '' })
  
  // 邀请码相关状态
  const [inviteCodes, setInviteCodes] = useState([])
  const [selectedCoursesForInvite, setSelectedCoursesForInvite] = useState(new Set())
  const [inviteCodeExpiry, setInviteCodeExpiry] = useState('')
  const [generatingInviteCode, setGeneratingInviteCode] = useState(false)
  const [loadingInviteCodes, setLoadingInviteCodes] = useState(false)
  const [deletingInviteCode, setDeletingInviteCode] = useState(null)
  
  // 课程编辑器状态
  const [courseEditor, setCourseEditor] = useState({
    title: '',
    description: '',
    price: null,
    category: '',
    status: 'DRAFT',
    createdAt: '',
    updatedAt: '',
    structure: null
  })
  
  // Toast 通知状态
  const [toasts, setToasts] = useState([])

  // Toast 通知函数
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    // 3秒后自动移除
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // 智能更新课程数据，保持当前选择状态
  const updateCoursesData = async (preserveSelection = true) => {
    const currentCourseId = selectedCourse?.courseId
    const currentSelectedItem = selectedItem
    const currentExpandedChapters = expandedChapters
    
    try {
      const response = await fetch('/api/courses?includeStructure=true')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
        
        if (preserveSelection && currentCourseId) {
          // 恢复选中的课程
          const restoredCourse = data.find(c => c.courseId === currentCourseId)
          if (restoredCourse) {
            setSelectedCourse(restoredCourse)
            // 恢复展开的章节
            setExpandedChapters(currentExpandedChapters)
            // 保持选中的项目
            setSelectedItem(currentSelectedItem)
          }
        } else if (!preserveSelection && data.length > 0) {
          // 默认选择第一个课程（初始加载时使用）
          setSelectedCourse(data[0])
          if (data[0].fileSystemStructure?.chapters?.length > 0) {
            setExpandedChapters(new Set([data[0].fileSystemStructure.chapters[0].chapterNumber]))
          }
        }
      }
    } catch (error) {
      console.error('Failed to update courses data:', error)
      showToast('刷新数据失败', 'error')
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  // 当选择课程时加载MDX内容
  useEffect(() => {
    if (selectedItem && selectedItem.type === 'lesson') {
      load_mdx_content(selectedItem.chapterNumber, selectedItem.lessonNumber)
    } else {
      setMdxContent('')
    }
  }, [selectedItem])

  // 当选择章节时初始化编辑数据
  useEffect(() => {
    if (selectedItem && selectedItem.type === 'chapter') {
      const chapter = selectedCourse?.fileSystemStructure?.chapters?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
      setChapterEditData({
        showName: chapter?.title || chapter?.showName || selectedItem?.chapterNumber || '',
        description: chapter?.description || ''
      })
    }
  }, [selectedItem, selectedCourse])

  // 当选择课时时初始化编辑数据
  useEffect(() => {
    if (selectedItem && selectedItem.type === 'lesson') {
      const chapter = selectedCourse?.fileSystemStructure?.chapters?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
      const lesson = chapter?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber)
      setLessonEditData({
        showName: lesson?.title || lesson?.showName || selectedItem?.lessonNumber || '',
        duration: lesson?.duration || '',
        url: lesson?.url || '',
        videoUrl: lesson?.videoUrl || '',
        streamId: lesson?.streamId || '',
        thumbnail: lesson?.thumbnail || ''
      })
    }
  }, [selectedItem, selectedCourse])

  const loadCourses = async () => {
    try {
      setLoading(true)
      await updateCoursesData(false) // 初始加载，不保持选择
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载MDX内容
  const load_mdx_content = async (chapterNumber, lessonNumber) => {
    if (!selectedCourse?.courseId || !chapterNumber || !lessonNumber) return
    
    setLoadingMdx(true)
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/content?chapter=${chapterNumber}&lesson=${lessonNumber}`)
      if (response.ok) {
        const data = await response.json()
        setMdxContent(data.content || '欢迎学习本节课程！\n\n在这里编写课程内容...')
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
  const save_mdx_content = async (chapterNumber, lessonNumber, content) => {
    if (!selectedCourse?.courseId || !chapterNumber || !lessonNumber) return false
    
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapterNumber, lessonNumber, content })
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

  const saveEdit = () => {
    if (!editingItem || !editValue.trim()) return

    // This function can be removed as we're using direct state updates now
    setEditingItem(null)
    setEditValue('')
  }

  // 课程管理函数
  const createCourse = async (courseData) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      })
      
      if (response.ok) {
        const newCourse = await response.json()
        // 重新加载课程列表以获取完整结构
        await updateCoursesData(false) // 不保持选择，切换到新创建的课程
        // 选择新创建的课程
        const updatedCourses = await fetch('/api/courses?includeStructure=true').then(r => r.json())
        const createdCourse = updatedCourses.find(c => c.courseId === newCourse.courseId)
        if (createdCourse) {
          setSelectedCourse(createdCourse)
          if (createdCourse.fileSystemStructure?.chapters?.length > 0) {
            setExpandedChapters(new Set([createdCourse.fileSystemStructure.chapters[0].chapterNumber]))
          }
        }
        setShowCourseModal(false)
        showToast('课程创建成功！文件夹和基础结构已创建。', 'success')
      } else {
        const error = await response.json()
        showToast(`创建失败: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Failed to create course:', error)
      showToast('创建失败，请重试', 'error')
    }
  }

  const updateCourse = async (courseData) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      })
      
      if (response.ok) {
        const updatedCourse = await response.json()
        setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c))
        setSelectedCourse(updatedCourse)
        showToast('课程更新成功！', 'success')
      }
    } catch (error) {
      console.error('Failed to update course:', error)
      showToast('更新失败，请重试', 'error')
    }
  }

  const deleteCourse = async (courseId) => {
    if (confirm('确定要删除这个课程吗？这将删除文件夹中的所有内容和数据库记录。')) {
      try {
        const response = await fetch(`/api/courses?courseId=${courseId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setCourses(courses.filter(c => c.courseId !== courseId))
          if (selectedCourse?.courseId === courseId) {
            setSelectedCourse(courses.find(c => c.courseId !== courseId) || null)
          }
          showToast('课程删除成功！文件夹和数据库记录已删除。', 'success')
        }
      } catch (error) {
        console.error('Failed to delete course:', error)
        showToast('删除失败，请重试', 'error')
      }
    }
  }

  const addChapter = async () => {
    if (!selectedCourse) {
      showToast('请先选择一个课程', 'error')
      return
    }
    
    // 确保有文件系统结构数据
    if (!selectedCourse.fileSystemStructure) {
      showToast('课程结构未加载，请刷新页面重试', 'error')
      return
    }
    
    const existingChapters = selectedCourse.fileSystemStructure?.chapters || []
    const chapterNumber = `chapter${existingChapters.length + 1}`
    
    console.log('Adding chapter:', { 
      courseId: selectedCourse.courseId, 
      chapterNumber, 
      existingChapters: existingChapters.length,
      hasStructure: !!selectedCourse.fileSystemStructure
    })
    
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chapter',
          chapterNumber: chapterNumber
        })
      })
      
      const result = await response.json()
      console.log('Add chapter response:', result)
      
      if (response.ok) {
        showToast('章节创建成功！', 'success')
        // 保持当前状态，只更新数据
        await updateCoursesData(true)
        // 展开新创建的章节
        setExpandedChapters(prev => new Set([...prev, chapterNumber]))
      } else {
        console.error('Add chapter error:', result)
        showToast(`创建章节失败: ${result.error || '未知错误'}`, 'error')
      }
    } catch (error) {
      console.error('Failed to add chapter:', error)
      showToast('添加章节失败，请重试', 'error')
    }
  }

  const deleteChapter = async (chapterId) => {
    if (confirm('确定要删除这个章节吗？')) {
      try {
        const response = await fetch(`/api/chapters?chapterId=${chapterId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          const updatedCourse = {
            ...selectedCourse,
            chapters: selectedCourse.chapters.filter(c => c.id !== chapterId)
          }
          setSelectedCourse(updatedCourse)
          setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
        }
      } catch (error) {
        console.error('Failed to delete chapter:', error)
        showToast('删除失败，请重试', 'error')
      }
    }
  }

  const addLesson = async (chapterNumber) => {
    if (!selectedCourse) return
    
    const chapter = selectedCourse.fileSystemStructure?.chapters.find(c => c.chapterNumber === chapterNumber)
    const lessonNumber = `lesson${(chapter?.lessons?.length || 0) + 1}`
    
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lesson',
          chapterNumber: chapterNumber,
          lessonNumber: lessonNumber,
          lessonData: {
            title: '新课时',
            duration: '30分钟',
            content: '欢迎学习本节课程！\n\n在这里编写课程内容...'
          }
        })
      })
      
      if (response.ok) {
        // 保持当前状态，只更新数据
        await updateCoursesData(true)
        showToast('课时创建成功！', 'success')
      } else {
        const error = await response.json()
        showToast(`创建课时失败: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Failed to add lesson:', error)
      showToast('添加课时失败，请重试', 'error')
    }
  }

  // 用户搜索函数
  const searchUser = async (email) => {
    if (!email.trim()) return
    
    setSearchingUser(true)
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email.trim())}`)
      if (response.ok) {
        const user = await response.json()
        setSearchedUser(user)
      } else if (response.status === 404) {
        setSearchedUser(null)
        showToast('未找到该用户', 'error')
      } else {
        showToast('搜索用户时出错', 'error')
      }
    } catch (error) {
      console.error('Error searching user:', error)
      showToast('搜索用户时出错', 'error')
    } finally {
      setSearchingUser(false)
    }
  }

  // 授权用户访问课程
  const grantUserAccess = async (userId, courseIds) => {
    setGrantingAccess(true)
    try {
      const results = await Promise.all(
        courseIds.map(courseId =>
          fetch('/api/user-courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, courseId })
          })
        )
      )
      
      const allSuccessful = results.every(r => r.ok)
      if (allSuccessful) {
        showToast('用户授权成功！', 'success')
        // 重新搜索用户以更新状态
        if (searchedUser) {
          await searchUser(searchedUser.email)
        }
      } else {
        showToast('部分授权失败，请检查', 'error')
      }
    } catch (error) {
      console.error('Error granting access:', error)
      showToast('授权失败，请重试', 'error')
    } finally {
      setGrantingAccess(false)
    }
  }

  // 撤销用户课程访问权限
  const revokeUserAccess = async (userId, courseId) => {
    if (!confirm('确定要撤销该用户的课程访问权限吗？')) return
    
    try {
      const response = await fetch(`/api/user-courses?userId=${userId}&courseId=${courseId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        showToast('访问权限已撤销', 'success')
        // 重新搜索用户以更新状态
        if (searchedUser) {
          await searchUser(searchedUser.email)
        }
      } else {
        showToast('撤销权限失败', 'error')
      }
    } catch (error) {
      console.error('Error revoking access:', error)
      showToast('撤销权限失败', 'error')
    }
  }

  // 邀请码管理函数
  const generateInviteCode = async () => {
    if (selectedCoursesForInvite.size === 0) {
      showToast('请至少选择一个课程', 'error')
      return
    }

    setGeneratingInviteCode(true)
    try {
      const courseIds = Array.from(selectedCoursesForInvite)
      const requestBody = {
        courseIds,
        expiresAt: inviteCodeExpiry || null
      }

      const response = await fetch('/api/invite-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const result = await response.json()
        const newInviteCode = result.inviteCode
        showToast(`邀请码生成成功：${newInviteCode.code}`, 'success')
        setSelectedCoursesForInvite(new Set())
        setInviteCodeExpiry('')
        await loadInviteCodes()
      } else {
        const error = await response.json()
        showToast(`生成失败：${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error generating invite code:', error)
      showToast('生成失败，请重试', 'error')
    } finally {
      setGeneratingInviteCode(false)
    }
  }

  const loadInviteCodes = async () => {
    setLoadingInviteCodes(true)
    try {
      const response = await fetch('/api/invite-codes')
      if (response.ok) {
        const data = await response.json()
        setInviteCodes(data.inviteCodes || [])
      } else {
        console.error('Failed to load invite codes')
      }
    } catch (error) {
      console.error('Error loading invite codes:', error)
    } finally {
      setLoadingInviteCodes(false)
    }
  }

  const deleteInviteCode = async (inviteCodeId) => {
    if (!confirm('确定要删除这个邀请码吗？')) return

    setDeletingInviteCode(inviteCodeId)
    try {
      const response = await fetch('/api/invite-codes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: inviteCodeId })
      })

      if (response.ok) {
        showToast('邀请码删除成功', 'success')
        await loadInviteCodes()
      } else {
        const error = await response.json()
        showToast(`删除失败：${error.error || '未知错误'}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting invite code:', error)
      showToast('删除失败，请重试', 'error')
    } finally {
      setDeletingInviteCode(null)
    }
  }

  // 在切换到邀请码标签时加载邀请码列表
  useEffect(() => {
    if (activeTab === 'users') {
      loadInviteCodes()
    }
  }, [activeTab])

  // 开始编辑章节名称
  const startEditChapter = (chapterNumber) => {
    setEditingChapter(chapterNumber)
    setEditName(chapterNumber)
  }

  // 开始编辑课时名称
  const startEditLesson = (chapterNumber, lessonNumber) => {
    setEditingLesson(`${chapterNumber}-${lessonNumber}`)
    setEditName(lessonNumber)
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingChapter(null)
    setEditingLesson(null)
    setEditName('')
  }

  // 保存章节名称
  const saveChapterName = async (oldChapterNumber, newChapterName) => {
    if (!newChapterName.trim() || !selectedCourse) return
    
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/rename-chapter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldChapterNumber,
          newChapterNumber: newChapterName.trim()
        })
      })
      
      if (response.ok) {
        await updateCoursesData(true) // 保持当前选择，更新数据
        showToast('章节名称已更新', 'success')
        cancelEdit()
      } else {
        showToast('更新失败', 'error')
      }
    } catch (error) {
      console.error('Error updating chapter name:', error)
      showToast('更新失败', 'error')
    }
  }

  // 保存章节信息
  const saveChapterInfo = async () => {
    if (!selectedItem || !selectedCourse) return
    
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/update-chapter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterNumber: selectedItem.chapterNumber,
          showName: chapterEditData.showName.trim(),
          description: chapterEditData.description.trim()
        })
      })
      
      if (response.ok) {
        await updateCoursesData(true) // 保持当前选择，更新数据
        showToast('章节信息已更新', 'success')
      } else {
        showToast('更新失败', 'error')
      }
    } catch (error) {
      console.error('Error updating chapter info:', error)
      showToast('更新失败', 'error')
    }
  }

  // 保存课时信息
  const saveLessonInfo = async () => {
    if (!selectedItem || !selectedCourse) return
    
    try {
      // 首先保存课时信息
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/update-lesson`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterNumber: selectedItem.chapterNumber,
          lessonNumber: selectedItem.lessonNumber,
          showName: lessonEditData.showName.trim(),
          duration: lessonEditData.duration.trim(),
          videoUrl: lessonEditData.videoUrl.trim(),
          streamId: lessonEditData.streamId.trim(),
          thumbnail: lessonEditData.thumbnail.trim()
        })
      })
      
      if (response.ok) {
        // 然后保存MDX内容
        const mdxSuccess = await save_mdx_content(selectedItem.chapterNumber, selectedItem.lessonNumber, mdxContent)
        
        await updateCoursesData(true) // 保持当前选择，更新数据
        
        if (mdxSuccess) {
          showToast('课时信息和内容已保存', 'success')
        } else {
          showToast('课时信息已保存，但内容保存失败', 'error')
        }
      } else {
        showToast('保存失败', 'error')
      }
    } catch (error) {
      console.error('Error saving lesson info:', error)
      showToast('保存失败', 'error')
    }
  }

  // 保存课程编辑器信息
  const saveCourseEditor = async () => {
    if (!selectedCourse) return
    
    try {
      // 更新数据库中的课程信息
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourse.courseId,
          title: courseEditor.title.trim(),
          description: courseEditor.description.trim(),
          price: courseEditor.price,
          category: courseEditor.category.trim(),
          status: courseEditor.status
        })
      })
      
      if (response.ok) {
        await updateCoursesData(true) // 保持当前选择，更新数据
        showToast('课程信息已保存', 'success')
      } else {
        const errorData = await response.json()
        showToast(`保存失败: ${errorData.error || '未知错误'}`, 'error')
      }
    } catch (error) {
      console.error('Error saving course info:', error)
      showToast('保存失败', 'error')
    }
  }

  // 保存课时名称
  const saveLessonName = async (chapterNumber, oldLessonNumber, newLessonName) => {
    if (!newLessonName.trim() || !selectedCourse) return
    
    try {
      const response = await fetch(`/api/courses/${selectedCourse.courseId}/rename-lesson`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterNumber,
          oldLessonNumber,
          newLessonNumber: newLessonName.trim()
        })
      })
      
      if (response.ok) {
        await updateCoursesData(true) // 保持当前选择，更新数据
        showToast('课时名称已更新', 'success')
        cancelEdit()
      } else {
        showToast('更新失败', 'error')
      }
    } catch (error) {
      console.error('Error updating lesson name:', error)
      showToast('更新失败', 'error')
    }
  }


  const selectItem = (type, chapterNumber, lessonIndex = null, lessonNumber = null, courseId = null) => {
    if (type === 'course') {
      setSelectedItem({ type: 'course', courseId })
    } else if (type === 'chapter') {
      setSelectedItem({ type: 'chapter', chapterNumber })
    } else {
      setSelectedItem({ type: 'lesson', chapterNumber, lessonIndex, lessonNumber })
    }
  }

  // VideoUpload Component
  const VideoUpload = ({ lessonId, onUploadComplete, currentVideoUrl, currentStreamId, currentThumbnail }) => {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    const handleFileSelect = async (file) => {
      if (!file || !file.type.startsWith('video/')) {
        showToast('请选择有效的视频文件', 'error')
        return
      }

      setUploading(true)

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
        showToast('视频上传成功！', 'success')
      } catch (error) {
        console.error('Upload error:', error)
        showToast('视频上传失败，请重试', 'error')
      } finally {
        setUploading(false)
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
          <div className="bg-gray-50 p-4 rounded-lg hidden">
            <div className="flex items-center space-x-2 hidden mb-3">
              <Video className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">当前视频</span>
            </div>
            
            {/* Thumbnail */}
            {currentThumbnail && (
              <div className="mb-3 hidden">
                <img 
                  src={currentThumbnail} 
                  alt="Video thumbnail"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
            
            {/* Stream ID */}
            {currentStreamId && (
              <div className="mb-2 hidden">
                <span className="text-xs font-medium text-gray-500">Stream ID: </span>
                <span className="text-xs text-gray-700 font-mono bg-gray-200 px-1 rounded">{currentStreamId}</span>
              </div>
            )}
            
            {/* Video URL */}
            <div className="hidden">
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
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-sm text-gray-600">正在上传视频到 CloudFlare Stream...</div>
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

  // Course Authorization Panel Component
  const CourseAuthorizationPanel = ({ user, courses, onGrantAccess, grantingAccess, showToast }) => {
    const [selectedCourses, setSelectedCourses] = useState(new Set())

    // 获取用户已有的课程ID列表
    const userCourseIds = new Set(user.userCourses?.map(uc => uc.course.id) || [])

    const toggleCourseSelection = (courseId) => {
      const newSelected = new Set(selectedCourses)
      if (newSelected.has(courseId)) {
        newSelected.delete(courseId)
      } else {
        newSelected.add(courseId)
      }
      setSelectedCourses(newSelected)
    }

    const handleGrantAccess = () => {
      if (selectedCourses.size === 0) {
        showToast('请至少选择一个课程', 'error')
        return
      }
      onGrantAccess(user.id, Array.from(selectedCourses))
      setSelectedCourses(new Set()) // 清空选择
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          选择要授权给用户的课程，已拥有的课程会显示为灰色
        </div>

        <div className="space-y-3">
          {courses.map((course) => {
            const hasAccess = userCourseIds.has(course.id)
            const isSelected = selectedCourses.has(course.id)
            
            return (
              <div
                key={course.id}
                className={`p-3 rounded-lg border transition-colors ${
                  hasAccess
                    ? 'bg-gray-100 border-gray-300'
                    : isSelected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAccess || isSelected}
                    disabled={hasAccess}
                    onChange={() => !hasAccess && toggleCourseSelection(course.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{course.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{course.description}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-700' 
                          : course.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                      {hasAccess && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          已拥有
                        </span>
                      )}
                      {course.price && (
                        <span className="text-xs text-gray-500">
                          ¥{course.price}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            )
          })}
        </div>

        {selectedCourses.size > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">
                已选择 {selectedCourses.size} 个课程
              </span>
              <button
                onClick={() => setSelectedCourses(new Set())}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                清空选择
              </button>
            </div>
            <button
              onClick={handleGrantAccess}
              disabled={grantingAccess}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {grantingAccess ? '授权中...' : `授权 ${selectedCourses.size} 个课程`}
            </button>
          </div>
        )}
      </div>
    )
  }

  // Toast 组件
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg min-w-80 max-w-96 animate-in slide-in-from-right duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : toast.type === 'info'
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center">
            {toast.type === 'success' && (
              <Check className="w-5 h-5 mr-2 text-green-600" />
            )}
            {toast.type === 'error' && (
              <X className="w-5 h-5 mr-2 text-red-600" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 mr-2 text-yellow-600" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )

  // 课程创建模态框
  const CourseModal = () => {
    const [formData, setFormData] = useState({
      courseId: '',
      title: '',
      description: '',
      price: '',
      status: 'DRAFT',
      category: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      createCourse({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      })
    }

    if (!showCourseModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">创建新课程</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">课程ID</label>
              <input
                type="text"
                required
                value={formData.courseId}
                onChange={(e) => setFormData({...formData, courseId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                placeholder="react-basics, vue-advanced 等"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">仅限小写字母、数字和中划线，用作文件夹名和URL</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">课程标题</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">课程描述</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">价格 (可选)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类 (可选)</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                创建课程
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8">加载中...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Tab navigation */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === 'courses'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              课程管理
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              验证码
            </button>
          </div>
          
          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">管理员:</span>
              <span className="ml-1">{session?.user?.email || 'admin@example.com'}</span>
            </div>
            <button
              onClick={() => {
                // Add logout functionality here
                if (confirm('确定要退出登录吗？')) {
                  window.location.href = '/api/auth/signout'
                }
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Course Management */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Header with Action Button */}
          <div className="p-4 border-b border-gray-200">
          
          {activeTab === 'courses' && (
            <button
              onClick={() => setShowCourseModal(true)}
              className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              创建课程
            </button>
          )}
        </div>

        {/* Course List */}
        {activeTab === 'courses' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">所有课程 ({courses.length})</h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCourse?.id === course.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedCourse(course)
                    setSelectedItem({ type: 'course', courseId: course.courseId })
                    if (course.fileSystemStructure?.chapters?.length > 0) {
                      setExpandedChapters(new Set([course.fileSystemStructure.chapters[0].chapterNumber]))
                    }
                    // 初始化课程编辑器数据
                    setCourseEditor({
                      title: course.metadata?.title || course.title || '',
                      description: course.metadata?.description || course.description || '',
                      price: course.metadata?.price || course.price || null,
                      category: course.metadata?.category || course.category || '',
                      status: course.metadata?.status || course.status || 'DRAFT',
                      createdAt: course.metadata?.createdAt || course.createdAt || '',
                      updatedAt: course.metadata?.updatedAt || course.updatedAt || '',
                      structure: course.metadata?.structure || null
                    })
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-700' 
                            : course.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {course.fileSystemStructure?.chapters?.length || 0} 章节
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCourse(course.courseId)
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
          </div>
        )}

        {/* Invite Code Management */}
        {activeTab === 'users' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">邀请码管理</h2>
            
            {/* Generate Invite Code */}
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">生成新邀请码</h3>
                
                {/* Course Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择课程（可多选）
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {courses.map((course) => (
                      <label key={course.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCoursesForInvite.has(course.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedCoursesForInvite)
                            if (e.target.checked) {
                              newSelected.add(course.id)
                            } else {
                              newSelected.delete(course.id)
                            }
                            setSelectedCoursesForInvite(newSelected)
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    有效期（可选）
                  </label>
                  <input
                    type="datetime-local"
                    value={inviteCodeExpiry}
                    onChange={(e) => setInviteCodeExpiry(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={generateInviteCode}
                  disabled={generatingInviteCode || selectedCoursesForInvite.size === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {generatingInviteCode ? '生成中...' : `生成邀请码 (${selectedCoursesForInvite.size} 个课程)`}
                </button>
              </div>

              {/* Invite Codes List */}
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">邀请码列表</h3>
                  <button
                    onClick={loadInviteCodes}
                    disabled={loadingInviteCodes}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    {loadingInviteCodes ? '刷新中...' : '刷新'}
                  </button>
                </div>
                
                {loadingInviteCodes ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500">加载中...</div>
                  </div>
                ) : inviteCodes.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {inviteCodes.map((inviteCode) => (
                      <div 
                        key={inviteCode.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-lg font-semibold">{inviteCode.code}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              inviteCode.status === 'UNUSED' 
                                ? 'bg-green-100 text-green-700' 
                                : inviteCode.status === 'USED'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {inviteCode.status === 'UNUSED' ? '未使用' : 
                               inviteCode.status === 'USED' ? '已使用' : '已过期'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            课程: {inviteCode.courses.map(ic => ic.course.title).join(', ')}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            创建时间: {new Date(inviteCode.createdAt).toLocaleString('zh-CN')}
                            {inviteCode.expiresAt && (
                              <span className="ml-2">
                                过期时间: {new Date(inviteCode.expiresAt).toLocaleString('zh-CN')}
                              </span>
                            )}
                            {inviteCode.usedAt && (
                              <span className="ml-2">
                                使用时间: {new Date(inviteCode.usedAt).toLocaleString('zh-CN')}
                              </span>
                            )}
                          </div>
                          {inviteCode.user && (
                            <div className="text-xs text-gray-500 mt-1">
                              使用者: {inviteCode.user.email} {inviteCode.user.name && `(${inviteCode.user.name})`}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteInviteCode(inviteCode.id)}
                          disabled={deletingInviteCode === inviteCode.id}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title={deletingInviteCode === inviteCode.id ? "删除中..." : "删除邀请码"}
                        >
                          {deletingInviteCode === inviteCode.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500">暂无邀请码</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle Panel - Course Structure or Course Selection for User Authorization */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        {activeTab === 'users' && searchedUser ? (
          /* Course Authorization Panel */
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">课程授权</h2>
                  <p className="text-sm text-gray-600">为 {searchedUser.name || searchedUser.email} 选择课程</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <CourseAuthorizationPanel 
                user={searchedUser}
                courses={courses}
                onGrantAccess={grantUserAccess}
                grantingAccess={grantingAccess}
                showToast={showToast}
              />
            </div>
          </>
        ) : selectedCourse ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{selectedCourse.title}</h2>
                  <p className="text-sm text-gray-600">课程结构管理</p>
                </div>
                <button
                  onClick={addChapter}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加章节
                </button>
              </div>
            </div>

            <div className="p-4">
              {selectedCourse.fileSystemStructure?.chapters?.map((chapter) => (
                <div key={chapter.chapterNumber} className="mb-4">
                  {/* Chapter Header */}
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem?.type === 'chapter' && selectedItem?.chapterNumber === chapter.chapterNumber
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                    onClick={() => selectItem('chapter', chapter.chapterNumber)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleChapter(chapter.chapterNumber)
                          }}
                          className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                          {expandedChapters.has(chapter.chapterNumber) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                        
                        {editingChapter === chapter.chapterNumber ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  saveChapterName(chapter.chapterNumber, editName)
                                }
                                if (e.key === 'Escape') {
                                  cancelEdit()
                                }
                              }}
                              className="px-2 py-1 text-sm border rounded flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => saveChapterName(chapter.chapterNumber, editName)}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {chapter.title || chapter.showName || `章节 ${chapter.chapterNumber}`}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                               {chapter.chapterNumber}
                             </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {editingChapter !== chapter.chapterNumber && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditChapter(chapter.chapterNumber)
                            }}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                            title="编辑章节名称"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addLesson(chapter.chapterNumber)
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          title="添加课程"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: 实现删除章节功能
                            showToast('删除章节功能开发中...', 'info')
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
                  {expandedChapters.has(chapter.chapterNumber) && (
                    <div className="ml-6 mt-2 space-y-2">
                      {chapter.lessons?.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.lessonNumber}
                          className={`p-3 rounded border cursor-pointer transition-colors ${
                            selectedItem?.type === 'lesson' && selectedItem?.chapterNumber === chapter.chapterNumber && selectedItem?.lessonNumber === lesson.lessonNumber
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-white border-transparent hover:bg-gray-50'
                          }`}
                          onClick={() => selectItem('lesson', chapter.chapterNumber, lessonIndex, lesson.lessonNumber)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {editingLesson === `${chapter.chapterNumber}-${lesson.lessonNumber}` ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        saveLessonName(chapter.chapterNumber, lesson.lessonNumber, editName)
                                      }
                                      if (e.key === 'Escape') {
                                        cancelEdit()
                                      }
                                    }}
                                    className="px-2 py-1 text-sm border rounded flex-1"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => saveLessonName(chapter.chapterNumber, lesson.lessonNumber, editName)}
                                    className="p-1 text-green-600 hover:text-green-800"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1 text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="font-medium text-gray-900 text-sm">
                                    {lesson.title || lesson.showName || `课时 ${lesson.lessonNumber}`}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                     {lesson.lessonNumber}
                                    </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {editingLesson !== `${chapter.chapterNumber}-${lesson.lessonNumber}` && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEditLesson(chapter.chapterNumber, lesson.lessonNumber)
                                  }}
                                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="编辑课时名称"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  showToast('删除课时功能开发中...', 'info')
                                }}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                                title="删除课时"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>选择一个课程开始管理</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Content Editor */}
      <div className="w-1/3 bg-white overflow-y-auto">
        {selectedItem ? (
          <div className="p-6">
            {selectedItem.type === 'course' ? (
              // Course Editor
              <>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">课程编辑</h2>
                  <p className="text-gray-600 mt-1">编辑课程基本信息</p>
                </div>
                
                <div className="space-y-6">
                  {/* 课程ID - 只读 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课程ID</label>
                    <input
                      type="text"
                      value={selectedCourse?.courseId || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">课程ID不可修改</p>
                  </div>

                  {/* 课程标题 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课程标题</label>
                    <input
                      type="text"
                      value={courseEditor.title}
                      onChange={(e) => setCourseEditor({...courseEditor, title: e.target.value})}
                      placeholder="输入课程标题"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* 课程描述 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课程描述</label>
                    <textarea
                      rows={4}
                      value={courseEditor.description}
                      onChange={(e) => setCourseEditor({...courseEditor, description: e.target.value})}
                      placeholder="输入课程描述，向学员介绍这门课程的内容和特色"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 课程价格 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课程价格</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">¥</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={courseEditor.price || ''}
                        onChange={(e) => setCourseEditor({...courseEditor, price: e.target.value ? parseFloat(e.target.value) : null})}
                        placeholder="0.00"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">设置为0或留空表示免费课程</p>
                  </div>

                  {/* 课程分类 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课程分类</label>
                    <input
                      type="text"
                      value={courseEditor.category || ''}
                      onChange={(e) => setCourseEditor({...courseEditor, category: e.target.value})}
                      placeholder="例如：编程、设计、商业等"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* 课程状态 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">发布状态</label>
                    <div className="space-y-3">
                      {[
                        { value: 'DRAFT', label: '草稿', desc: '课程未公开，仅管理员可见', color: 'text-yellow-600' },
                        { value: 'PUBLISHED', label: '已发布', desc: '课程已公开，用户可以看到和购买', color: 'text-green-600' },
                        { value: 'ARCHIVED', label: '已归档', desc: '课程已下线，不再对外展示', color: 'text-gray-600' }
                      ].map((status) => (
                        <label key={status.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="courseStatus"
                            value={status.value}
                            checked={courseEditor.status === status.value}
                            onChange={(e) => setCourseEditor({...courseEditor, status: e.target.value})}
                            className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <span className={`text-sm font-medium ${status.color}`}>
                              {status.label}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{status.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 课程统计信息 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">课程统计</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">章节数量:</span>
                        <span className="ml-2 font-medium">{courseEditor.structure?.chapters?.length || selectedCourse?.fileSystemStructure?.chapters?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">课时总数:</span>
                        <span className="ml-2 font-medium">
                          {courseEditor.structure?.chapters?.reduce((total, chapter) => 
                            total + (chapter.lessons?.length || 0), 0) || 
                           selectedCourse?.fileSystemStructure?.chapters?.reduce((total, chapter) => 
                            total + (chapter.lessons?.length || 0), 0) || 0}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">创建时间:</span>
                        <span className="ml-2 font-medium">
                          {courseEditor.createdAt ? new Date(courseEditor.createdAt).toLocaleString('zh-CN') : 
                           selectedCourse?.createdAt ? new Date(selectedCourse.createdAt).toLocaleString('zh-CN') : '未知'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 保存按钮 */}
                  <button
                    onClick={saveCourseEditor}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    保存课程信息
                  </button>
                </div>
              </>
            ) : selectedItem.type === 'chapter' ? (
              // Chapter Editor
              <>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">章节编辑</h2>
                  <p className="text-gray-600 mt-1">编辑章节信息</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">章节编号</label>
                    <input
                      type="text"
                      value={selectedItem?.chapterNumber || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
                    <input
                      type="text"
                      value={chapterEditData.showName}
                      onChange={(e) => {
                        setChapterEditData(prev => ({
                          ...prev,
                          showName: e.target.value
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入章节显示名称"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">章节描述</label>
                    <textarea
                      rows={4}
                      value={chapterEditData.description}
                      onChange={(e) => {
                        setChapterEditData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入章节描述"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>章节路径:</strong> {selectedCourse?.courseId}/{selectedItem?.chapterNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>课时数量:</strong> {selectedCourse?.fileSystemStructure?.chapters?.find(c => c.chapterNumber === selectedItem?.chapterNumber)?.lessons?.length || 0}
                    </p>
                  </div>
                  
                  <button
                    onClick={saveChapterInfo}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    保存章节信息
                  </button>
                </div>
              </>
            ) : (
              // Lesson Editor - Enhanced with metadata editing
              <>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">课时编辑</h2>
                  <p className="text-gray-600 mt-1">编辑课时信息和内容</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课时编号</label>
                    <input
                      type="text"
                      value={selectedItem?.lessonNumber || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
                    <input
                      type="text"
                      value={lessonEditData.showName}
                      onChange={(e) => {
                        setLessonEditData(prev => ({
                          ...prev,
                          showName: e.target.value
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入课时显示名称"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课时时长</label>
                    <input
                      type="text"
                      value={lessonEditData.duration}
                      onChange={(e) => {
                        setLessonEditData(prev => ({
                          ...prev,
                          duration: e.target.value
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: 30分钟"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课时URL</label>
                    <input
                      type="text"
                      value={lessonEditData.url}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="课时访问URL（自动生成）"
                    />
                  </div>
                  

                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>课时路径:</strong> {selectedCourse?.courseId}/{selectedItem?.chapterNumber}/{selectedItem?.lessonNumber}
                    </p>
                  </div>
                  

                  {/* 当前视频信息显示 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📹 当前视频</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Stream ID: </span>
                        <span className="text-sm text-gray-800">
                          {(() => {
                            const lesson = selectedCourse?.fileSystemStructure?.chapters
                              ?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
                              ?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber);
                            return lesson?.streamId || '未设置';
                          })()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">URL: </span>
                        <div className="text-sm text-gray-800 break-all">
                          {(() => {
                            const lesson = selectedCourse?.fileSystemStructure?.chapters
                              ?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
                              ?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber);
                            return lesson?.videoUrl || '未设置';
                          })()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Thumbnail: </span>
                        <div className="text-sm text-gray-800 break-all">
                          {(() => {
                            const lesson = selectedCourse?.fileSystemStructure?.chapters
                              ?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
                              ?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber);
                            return lesson?.thumbnail || '未设置';
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 视频上传区域 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课时视频</label>
                    <VideoUpload 
                      lessonId={`${selectedItem?.chapterNumber}-${selectedItem?.lessonNumber}`}
                      currentVideoUrl={(() => {
                        const lesson = selectedCourse?.fileSystemStructure?.chapters
                          ?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
                          ?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber);
                        return lesson?.videoUrl || '';
                      })()}
                      currentStreamId={(() => {
                        const lesson = selectedCourse?.fileSystemStructure?.chapters
                          ?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
                          ?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber);
                        return lesson?.streamId || '';
                      })()}
                      currentThumbnail={(() => {
                        const lesson = selectedCourse?.fileSystemStructure?.chapters
                          ?.find(c => c.chapterNumber === selectedItem?.chapterNumber)
                          ?.lessons?.find(l => l.lessonNumber === selectedItem?.lessonNumber);
                        return lesson?.thumbnail || '';
                      })()}
                      onUploadComplete={async (result) => {
                        // 保持当前状态，只更新数据以刷新当前视频信息显示
                        await updateCoursesData(true)
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课时内容 (MDX)</label>
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
                          placeholder="在这里编辑课程内容...&#10;&#10;支持 Markdown 格式:&#10;**加粗文本**&#10;*斜体文本*&#10;## 标题&#10;- 列表项"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              load_mdx_content(selectedItem.chapterNumber, selectedItem.lessonNumber)
                            }}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            重新加载
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={saveLessonInfo}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    保存课时信息
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">选择项目开始编辑</p>
              <p className="text-sm">点击左侧的课程、章节或课时来编辑内容</p>
            </div>
          </div>
        )}
      </div>

        {/* Course Creation Modal */}
        <CourseModal />
        
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  )
}
