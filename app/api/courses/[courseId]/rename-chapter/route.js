import { NextResponse } from 'next/server';
import { renameCourseChapter } from '../../../../../libs/courseFileSystem';

export async function PUT(request, { params }) {
  try {
    const { courseId } = params;
    const { oldChapterNumber, newChapterNumber } = await request.json();
    
    if (!oldChapterNumber || !newChapterNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // 重命名章节目录和更新相关文件
    await renameCourseChapter(courseId, oldChapterNumber, newChapterNumber);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Chapter renamed successfully' 
    });
  } catch (error) {
    console.error('Error renaming chapter:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to rename chapter' },
      { status: 500 }
    );
  }
}