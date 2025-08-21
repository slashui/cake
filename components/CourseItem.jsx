'use client'
import React, { useState } from 'react';
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isLoggedIn = !!session;
  const isAvailable = chapterStatus === 'completed' || chapterStatus === 'update';
  const canPreview = lesson.isPreview === true;

  const user_role = session?.user?.role || 'free';
  const required_role = lesson.requiredRole || 'free';

  const check_role_access = (user_role, required_role) => {
    const role_hierarchy = { 'free': 0, 'vip': 1, 'prime': 2 };
    return role_hierarchy[user_role] >= role_hierarchy[required_role];
  };

  const has_access = check_role_access(user_role, required_role);

  const get_upgrade_message = (required_role) => {
    if (required_role === 'vip') {
      return '此内容需要VIP权限，请升级到VIP会员';
    } else if (required_role === 'prime') {
      return '此内容需要Prime权限，请升级到Prime会员';
    }
    return '此内容需要更高权限';
  };

  // 点击逻辑
  const handleClick = (e) => {
    if (!isAvailable) {
      e.preventDefault();
      return;
    }
    if (!canPreview && !isLoggedIn) {
      e.preventDefault();
      if (onLoginPrompt) onLoginPrompt();
      return;
    }
    if (isLoggedIn && !has_access) {
      e.preventDefault();
      setShowUpgradeModal(true);
      return;
    }
  };

  return (
    <>
      <Link
        href={isAvailable && (canPreview || (isLoggedIn && has_access)) ? lesson.url : '#'}
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
        {/* 权限标签 */}
        {required_role !== 'free' && (
          <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded shadow-md font-semibold z-10 select-none ${
            required_role === 'vip' ? 'bg-orange-500' : 'bg-purple-600'
          }`}>
            {required_role.toUpperCase()}
          </span>
        )}
        {/* 登录提示 */}
        {!canPreview && !isLoggedIn && (
          <span className="absolute top-2 right-2 bg-gray-700/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-md font-semibold z-10 select-none">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3h-6V7Zm-2 5h12v8H6v-8Z"/></svg>
            登录后观看
          </span>
        )}
        {/* 权限不足提示 */}
        {isLoggedIn && !has_access && !canPreview && (
          <span className="absolute top-2 right-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-md font-semibold z-10 select-none">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3h-6V7Zm-2 5h12v8H6v-8Z"/></svg>
            需要升级
          </span>
        )}
      </Link>
      
      {/* 升级提示弹窗 */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">权限不足</h3>
            <p className="text-gray-600 mb-6">{get_upgrade_message(required_role)}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  window.location.href = '/price';
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                立即升级
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseItem; 