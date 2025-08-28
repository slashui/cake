import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb.jsx';
import { getCourseStructure, getCourseMetadata } from '../../../libs/courseFileSystem';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const includeFSStructure = searchParams.get('includeStructure') === 'true';
    
    if (courseId) {
      // 获取特定课程
      const course = await prisma.course.findUnique({
        where: { courseId: courseId },
        include: {
          userCourses: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
      
      // 如果需要文件系统结构，则获取
      let structure = null;
      let metadata = null;
      
      if (includeFSStructure) {
        try {
          structure = await getCourseStructure(course.courseId);
          metadata = await getCourseMetadata(course.courseId);
        } catch (fsError) {
          console.warn('Failed to load file system structure:', fsError.message);
        }
      }
      
      return NextResponse.json({
        ...course,
        fileSystemStructure: structure,
        metadata: metadata
      });
    } else {
      // 获取所有课程
      const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      // 为每个课程获取文件系统结构（可选）
      if (includeFSStructure) {
        const coursesWithStructure = await Promise.all(
          courses.map(async (course) => {
            try {
              const structure = await getCourseStructure(course.courseId);
              const metadata = await getCourseMetadata(course.courseId);
              
              // 过滤掉已软删除的课程
              if (metadata.deleted) {
                return null;
              }
              
              return {
                ...course,
                fileSystemStructure: structure,
                metadata: metadata
              };
            } catch (error) {
              console.warn(`Failed to load structure for course ${course.courseId}:`, error.message);
              return course;
            }
          })
        );
        
        // 过滤掉 null 值（已删除的课程）
        const filteredCourses = coursesWithStructure.filter(course => course !== null);
        return NextResponse.json(filteredCourses);
      }
      
      return NextResponse.json(courses);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { courseId, title, description, thumbnail, price, status = 'DRAFT', category } = data;
    
    // 验证courseId格式和唯一性
    if (!courseId || !/^[a-z0-9-]+$/.test(courseId)) {
      return NextResponse.json(
        { error: 'Invalid courseId. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }
    
    // 检查数据库中是否已存在
    const existingCourse = await prisma.course.findUnique({
      where: { courseId }
    });
    
    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course ID already exists' },
        { status: 409 }
      );
    }
    
    // 创建数据库记录
    const course = await prisma.course.create({
      data: {
        courseId,
        title,
        description,
        thumbnail,
        price: price ? parseFloat(price) : null,
        status,
        category,
      }
    });
    
    // 创建文件系统结构
    try {
      const { createCourseDirectory } = await import('../../../libs/courseFileSystem');
      await createCourseDirectory(courseId, {
        title,
        description,
        thumbnail,
        price,
        category,
        status
      });
    } catch (fsError) {
      // 如果文件系统创建失败，回滚数据库操作
      await prisma.course.delete({ where: { id: course.id } });
      throw new Error(`Failed to create course directory: ${fsError.message}`);
    }
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { courseId, ...updateData } = data;
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }
    
    // 更新数据库记录
    const course = await prisma.course.update({
      where: { courseId },
      data: updateData
    });
    
    // 同步更新文件系统metadata
    try {
      const { updateCourseMetadata } = await import('../../../libs/courseFileSystem');
      await updateCourseMetadata(courseId, updateData);
    } catch (fsError) {
      console.warn('Failed to update file system metadata:', fsError.message);
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // 删除数据库记录（会级联删除用户授权）
    await prisma.course.delete({
      where: { courseId }
    });
    
    // 删除文件系统目录
    try {
      const { deleteCourseDirectory } = await import('../../../libs/courseFileSystem');
      await deleteCourseDirectory(courseId);
    } catch (fsError) {
      console.warn('Failed to delete course directory:', fsError.message);
    }
    
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}