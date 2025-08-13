"use client"

import { useTranslations } from "next-intl";
import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import FrontNav from "@/components/FrontNav";

export default function Home() {
  const t = useTranslations("Index");
  const [prices, setPrices] = useState([]);
  
  useEffect(() => {
    fetchPrices();
  }, []);
 
  const fetchPrices = async () => {
    try {
      const response = await axios.get('/api/stripe/getproducts')
      if (response && response.data) {
        setPrices(response.data);
      }
    } catch (error) {
      console.error("Error fetching prices:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FrontNav />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white/80 text-sm font-medium">🚀 洛克AI编程社群</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              从迷茫到突破
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                重新定义你的未来
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              为失业程序员、迷茫学生、转型者打造的AI编程社群<br />
              系统课程 + 项目实战 + 个人指导 + 社群交流
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-200 shadow-xl">
                立即加入社群
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold rounded-full hover:bg-white/20 transition-colors duration-200">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              你是否正处在这样的困境中？
            </h2>
            <p className="text-xl text-gray-600">无论你属于哪种情况，我们都能为你找到突破的路径</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-6 right-6 text-4xl opacity-60">💼</div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">失业大龄程序员</h3>
                <p className="text-gray-700 font-medium">35+岁面临职业困境</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>技术栈老化，跟不上时代</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>面临年龄歧视，求职困难</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>需要重新找到职业方向</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-6 right-6 text-4xl opacity-60">🎓</div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">迷茫的计算机学生</h3>
                <p className="text-gray-700 font-medium">不知道该学什么，怎么学</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>技术栈选择困难症</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>缺乏实际项目经验</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>对就业前景感到迷茫</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="group relative p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-6 right-6 text-4xl opacity-60">🔄</div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">跨行转型者</h3>
                <p className="text-gray-700 font-medium">零基础想要实现自己的想法</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>完全没有编程基础</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>有想法但不知道如何实现</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>担心学习门槛太高</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              我们为你提供什么？
            </h2>
            <p className="text-xl text-gray-600">四大核心服务，全方位助力你的成长之路</p>
          </div>
          
          <div className="space-y-12">
            {/* Course */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
                    <span className="mr-2">📚</span>
                    系统性AI编程课程
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    从零基础到项目实战
                    <br />
                    <span className="text-purple-600">9大章节完整学习路径</span>
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    涵盖Cursor、Claude Code、Python、NextJS、AI Agent、MCP等前沿技术。
                    不是简单的视频课程，而是完整的技能转换体系。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Claude Code全命令解析</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Cursor深度使用</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">AI Agent实战开发</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">完整项目案例</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="relative p-8 bg-white rounded-3xl shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="font-medium">课程进度</span>
                        <span className="text-purple-600 font-bold">85%</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">✅ 课程简介</span>
                          <span className="text-green-500">已完成</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">✅ Claude Code解析</span>
                          <span className="text-green-500">已完成</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">⏳ Cursor实战</span>
                          <span className="text-blue-500">进行中</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">⭕ AI Agent开发</span>
                          <span className="text-gray-400">待开始</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Projects */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                    <span className="mr-2">🚀</span>
                    出海项目资源库
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    真实项目，真实经验
                    <br />
                    <span className="text-blue-600">从创意到上线全流程</span>
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    查看洛克所有出海项目的完整资料、源代码、项目进度。
                    不仅学技术，更要学会如何将技术变现。
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">oneday.build</span>
                        </div>
                        <span className="text-sm text-gray-500">进行中</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">SaaS基础平台，完整源码可获取</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">AI内容生成工具</span>
                        </div>
                        <span className="text-sm text-gray-500">规划中</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">利用AI技术的内容创作平台</p>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="relative p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl text-white">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-bold">项目收益数据</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white/10 rounded-xl">
                          <div className="text-2xl font-bold">$12K+</div>
                          <div className="text-sm opacity-80">月收入</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-xl">
                          <div className="text-2xl font-bold">5+</div>
                          <div className="text-sm opacity-80">活跃项目</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-xl">
                          <div className="text-2xl font-bold">50K+</div>
                          <div className="text-sm opacity-80">用户数</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-xl">
                          <div className="text-2xl font-bold">95%</div>
                          <div className="text-sm opacity-80">正常运行时间</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 1-on-1 Consulting */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                    <span className="mr-2">💬</span>
                    一对一咨询指导
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    个性化职业规划
                    <br />
                    <span className="text-green-600">1小时深度交流</span>
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    根据你的具体情况，制定专属的学习路径和职业规划。
                    不是标准化的建议，而是真正适合你的解决方案。
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">现状分析</h4>
                        <p className="text-gray-600">深入了解你的背景、技能和目标</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">路径规划</h4>
                        <p className="text-gray-600">制定清晰的学习和职业发展路线图</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">持续跟进</h4>
                        <p className="text-gray-600">定期检查进度，调整策略</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur opacity-20"></div>
                    <div className="relative p-8 bg-white rounded-3xl shadow-xl">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-2xl text-white">👨‍💼</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">洛克船长</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>• AI创业公司产品总监</p>
                          <p>• 原大厂产品总监</p>
                          <p>• 微软认证讲师</p>
                          <p>• 5年AI编程经验</p>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">已指导 100+ 学员成功转型</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Community */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-medium">
                    <span className="mr-2">👥</span>
                    活跃会员社群
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    与志同道合的人一起
                    <br />
                    <span className="text-orange-600">共同成长进步</span>
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    加入活跃的会员群，与同样在AI编程路上的伙伴交流学习。
                    最新技术动态、学习经验分享、项目合作机会。
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-orange-600">200+</div>
                      <div className="text-sm text-gray-600">活跃成员</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-orange-600">24/7</div>
                      <div className="text-sm text-gray-600">在线交流</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-orange-600">每日</div>
                      <div className="text-sm text-gray-600">技术分享</div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="relative p-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl text-white">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">社群动态</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/10 rounded-xl">
                          <p className="text-sm"><strong>张同学：</strong>今天用Cursor完成了第一个AI项目！</p>
                          <p className="text-xs opacity-80">2分钟前</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl">
                          <p className="text-sm"><strong>李同学：</strong>分享一个Claude Code的小技巧...</p>
                          <p className="text-xs opacity-80">15分钟前</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl">
                          <p className="text-sm"><strong>洛克：</strong>今天新上线了MCP教程，大家可以看看</p>
                          <p className="text-xs opacity-80">1小时前</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              选择适合你的方案
            </h2>
            <p className="text-xl text-gray-600">所有方案都包含完整的社群服务和持续更新</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative p-8 bg-gray-50 rounded-3xl border border-gray-200">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">基础版</h3>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-gray-900">¥200</div>
                  <p className="text-gray-600">一次付费，永久学习</p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>完整AI编程课程</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>项目资料查看</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>一对一咨询指导</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>会员交流群</span>
                  </li>
                </ul>
                <button className="w-full py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200">
                  选择基础版
                </button>
              </div>
            </div>
            
            <div className="relative p-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl text-white">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">最受欢迎</span>
              </div>
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">源码版</h3>
                <div className="space-y-2">
                  <div className="text-5xl font-bold">¥799</div>
                  <p className="text-white/80">包含完整商业源码</p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>基础版全部内容</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>oneday.build完整源码</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>SaaS平台架构设计</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>商业级代码实现</span>
                  </li>
                </ul>
                <button className="w-full py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200">
                  获取源码版
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              学员真实反馈
            </h2>
            <p className="text-xl text-gray-600">看看其他人是如何通过社群改变自己的</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-red-600">张</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">张同学</h4>
                  <p className="text-sm text-gray-600">38岁转型成功</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "被裁员后很迷茫，加入社群学习AI编程后重新找到了方向。
                洛克的一对一指导很有用，现在我已经开始接项目了。"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">李</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">李同学</h4>
                  <p className="text-sm text-gray-600">计算机专业大四</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "课程内容很实用，特别是AI工具的使用技巧。
                现在我在实习中的开发效率比同事高很多，已经拿到心仪的offer了。"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600">王</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">王女士</h4>
                  <p className="text-sm text-gray-600">设计师转型</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "完全零基础开始学习，现在能够独立开发小工具了。
                社群里的氛围很好，大家互相帮助，学习起来很有动力。"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              准备好开始你的
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
                AI编程之旅了吗？
              </span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              加入200+志同道合的学习者，在AI时代找到属于你的机会
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-200 shadow-xl">
                立即加入社群 - ¥200
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold rounded-full hover:bg-white/20 transition-colors duration-200">
                获取源码版 - ¥799
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
              <span>✓ 30天无条件退款</span>
              <span>✓ 永久学习权限</span>
              <span>✓ 持续内容更新</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 洛克AI编程社群. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-purple-400 transition-colors">微信</a>
              <a href="#" className="hover:text-purple-400 transition-colors">B站</a>
              <a href="#" className="hover:text-purple-400 transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}