'use client'
import Image from 'next/image'
import { useTranslations } from "next-intl";
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import CourseList from '@/components/CourseList';
import { useEffect, useState } from 'react'

export default function Home({ params }) {
  const t = useTranslations("Dashboard");
  const { data: session, status } = useSession();
  const lang = params.locale;
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    import('@/libs/course.json').then((mod) => {
      setCourseData(mod.default || mod);
    });
  }, []);

  if (!courseData) {
    return <div>Loading...</div>;
  }

  // 判断章节是否可用
  const isChapterAvailable = (status) => {
    return status === 'completed' || status === 'update'
  }
  
  return (
    <main className="flex-1 p-8">
      
<section className="container mx-auto px-8 md:px-8 py-4 md:py-4 bg-[#9458fe] my-8 md:my-4 md:rounded-3xl rountded-0 md:rounded-[4rem] flex items-center justify-center relative overflow-hidden mx-2">
        {/* 背景图片在移动端隐藏或调整位置 */}
        <div className="hidden md:block absolute left-20 top-50 -translate-y-1/2 opacity-30 animate-float-slow">
            <img src="/bg-test1.webp" alt="" className="w-[120px]" />
        </div>
        <div className="hidden md:block absolute left-10 bottom-0 -translate-y-1/2 opacity-30 animate-float-delay">
            <img src="/bg-test2.webp" alt="" className="w-[300px]" />
        </div>
        <div className="hidden md:block absolute right-20 bottom-20 opacity-30 animate-float-delay">
            <img src="/bg-test3.webp" alt="" className="w-[200px]" />
        </div>          
        <div className="w-full w-full/80 mx-auto text-center text-white py-2  relative z-10 px-3 md:px-0">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Title section (2/3 width) */}
            <div className="md:w-2/3 md:pl-8 lg:pl-16 xl:pl-24 2xl:pl-32 pl-8">
                <h1 className="text-3xl md:text-4xl font-bold text-left">
                    欢迎来到 AI 开发者训练营
                </h1>
                <p className="text-xl mt-4 text-left opacity-90">
                    在这里，你将学习如何利用 AI 工具进行高效开发，
                    从入门到精通，让我们一起开启 AI 编程之旅。
                </p>
            </div>

            {/* Right column - Updates list (1/3 width) */}
            <div className="md:w-1/3">
                <div className="bg-white/10 rounded-xl p-4">
                    <h2 className="text-xl font-bold mb-4 mt-0 pt-0 text-left">最新更新</h2>
                    <h3 className="text-lg font-bold mb-4 mt-0 pt-0 text-left">Claude Code 全命令解析</h3>
                    <p>深入浅出地讲解Claude Code的每一个命令，带你从零基础到熟练掌握！</p>
                    <a href="/cn/aideveloper/chapter2/lesson1" className="text-blue-500 bg-white rounded-xl p-4">查看详情</a>
                </div>
            </div>
        </div>
        </div>
</section>
        {/* 课程章节展示 */}
      <div className="space-y-8 mt-8">
        {courseData.chapters.map((chapter, index) => (
          <div 
            key={chapter.id}
            className={`flex flex-col md:flex-row gap-6 p-6 rounded-xl transition-all duration-300
              ${isChapterAvailable(chapter.status) 
                ? 'bg-white shadow-lg' 
                : 'bg-gray-100 opacity-50 cursor-not-allowed'
              }`}
          >
            {/* 左侧章节信息 */}
            <div className="md:w-1/4 bg-[#435df6] p-4 rounded-xl"> {/* 调整圆角和内边距 */}
                <div className="space-y-4"> {/* 增加间距 */}
                <h3 className={`text-xl font-bold ${
                  isChapterAvailable(chapter.status) ? 'text-white' : 'text-gray-300' /* 修改文字颜色 */
                }`}>
                  第{chapter.id.replace('chapter', '')}章
                </h3>
                <h4 className={`text-lg font-semibold ${
                  isChapterAvailable(chapter.status) ? 'text-white' : 'text-gray-300' /* 修改文字颜色 */
                }`}>
                  {chapter.title}
                </h4>
                <p className={`text-sm ${
                  isChapterAvailable(chapter.status) ? 'text-white/80' : 'text-gray-300' /* 修改文字颜色并添加透明度 */
                }`}>
                  {chapter.description}
                </p>
                {!isChapterAvailable(chapter.status) && (
                  <span className="text-xs text-gray-300">(即将上线)</span> /* 修改未上线文字颜色 */
                )}
              </div>
            </div>

            {/* 右侧课程列表 */}
            <div className="md:w-3/4">
              <CourseList chapter={chapter} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}