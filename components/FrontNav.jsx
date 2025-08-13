"use client"

import React from 'react';

const FrontNav = () => {
  return (
    <nav className="pt-4">
        <div className="container mx-auto px-5">
            <div className="flex items-center justify-between h-16">
                
                <div className="flex items-center">
                    <a href="/" className="text-2xl font-bold text-primary"><img src="/logo.png" className="w-[200px]" /></a>
                </div>
                
               
                <div className="hidden md:flex items-center space-x-8 bg-secondary/20 px-10 py-4 rounded-full ">
                    <a href="#" className="text-dark hover:text-[#8B5CF6] transition-colors">首页</a>
                    <a href="#price" className="text-dark hover:text-[#8B5CF6] transition-colors">课程大纲</a>
                    <a href="#faq" className="text-dark hover:text-[#8B5CF6] transition-colors">常见问题</a>
                    {/* <a href="https://ocnswg29s4bf.feishu.cn/wiki/GV8ZwISk3iTOB9kHlDucIYwnnxd" target="_blank" className="text-dark hover:text-[#8B5CF6] transition-colors">行业资料</a> */}
                    {/* <a href="#" className="text-dark hover:text-[#8B5CF6] transition-colors">资源下载</a> */}
                </div>
                
               
                <div>
                    <a href="/cn/dashboard" className="bg-[#f6c44c] border-2 border-black shadow-[6px_6px_0_#333] hover:shadow-[8px_8px_0_#333] text-black px-8 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors">进入学习</a>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default FrontNav;