import { NextResponse } from 'next/server';
import { renameCourseLesson } from '../../../../../libs/courseFileSystem';

export async function PUT(request, { params }) {
  try {
    const { courseId } = params;
    const { chapterNumber, oldLessonNumber, newLessonNumber } = await request.json();
    
    if (!chapterNumber || !oldLessonNumber || !newLessonNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // 重命名课时文件
    await renameCourseLesson(courseId, chapterNumber, oldLessonNumber, newLessonNumber);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lesson renamed successfully' 
    });
  } catch (error) {
    console.error('Error renaming lesson:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to rename lesson' },
      { status: 500 }
    );
  }
}