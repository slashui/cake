"use client"

import { useTranslations } from "next-intl";
import { useState, useEffect } from 'react'; // Add this import
import axios from 'axios'; // Add this import
import FrontPriceCard from '@/components/FrontPriceCard';
import FAQ from '@/components/FrontFAQ';
import FrontFeatures from '@/components/FrontFeatures';
import FrontNav from "@/components/FrontNav";

export default function Home() {
  const t = useTranslations("Index");
  const [prices, setPrices] = useState([]);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
        // 获取视口高度
        const viewportHeight = window.innerHeight;
        // 当滚动超过一个视口高度时显示按钮
        setShowFloatingButton(window.scrollY > viewportHeight);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);

  }, []);

  useEffect(() => {
    fetchPrices();
  }, []);
 
  const fetchPrices = async () => {
    try {
      const response = await axios.get('/api/stripe/getproducts')
      

      console.log("Response structure:", {
        hasData: !!response.data,
        hasNestedData: !!(response.data && response.data.data),
        fullResponse: response
      });


      if (response && response.data) {
        setPrices(response.data);
        console.log("Successfully set prices:", response.data);
      } else {
        console.error("Missing data in response");
      }

    } catch (error) {
      console.error("Error fetching prices:", error)
    }
  }
  console.log("Current prices state:", prices);
  return (
    <div className="bg-[#dbd1ff]">
    <FrontNav />
    <header className="container mx-auto px-5 md:py-10 py-24">
    <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl mx-auto">
        <div className="w-full lg:w-[55%] my-8 text-center lg:text-left">
            <h1 className="text-4xl xl:text-6xl lg:text-5xl font-black text-dark mb-4 leading-[1.4]">
                <span className="text-black px-6 lg:px-8 py-2 mr-2 bg-[#6deca7] rounded-full inline-block">洛克 AI 编程实战课</span>
            </h1>
            <h2 className="text-3xl xl:text-5xl lg:text-4xl  lg:ml-12 font-black text-dark mb-4 leading-[1.4]">
                做 AI 时代的操盘手
            </h2>
            <h2 className="text-3xl xl:text-5xl lg:text-4xl  lg:ml-12 font-black text-dark mb-4 leading-[1.4]">
                探索互联网赚钱之道
            </h2>
            <a href="#price" className="inline-block mt-5 ml-5 bg-[#8B5CF6] hover:bg-[#f6c44c] hover:text-black text-white font-caveat text-xl lg:text-2xl font-semibold md:px-6 px-10 lg:px-10 py-2 rounded-full border-4 border-dark shadow-[6px_6px_0_#333] hover:shadow-[8px_8px_0_#333] hover:-translate-y-1 transform -rotate-2 transition-all duration-200">
                课程详情
            </a>
        </div>
    
        <div className="w-[45%] justify-center items-center hidden md:flex">
            <div className="relative w-full">
                <img 
                    src="/Laptop.png" 
                    alt="AI Programming Course" 
                    className="w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[75%] mb-8">
                        <video 
                            src="/hero-v.mp4" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className="w-full h-full object-contain rounded-2xl"
                        />
                    </div>
                </div>
                {/* 新增的右下角小视频 */}
                <div className="absolute bottom-0 mb-6 mr-4 right-0 w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <video 
                        src="/emjo.mp4"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>

    </div>
</header>
<section className="container mx-auto md:px-5 px-2 md:mt-0 mt-16">
    <div className="text-center mb-12">
        <span className="text-[#4361ee] text-sm font-medium px-4 py-2 bg-[#4361ee]/10 rounded-full">Our Top Features</span>
        <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-2">你是否面临这些困境？</h2>
        <p className="text-gray-600">如果你有任何一个"是"的回答，这门课程正是为你量身打造</p>
    </div>
    <div className="container mx-auto md:px-5 px-1">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">{/* 左侧四个小卡片 */}
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 rounded-2xl border-2 border-dark shadow-[4px_4px_0_#333] hover:-translate-y-1 hover:shadow-[6px_6px_0_#333] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-black text-2xl font-bold">应届生</h3>
                        <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🎓</span>
                    </div>
                    <p className="text-black/80 font-medium mb-3">简历空白·求职碰壁</p>
                    <ul className="text-black/80 space-y-2 text-sm">
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 缺乏实际项目经验</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 技术栈不够全面</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 面试准备不充分</li>
                    </ul>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-2xl border-2 border-dark shadow-[4px_4px_0_#333] hover:-translate-y-1 hover:shadow-[6px_6px_0_#333] transition-all duration-300"> 
                   <div className="flex items-center justify-between mb-4">
                        <h3 className="text-black text-xl font-bold">被裁程序员</h3>
                        <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">💼</span>
                    </div>
                    <p className="text-black/80 font-medium mb-3">技术过时·再就业难</p>
                    <ul className="text-black/80 space-y-2 text-sm">
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 技术栈落后于市场</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 缺乏AI相关经验</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 竞争力下降</li>
                    </ul>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-6 rounded-2xl border-2 border-dark shadow-[4px_4px_0_#333] hover:-translate-y-1 hover:shadow-[6px_6px_0_#333] transition-all duration-300"> 
        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-black text-xl font-bold">35岁转型者</h3>
                        <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🔄</span>
                    </div>
                    <p className="text-black/80 font-medium mb-3">职场危机·急需破局</p>
                    <ul className="text-black/80 space-y-2 text-sm">
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 行业天花板已现</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 需要新的职业方向</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 学习时间有限</li>
                    </ul>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl border-2 border-dark shadow-[4px_4px_0_#333] hover:-translate-y-1 hover:shadow-[6px_6px_0_#333] transition-all duration-300"> 
        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-black text-xl font-bold">零基础勇者</h3>
                        <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🌱</span>
                    </div>
                    <p className="text-black/80 font-medium mb-3">无从下手·怕被割韭菜</p>
                    <ul className="text-black/80 space-y-2 text-sm">
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 不知如何开始学习</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 担心学不会编程</li>
                        <li className="flex items-center"><span className="text-[#f6c44c] mr-2">✓</span> 害怕投入产出比低</li>
                    </ul>
        </div>
        
        {/* 右侧大卡片，占据两列宽度 */}
        <div className="col-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1 bg-white p-6 rounded-2xl border-2 border-dark h-[300px] lg:h-full relative overflow-hidden">    <img 
        src="/loser.jpeg" 
        alt="AI Programming"
        className="absolute inset-0 w-full h-full object-cover"
    />
</div>
    </div>
</div>
    




</section>


<section className="container mx-auto px-2 md:px-5 py-8 md:py-16 bg-[#9458fe] my-8 md:my-16 md:rounded-3xl rountded-0 md:rounded-[4rem] flex items-center justify-center relative overflow-hidden mx-2">
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
        <div className="w-full max-w-4xl mx-auto text-center text-white space-y-4 md:space-y-6 py-4 md:py-8 relative z-10 px-3 md:px-0">
            <p className="text-xl md:text-3xl text-white font-bold leading-relaxed">
                当传统职场的大门关闭，<span className="text-black px-4 md:px-8 py-1 mr-1 md:mr-2 bg-[#6deca7] rounded-full inline-block my-1">AI编程</span>的窗口正在开启。
            </p>
            <p className="text-xl md:text-3xl text-white font-bold leading-relaxed">
                你将获得<span className="text-black px-4 md:px-8 py-1 mx-1 md:mx-2 bg-[#f09bf9] rounded-full inline-block my-1">10倍</span>的开发效率，
            </p>
            <p className="text-xl md:text-3xl text-white font-bold leading-relaxed">
                从构建网站应用到打造智能体，从本地创业到全球出海。
            </p>
            <p className="text-xl md:text-3xl text-white font-bold leading-relaxed">
                在这个看似严密的世界中，总有<span className="text-black px-4 md:px-8 py-1 mx-1 md:mx-2 bg-[#f9db67] rounded-full inline-block my-1">缝隙</span>等待有准备的人去发现。
            </p>
        </div>
</section>
<section className="w-full relative py-16" id="price">
    <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start">
            {/* 价格部分 - 移动端在顶部 */}
            <div className="w-full lg:w-2/5 lg:sticky mb-8 lg:mb-0" style={{ top: '100px', height: 'fit-content' }}>
                <div className="space-y-4">
                    <div className="space-y-4 mb-4">
                        <h3 className="text-4xl font-bold text-dark text-center lg:text-left" style={{ fontFamily: 'NotoSans, sans-serif' }}>课程价格</h3>
                    </div>
                    <div className="w-full lg:w-[350px] mt-4 mx-auto lg:mx-0">
                        {prices && prices.length > 0 ? (
                            prices.map((priceData, index) => (
                                <FrontPriceCard 
                                    key={priceData.id}
                                    price={priceData}
                                    bgColor={index === 0 ? "bg-[#9458fe]" : "bg-[#9458fe]"}
                                    originalPrice={index === 0 ? "399" : "799"}
                                />
                            ))
                        ) : (
                            <div className="text-center py-4">
                                加载价格信息中...
                            </div>
                        )}
                    </div>   
                </div>
            </div>
            
            {/* 右侧内容 - 移动端在下方 */}
            <div className="md:w-3/5 w-full rounded-2xl py-8 md:px-8 px-4  bg-[#435df6] text-white overflow-y-auto custom-scrollbar">
    <div className="space-y-8">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f9db67]/90 flex items-center justify-center">
                    <span className="text-black font-bold">📚</span>
                </div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'NotoSans, sans-serif' }}>课程大纲</h3>
            </div>
            <p className="text-sm text-white/80 ml-14">9大模块，循序渐进，从入门到实战</p>
        </div>
        
        <div className="space-y-6">
            {/* 课程大纲内容 */}
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">1</div>
                    <h4 className="font-bold text-xl">课程简介</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">介绍AI编程的基础概念和学习方向。通过对比AI编程与传统编程的区别，帮助学习者理解AI编程的本质和应用场景。针对小白学习者的疑虑，课程会详细讲解入门路径，并提供丰富的课程资源。</p>
                
                <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">课程介绍和学习目标</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">什么是AI编程？</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">AI编程与传统编程的区别</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">AI不是代替你的工具</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">AI编程可以编什么？</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">我是小白可以编程吗？</span>
                    </li>
                    
                </ul>
                
            </div>
            
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">2</div>
                        <h4 className="font-bold text-xl">AI编程技术栈</h4>
                    </div>
                    <p className="text-sm text-white/60 pl-10 mb-4">全面介绍AI开发技术栈，包括编程工具（Cursor、Github Copilot等）、大语言模型（GPT、Claude等）、框架（LangChain、FastAPI）以及向量数据库（Pinecone、Chroma）等核心组件。通过140分钟的详细讲解，帮助学习者构建完整的AI开发知识体系。</p>
                    
                    <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                        <li className="flex items-start">
                            <span className="text-[#f9db67]/90 mr-2">•</span>
                            <span className="truncate">AI编程工具：Cursor/Copilot等</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#f9db67]/90 mr-2">•</span>
                            <span className="truncate">AI模型：LangChain/HuggingFace等</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#f9db67]/90 mr-2">•</span>
                            <span className="truncate">RAG工具：Pinecone/Chroma等</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#f9db67]/90 mr-2">•</span>
                            <span className="truncate">LLM：GPT/Claude/Llama等</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">3</div>
                    <h4 className="font-bold text-xl">Cursor编程工具精讲</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">深入讲解 Cursor 这一强大的 AI 编程工具，从基础安装到高级功能，全方位掌握提升编程效率的核心技巧。包括自动补全、代码对话、Git 集成等实用功能，以及 Agent 和 MCP 等前沿特性。</p>
                
                <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">Cursor 基础：介绍与安装配置</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">核心功能：补全、对话、Inline</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">文档与搜索：提示库与Web搜索</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">开发工具：Composer与Git集成</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">高级特性：Agent与MCP应用</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span className="truncate">实战演练：构建完整网站页面</span>
                    </li>
                </ul>
            </div>
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">4</div>
                    <h4 className="font-bold text-xl">小白必看</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">为编程零基础的学习者提供完整的入门指南，涵盖Python编程基础、NextJS前端开发、Git版本控制以及项目部署平台等核心知识。通过140分钟的系统讲解，帮助你打下扎实的编程基础。</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Python基础部分 */}
                    <div className="space-y-3">
                       
                        <ul className="text-sm space-y-2 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>Python简介与环境搭建 </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>变量与基本数据类型</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>函数与类的定义 </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>类方法与魔术方法 </span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* NextJS基础部分 */}
                    <div className="space-y-3">
                        
                        <ul className="text-sm space-y-2 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>NextJS技术栈与环境配置</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>项目结构与路由系统</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>布局与样式处理 </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>服务器与客户端组件</span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Git与GitHub基础部分 */}
                    <div className="space-y-3">
                        
                        <ul className="text-sm space-y-2 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>Git原理与工作流程</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>GitHub账号与仓库配置 </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>本地与远程仓库操作</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>代码推送与更新操作 </span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* 程序发布平台部分 */}
                    <div className="space-y-3">
                        
                        <ul className="text-sm space-y-2 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>Vercel平台使用指南</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>CloudFlare配置与应用 </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>dokploy平台部署流程</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>项目发布最佳实践</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">5</div>
                    <h4 className="font-bold text-xl">AI Agent + MCP (持续更新)</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">深入探索AI Agent和MCP技术，掌握AI开发的前沿技能。通过实战项目和案例分析，帮助你构建完整的AI应用开发能力。这部分的内容会随着新技术的发展持续更新。</p>
                
                <div className="grid grid-cols-2 gap-6">
                    {/* AI Agent部分 */}
                    <div className="space-y-3">
                        
                        <ul className="text-sm space-y-2 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>什么是 AI Agent</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>AI Agent的一些资源</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>AI Agent的创业想法 </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>各个厂商的AI Agent介绍</span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* MCP部分 */}
                    <div className="space-y-3">
                        
                        <ul className="text-sm space-y-2 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>什么是MCP</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>MCP的资源库</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>MCP的实际使用案例</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">6</div>
                    <h4 className="font-bold text-xl">AI编程实战基础篇</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">通过实战项目深入学习AI编程，从基础概念到实际应用，掌握AI开发的核心技能。课程涵盖Python编程、NextJS开发、API集成等多个方面，帮助学习者构建完整的技术栈。</p>
                
                <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>用Cursor编写Python程序</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>用Cursor开发NextJS页面 </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>连接大模型API</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>数据库集成 </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>代码优化与调试 </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>项目实战：SEO优化网站</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#f9db67]/90 mr-2">•</span>
                        <span>调试与改进</span>
                    </li>
                </ul>
            </div>
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">7</div>
                    <h4 className="font-bold text-xl">AI编程实战中级篇</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">深入学习AI编程工作流程和内容生成技术，掌握Cursor高级功能和AI工作流，通过实战项目提升实际开发能力。</p>
                
                <div className="space-y-6">
                    {/* 工作流基础部分 */}
                    <div>
                        
                        <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>利用Cursor组织工作流</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>与LangChain结合实现工作流</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>嵌入Coze平台</span>
                            </li>
                        </ul>
                    </div>

                    {/* AI内容生成部分 */}
                    <div>
                        
                        <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>用Cursor生成短视频</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>用Cursor撰写爆款文章</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>用Cursor生成小红书图片</span>
                            </li>
                        </ul>
                    </div>

                    {/* 高级功能与实战项目部分 */}
                    <div>
                       
                        <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>项目实战：需求分析</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>项目实战：开发过程</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>项目实战：运行与优化</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-white/5 md:p-6 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f9db67]/80 flex items-center justify-center text-black font-bold">8</div>
                    <h4 className="font-bold text-xl">AI编程实战高级篇</h4>
                </div>
                <p className="text-sm text-white/60 pl-10 mb-4">通过开发一个完整的AI SaaS平台，掌握从需求分析到上线运营的全流程。项目涵盖用户系统、支付集成、AI功能等核心模块，帮助你构建真实的商业项目经验。</p>
                
                <div className="space-y-6">
                    {/* 项目启动与规划 */}
                    <div>
                        
                        <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>SaaS平台需求分析 (15分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>技术栈选型与架构设计 (15分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>数据库设计与API规划 (15分钟)</span>
                            </li>
                        </ul>
                    </div>

                    {/* 核心功能开发 */}
                    <div>
                        
                        <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>用户系统与认证 (15分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>Stripe支付集成 (15分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>AI模型接口对接 (30分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>用户额度管理 (30分钟)</span>
                            </li>
                        </ul>
                    </div>

                    {/* 部署与运营 */}
                    <div>
                       
                        <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 ml-6">
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>生产环境部署 (15分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>性能监控与优化 (15分钟)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#f9db67]/90 mr-2">•</span>
                                <span>运营数据分析 (15分钟)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        </div>
    </div>
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 transition-transform duration-300 ${
        showFloatingButton ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex flex-col">
            <h4 className="text-lg font-bold text-gray-900">
              {prices && prices[0]?.name || 'AI编程实战课'}
            </h4>
            <span className="text-[#8B5CF6] font-bold">
              ¥{prices && prices[0]?.unit_amount ? prices[0].unit_amount/100 : '399'}起
            </span>
          </div>
          <a 
            href={prices && prices[0]?.default_price ? `/api/stripe/checkout?priceId=${prices[0].default_price}` : '#signup'} 
            className="bg-[#8B5CF6] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#7C3AED] transition-colors"
          >
            立即购买
          </a>
        </div>
      </div>
</section>
    
    <section className="container mx-auto px-5 py-16">
        <div className="flex md:flex-row flex-col gap-8 max-w-6xl mx-auto">
            <div className="md:w-[40%] w-full flex justify-center">
                <div className="relative md:w-[400px] w-full h-[500px]">
                   
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[320px] h-[350px] bg-[#8B5CF6] rounded-[999px]"></div>
                    
                  
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[320px] h-[450px] rounded-[999px] overflow-hidden">
                        <img 
                            src="person.png" 
                            alt="Person" 
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    
                    
                    <div className="absolute bottom-24 md:left-2/3 left-3/5 ">
                        <button className="bg-[#4ade80] text-left border-2 border-dark text-dark w-[200px] p-4 text-sm rounded-2xl font-medium hover:bg-opacity-90 transition-colors">
                            <p className="text-2xl text-left">
                                洛克船长
                            </p>
                            • 现AI创业公司产品总监<br />
                            • 原大厂产品总监<br />
                            • 微软认证讲师<br />
                            
                        </button>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#FCD34D] rounded-full"></div>
                    <div className="absolute top-4 left-4 w-4 h-4 bg-[#EC4899] rounded-full"></div>
                </div>
            </div>
            
            <div className="md:w-[60%] w-full flex flex-col justify-end py-8 rounded-2xl min-h-[500px]">
                <div className="space-y-2">
                    <div className="p-8 rounded-xl relative mb-10">
                        <span className="text-[#78e6aa] text-8xl absolute -top-10 left-0 "><img src="up.png" className="w-[60px]" /></span>
                        <div className="space-y-4">
                            <p className="text-4xl font-bold text-dark leading-relaxed" style={{ fontFamily: 'NotoSans, sans-serif' }}>
                                AI时代的编程智慧<br />
                                行动快于思考，试错胜过踌躇。
                            </p>
                           
                        </div>
                        <span className="text-[#78e6aa] text-8xl absolute  right-0 rotate-180"><img src="down.png" className="w-[60px] rotate-180" /></span>
                    </div>
                    <p className="text-sm text-gray-600 mt-6">洛克在视频平台上发布的受欢迎的视频</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div className="col-span-1 bg-white p-2 rounded-xl border-2 border-dark text-left hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0_#333]">
        <img src="cover1.jpg" alt="AI编程基础" className="w-full h-[100px] object-cover rounded-lg mb-1"/>
        <p className="text-dark text-sm">HuggingFace 10分钟快速入门</p>
    </div>
    
    <div className="col-span-1 bg-white p-2 rounded-xl border-2 border-dark text-left hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0_#333]">
        <img src="cover2.jpg" alt="项目实战" className="w-full h-[100px] object-cover rounded-lg mb-1"/>
        <p className="text-dark text-sm">一天搭建AI产品的SaaS基础平台</p>
    </div>
    
    <div className="hidden md:block bg-white p-2 rounded-xl border-2 border-dark text-left hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0_#333]">
        <img src="cover3.jpg" alt="就业指导" className="w-full h-[100px] object-cover rounded-lg mb-1"/>
        <p className="text-dark text-sm">AI Agent 智能体是什么？为什么最近如此火爆？</p>
    </div>
</div>
                    
                    
                </div>
            </div>
        </div>
    </section>
    <section className="container mx-auto md:px-5 px-0 py-16">
    <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-dark mb-4" style={{ fontFamily: 'NotoSans, sans-serif' }}>课程问答</h2>
                <p className="text-gray-600">这里有你对课程的所有疑问解答</p>
            </div>
        <FAQ />
    </div>
    </section>
       <section className="container mx-auto px-5 py-16 md:block hidden">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-dark mb-4" style={{ fontFamily: 'NotoSans, sans-serif' }}>学员真实评价</h2>
                <p className="text-gray-600">来自不同背景学员的学习心得</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
               
                <div className="bg-white p-8 rounded-2xl border-2 border-dark hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0_#333] transform -rotate-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#FFD233] flex items-center justify-center text-2xl font-bold">
                            张
                        </div>
                        <div>
                            <h4 className="font-bold text-dark">张同学</h4>
                            <p className="text-sm text-gray-600">前端开发者</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-6">课程内容非常实用，特别是AI工具的运用让我的开发效率提升了很多。现在我能够更快地完成项目，这在工作中是很大的优势。</p>
                    <div className="flex text-[#FFD233] text-xl">★★★★★</div>
                </div>

               
                <div className="bg-white p-8 rounded-2xl border-2 border-dark hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0_#333] transform rotate-1">                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#78e6aa] flex items-center justify-center text-2xl font-bold">
                            李
                        </div>
                        <div>
                            <h4 className="font-bold text-dark">李同学</h4>
                            <p className="text-sm text-gray-600">零基础转行</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-6">作为一个完全零基础的学习者，课程的循序渐进让我没有太大压力。AI助教的答疑解惑也很及时，让我少走了很多弯路。</p>
                    <div className="flex text-[#FFD233] text-xl">★★★★★</div>
                </div>

               
                <div className="bg-white p-8 rounded-2xl border-2 border-dark hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0_#333] transform -rotate-2">                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#f1a4fa] flex items-center justify-center text-2xl font-bold">
                            王
                        </div>
                        <div>
                            <h4 className="font-bold text-dark">王同学</h4>
                            <p className="text-sm text-gray-600">产品经理</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-6">课程不仅教会了编程技能，还教会了如何利用AI工具提升工作效率。现在我能够独立开发一些小工具，极大提升了工作效率。</p>
                    <div className="flex text-[#FFD233] text-xl">★★★★★</div>
                </div>
            </div>
        </div>
    </section>
    <hr className="mt-24" />
    <section className="container mx-auto px-5 py-10 md:mb-0 mb-24" id="faq">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        {/* 左侧版权信息 */}
        <div className="text-gray-600 text-center md:text-left">
            <p>© 2024 AI编程实战课. All rights reserved.</p>
        </div>
        
        {/* 右侧社交媒体图标 */}
        <div className="flex items-center gap-6">
            <a href="https://www.youtube.com/@likeGPT" className="hover:-translate-y-1 transition-transform duration-200">
                <img src="/youtube.svg" alt="抖音" className="w-6 h-6" />
            </a>
            <a href="#" className="hover:-translate-y-1 transition-transform duration-200">
                <img src="/bilibili.svg" alt="哔哩哔哩" className="w-6 h-6" />
            </a>
            <a href="#" className="hover:-translate-y-1 transition-transform duration-200">
                <img src="/tiktok.svg" alt="YouTube" className="w-6 h-6" />
            </a>
            <div className="relative group">
    <img src="/wechat.svg" alt="微信" className="w-6 h-6 cursor-pointer hover:-translate-y-1 transition-transform duration-200" />
    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[200px]">
            <img 
                src="/slashuiwc.png" 
                alt="微信二维码" 
                className="w-[180px] h-[180px] object-contain" 
            />
            <p className="text-xs text-center mt-2 text-gray-600">扫码添加微信</p>
        </div>
    </div>
</div>
        </div>
    </div>
</section>

</div>
  )
}