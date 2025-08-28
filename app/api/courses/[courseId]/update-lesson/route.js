import { NextResponse } from 'next/server';
import { updateLessonMetadata } from '../../../../../libs/courseFileSystem';

export async function PUT(request, { params }) {
  try {
    const { courseId } = params;
    const { chapterNumber, lessonNumber, showName, duration, videoUrl, streamId, thumbnail } = await request.json();
    
    if (!chapterNumber || !lessonNumber) {
      return NextResponse.json(
        { error: 'Missing chapterNumber or lessonNumber parameter' },
        { status: 400 }
      );
    }
    
    // 准备更新数据
    const updates = {};
    if (showName !== undefined) {
      updates.showName = showName;
    }
    if (duration !== undefined) {
      updates.duration = duration;
    }
    if (videoUrl !== undefined) {
      updates.videoUrl = videoUrl;
    }
    if (streamId !== undefined) {
      updates.streamId = streamId;
    }
    if (thumbnail !== undefined) {
      updates.thumbnail = thumbnail;
    }
    
    // 更新课时元数据
    const updatedMetadata = await updateLessonMetadata(courseId, chapterNumber, lessonNumber, updates);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lesson metadata updated successfully',
      data: updatedMetadata
    });
  } catch (error) {
    console.error('Error updating lesson metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update lesson metadata' },
      { status: 500 }
    );
  }
}