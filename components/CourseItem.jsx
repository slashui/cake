'use client'
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

/**
 * 单个课程项组件
 * Args:
 *   lesson: 课程对象
 *   chapterStatus: 章节状态
 *   lessonIndex: 课程序号
 *   onLoginPrompt: 未登录且不可试看时触发的回调
 */
const CourseItem = ({ lesson, chapterStatus, lessonIndex, onLoginPrompt }) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const isAvailable = chapterStatus === 'completed' || chapterStatus === 'update';
  const canPreview = lesson.isPreview === true;

  // 点击逻辑
  const handleClick = (e) => {
    if (!isAvailable) {
      e.preventDefault();
      return;
    }
    if (!canPreview && !isLoggedIn) {
      e.preventDefault();
      if (onLoginPrompt) onLoginPrompt();
    }
    // 其他情况允许跳转
  };

  return (
    <Link
      href={isAvailable && (canPreview || isLoggedIn) ? lesson.url : '#'}
      onClick={handleClick}
      className={`block mb-3 rounded-lg overflow-hidden relative ${
        isAvailable ? 'transform transition-all duration-300 hover:scale-105' : 'opacity-50 cursor-not-allowed'
      }`}
      style={{
        backgroundImage: 'url(/course_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex text-white p-4 flex-col">
        <span className="text-md text-[#5d31ff] font-medium">第{lessonIndex + 1}课</span>
        <span className="text-2xl font-bold text-[#5d31ff] mb-1">{lesson.title}</span>
        <span className="text-xs text-[#5d31ff]">{lesson.duration}</span>
      </div>
      {/* 试看标签 */}
      {canPreview && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-md font-semibold tracking-wider z-10 select-none">
          试看
        </span>
      )}
      {/* 锁定提示 */}
      {!canPreview && !isLoggedIn && (
        <span className="absolute top-2 right-2 bg-gray-700/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-md font-semibold z-10 select-none">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3h-6V7Zm-2 5h12v8H6v-8Z"/></svg>
          登录后观看
        </span>
      )}
    </Link>
  );
};

export default CourseItem; 