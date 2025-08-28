import { NextResponse } from 'next/server';
import { 
  softDeleteCourse, 
  softDeleteChapter, 
  softDeleteLesson,
  clearCourseStructureCache
} from '../../../../../libs/courseFileSystem';

// 软删除课程、章节或课时
export async function PUT(request, { params }) {
  try {
    const { courseId } = params;
    const data = await request.json();
    const { type, chapterNumber, lessonNumber } = data;
    
    console.log('Soft delete request:', { courseId, type, chapterNumber, lessonNumber });
    
    let result;
    
    if (type === 'course') {
      // 软删除整个课程
      result = await softDeleteCourse(courseId);
      console.log('Course soft deleted:', result);
    } else if (type === 'chapter') {
      // 软删除章节
      if (!chapterNumber) {
        return NextResponse.json(
          { error: 'chapterNumber is required for chapter deletion' },
          { status: 400 }
        );
      }
      result = await softDeleteChapter(courseId, chapterNumber);
      console.log('Chapter soft deleted:', result);
    } else if (type === 'lesson') {
      // 软删除课时
      if (!chapterNumber || !lessonNumber) {
        return NextResponse.json(
          { error: 'chapterNumber and lessonNumber are required for lesson deletion' },
          { status: 400 }
        );
      }
      result = await softDeleteLesson(courseId, chapterNumber, lessonNumber);
      console.log('Lesson soft deleted:', result);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "course", "chapter", or "lesson"' },
        { status: 400 }
      );
    }
    
    // 清除缓存以确保数据刷新
    clearCourseStructureCache(courseId);
    
    return NextResponse.json({ 
      message: `${type} marked as deleted successfully`,
      data: result
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in soft delete:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark as deleted' },
      { status: 500 }
    );
  }
}