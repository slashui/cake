import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb.jsx';
import { getCourseStructure, getCourseMetadata } from '../../../libs/courseFileSystem';

// 检查用户对课程的访问权限（简化版）
export async function POST(request) {
  try {
    const { userId, courseId } = await request.json();
    
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'userId and courseId are required' },
        { status: 400 }
      );
    }
    
    // 获取课程信息
    const course = await prisma.course.findUnique({
      where: { courseId: courseId }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // 检查用户是否有课程授权
    const userCourse = await prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id // 注意这里用的是数据库ID，不是courseId
        }
      }
    });
    
    const hasAccess = !!userCourse;
    
    // 如果有访问权限，获取文件系统结构
    let courseStructure = null;
    let courseMetadata = null;
    
    if (hasAccess) {
      try {
        courseStructure = await getCourseStructure(courseId);
        courseMetadata = await getCourseMetadata(courseId);
      } catch (fsError) {
        console.warn('Failed to load course structure:', fsError.message);
      }
    }
    
    return NextResponse.json({
      hasAccess,
      course: hasAccess ? course : null,
      courseStructure,
      courseMetadata,
      userCourse: userCourse || null,
      grantedAt: userCourse?.grantedAt || null
    });
    
  } catch (error) {
    console.error('Error checking course access:', error);
    return NextResponse.json(
      { error: 'Failed to check course access' },
      { status: 500 }
    );
  }
}