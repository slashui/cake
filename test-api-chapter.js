const fs = require('fs');
const path = require('path');

// 模拟章节创建API的核心逻辑
async function testChapterCreationAPI() {
  console.log('开始测试章节创建API逻辑...');
  
  const courseId = '11'; // 使用现有的课程ID
  const chapterNumber = `chapter${Date.now()}`; // 生成唯一的章节号
  
  try {
    // 导入courseFileSystem模块
    const { createChapterDirectory, getCourseMetadata, updateCourseMetadata } = require('./libs/courseFileSystem.js');
    
    console.log('准备创建章节:', chapterNumber);
    console.log('课程ID:', courseId);
    
    // 检查课程是否存在
    try {
      const metadata = await getCourseMetadata(courseId);
      console.log('✅ 课程metadata读取成功');
      console.log('当前章节数量:', metadata.structure?.chapters?.length || 0);
    } catch (error) {
      console.error('❌ 读取课程metadata失败:', error.message);
      return;
    }
    
    // 尝试创建章节
    try {
      const chapterPath = await createChapterDirectory(courseId, chapterNumber);
      console.log('✅ 章节创建成功!');
      console.log('章节路径:', chapterPath);
      
      // 验证章节是否真的创建了
      if (fs.existsSync(chapterPath)) {
        console.log('✅ 章节目录确实存在');
        
        // 检查metadata是否更新
        try {
          const updatedMetadata = await getCourseMetadata(courseId);
          const newChapter = updatedMetadata.structure?.chapters?.find(
            chapter => chapter.chapterNumber === chapterNumber
          );
          
          if (newChapter) {
            console.log('✅ 章节已添加到metadata');
            console.log('新章节信息:', {
              chapterNumber: newChapter.chapterNumber,
              showName: newChapter.showName,
              order: newChapter.order
            });
          } else {
            console.log('❌ 章节未添加到metadata');
          }
        } catch (error) {
          console.error('❌ 验证metadata更新失败:', error.message);
        }
        
        // 清理测试章节
        try {
          fs.rmSync(chapterPath, { recursive: true, force: true });
          console.log('✅ 测试章节已清理');
          
          // 从metadata中移除测试章节
          const metadata = await getCourseMetadata(courseId);
          if (metadata.structure && metadata.structure.chapters) {
            metadata.structure.chapters = metadata.structure.chapters.filter(
              chapter => chapter.chapterNumber !== chapterNumber
            );
            await updateCourseMetadata(courseId, metadata);
            console.log('✅ metadata已清理');
          }
        } catch (error) {
          console.error('❌ 清理测试数据失败:', error.message);
        }
        
      } else {
        console.log('❌ 章节目录不存在，创建可能失败');
      }
      
    } catch (error) {
      console.error('❌ 创建章节失败:', error.message);
      console.error('错误堆栈:', error.stack);
      
      // 分析具体错误原因
      if (error.message.includes('ENOENT')) {
        console.log('💡 可能原因: 文件或目录不存在');
      } else if (error.message.includes('EACCES')) {
        console.log('💡 可能原因: 权限不足');
      } else if (error.message.includes('EEXIST')) {
        console.log('💡 可能原因: 文件或目录已存在');
      } else {
        console.log('💡 未知错误，需要进一步调试');
      }
    }
    
  } catch (error) {
    console.error('❌ 导入模块或初始化失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

// 运行测试
testChapterCreationAPI().then(() => {
  console.log('\n=== 测试完成 ===');
}).catch(error => {
  console.error('=== 测试失败 ===');
  console.error(error);
});