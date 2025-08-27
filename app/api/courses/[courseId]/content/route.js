import { NextResponse } from 'next/server';
import { 
  createChapterDirectory, 
  createLessonFile, 
  getLessonContent, 
  updateLessonContent,
  getCourseStructure 
} from '../../../../../libs/courseFileSystem';
import { serialize } from 'next-mdx-remote/serialize';
import matter from 'gray-matter';

// MDX内容缓存
const mdxCache = new Map();
const MDX_CACHE_TTL = 10 * 60 * 1000; // 10分钟缓存

// 获取课程内容结构或特定课时内容
export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    const chapterNumber = searchParams.get('chapter');
    const lessonNumber = searchParams.get('lesson');
    
    if (chapterNumber && lessonNumber) {
      // 检查MDX缓存
      const cacheKey = `${courseId}-${chapterNumber}-${lessonNumber}`;
      const cached = mdxCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < MDX_CACHE_TTL) {
        return NextResponse.json(cached.data);
      }
      
      // 获取特定课时的MDX内容
      const content = await getLessonContent(courseId, chapterNumber, lessonNumber);
      
      // 服务端预处理MDX
      try {
        const { data: frontmatter, content: mdxContent } = matter(content);
        const mdxSource = await serialize(mdxContent);
        
        const result = {
          content,
          frontmatter,
          mdxSource,
          processed: true
        };
        
        // 缓存处理结果
        mdxCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
        
        return NextResponse.json(result);
      } catch (mdxError) {
        console.error('MDX processing error:', mdxError);
        // 如果MDX处理失败，返回原始内容
        return NextResponse.json({ content, processed: false });
      }
    } else {
      // 获取课程文件结构
      const structure = await getCourseStructure(courseId);
      return NextResponse.json(structure);
    }
  } catch (error) {
    console.error('Error fetching course content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch course content' },
      { status: 500 }
    );
  }
}

// 创建章节或课时
export async function POST(request, { params }) {
  try {
    const { courseId } = params;
    const data = await request.json();
    const { type, chapterNumber, lessonNumber, lessonData } = data;
    
    if (type === 'chapter') {
      // 创建新章节
      console.log('Creating chapter:', { courseId, chapterNumber });
      const chapterPath = await createChapterDirectory(courseId, chapterNumber);
      console.log('Chapter created at:', chapterPath);
      
      // 清除缓存以确保数据刷新
      const { clearCourseStructureCache } = await import('../../../../../libs/courseFileSystem');
      clearCourseStructureCache(courseId);
      
      return NextResponse.json({ 
        message: 'Chapter created successfully',
        path: chapterPath,
        chapterNumber: chapterNumber
      }, { status: 201 });
    } else if (type === 'lesson') {
      // 创建新课时
      const lessonPath = await createLessonFile(courseId, chapterNumber, lessonNumber, lessonData);
      return NextResponse.json({ 
        message: 'Lesson created successfully',
        path: lessonPath 
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "chapter" or "lesson"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating course content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create course content' },
      { status: 500 }
    );
  }
}

// 更新课时内容
export async function PUT(request, { params }) {
  try {
    const { courseId } = params;
    const data = await request.json();
    const { chapterNumber, lessonNumber, content } = data;
    
    if (!chapterNumber || !lessonNumber || content === undefined) {
      return NextResponse.json(
        { error: 'chapterNumber, lessonNumber, and content are required' },
        { status: 400 }
      );
    }
    
    const lessonPath = await updateLessonContent(courseId, chapterNumber, lessonNumber, content);
    
    return NextResponse.json({ 
      message: 'Lesson content updated successfully',
      path: lessonPath 
    });
  } catch (error) {
    console.error('Error updating lesson content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update lesson content' },
      { status: 500 }
    );
  }
}