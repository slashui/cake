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
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#F5F0F0", fontFamily: "Noto Sans CJK, sans-serif" }}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: "#F4C2C2" }}>
            🌸
          </div>
          <p style={{ color: "#6A6A6A" }}>课程加载中...</p>
        </div>
      </div>
    );
  }

  // 判断章节是否可用
  const isChapterAvailable = (status) => {
    return status === 'completed' || status === 'update'
  }
  
  return (
    <main className="flex-1 p-4 lg:p-8" style={{ backgroundColor: "#F5F0F0", fontFamily: "Noto Sans CJK, sans-serif" }}>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-8 py-8 md:py-12 my-6 md:my-8 rounded-3xl flex items-center justify-center relative overflow-hidden" 
               style={{ backgroundColor: "#7BA05B" }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full opacity-30" style={{ backgroundColor: "#F4C2C2" }}></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full opacity-40" style={{ backgroundColor: "#C8D4C0" }}></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full opacity-50" style={{ backgroundColor: "#D4AF37" }}></div>
        </div>
        
        <div className="w-full mx-auto text-white py-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left column - Title section */}
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                欢迎来到和果子美学课程
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                在这里，您将学习传统日式和果子制作技艺，
                从基础入门到创作精品，开启优雅的手工艺之旅。
              </p>
            </div>

            {/* Right column - Updates */}
            <div className="md:w-1/3 w-full">
              <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <h2 className="text-xl font-bold mb-3">最新课程</h2>
                <h3 className="text-lg font-semibold mb-3">练切类和果子基础</h3>
                <p className="text-sm opacity-90 mb-4">
                  学习传统练切技法，掌握基础造型与配色技巧，制作精美的樱花主题和果子。
                </p>
                <a href="/cn/course/chapter2/lesson1" 
                   className="inline-block px-4 py-2 bg-white rounded-full font-medium hover:opacity-90 transition-opacity" 
                   style={{ color: "#7BA05B" }}>
                  开始学习
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Stages */}
      <div className="space-y-6 mt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#4A4A4A" }}>
            课程学习进度
          </h2>
          <p className="text-lg" style={{ color: "#6A6A6A" }}>
            三个阶段，循序渐进掌握和果子制作技艺
          </p>
        </div>

        {courseData.chapters.map((chapter, index) => (
          <div 
            key={chapter.id}
            className={`flex flex-col lg:flex-row gap-6 p-6 md:p-8 rounded-3xl transition-all duration-300 hover:shadow-lg
              ${isChapterAvailable(chapter.status) 
                ? 'bg-white shadow-md' 
                : 'opacity-60 cursor-not-allowed'
              }`}
            style={{ backgroundColor: isChapterAvailable(chapter.status) ? "#FFFFFF" : "#F8F5F0" }}
          >
            {/* 左侧章节信息 */}
            <div className="lg:w-1/3">
              <div className="p-6 rounded-2xl h-full flex flex-col justify-center" 
                   style={{ backgroundColor: index % 3 === 0 ? "#7BA05B" : index % 3 === 1 ? "#F4C2C2" : "#D4AF37" }}>
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl font-bold" 
                       style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#FFFFFF" }}>
                    {chapter.id.replace('chapter', '')}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    阶段 {chapter.id.replace('chapter', '')}
                  </h3>
                  <h4 className="text-lg font-semibold text-white/90">
                    {chapter.title}
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {chapter.description}
                  </p>
                  {!isChapterAvailable(chapter.status) && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" 
                          style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#FFFFFF" }}>
                      即将上线
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧课程列表 */}
            <div className="lg:w-2/3">
              <div className="p-4">
                <CourseList chapter={chapter} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-12 p-8 rounded-3xl text-center" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4" style={{ color: "#4A4A4A" }}>
            您的学习之旅
          </h3>
          <p className="text-lg mb-6" style={{ color: "#6A6A6A" }}>
            跟随传统技艺的脚步，在每一次练习中感受和果子制作的魅力
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-3" 
                   style={{ backgroundColor: "#7BA05B" }}>
                🌸
              </div>
              <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>基础技法</h4>
              <p className="text-sm" style={{ color: "#8A8A8A" }}>掌握基本制作方法</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-3" 
                   style={{ backgroundColor: "#F4C2C2" }}>
                🍡
              </div>
              <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>进阶造型</h4>
              <p className="text-sm" style={{ color: "#8A8A8A" }}>学习复杂造型技巧</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-3" 
                   style={{ backgroundColor: "#D4AF37" }}>
                ✨
              </div>
              <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>创意展现</h4>
              <p className="text-sm" style={{ color: "#8A8A8A" }}>独立创作精美作品</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}