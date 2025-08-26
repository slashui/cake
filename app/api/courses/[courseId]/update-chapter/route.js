import { NextResponse } from 'next/server';
import { updateChapterMetadata } from '../../../../../libs/courseFileSystem';

export async function PUT(request, { params }) {
  try {
    const { courseId } = params;
    const { chapterNumber, showName, description } = await request.json();
    
    if (!chapterNumber) {
      return NextResponse.json(
        { error: 'Missing chapterNumber parameter' },
        { status: 400 }
      );
    }
    
    // 准备更新数据
    const updates = {};
    if (showName !== undefined) {
      updates.showName = showName;
    }
    if (description !== undefined) {
      updates.description = description;
    }
    
    // 更新章节元数据
    const updatedMetadata = await updateChapterMetadata(courseId, chapterNumber, updates);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Chapter metadata updated successfully',
      data: updatedMetadata
    });
  } catch (error) {
    console.error('Error updating chapter metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update chapter metadata' },
      { status: 500 }
    );
  }
}