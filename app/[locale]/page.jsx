"use client"

import { useTranslations } from "next-intl";
import { useState, useEffect } from 'react'; 
import FrontNav from "@/components/FrontNav";

export default function Home() {
  const t = useTranslations("Index");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0F0", fontFamily: "Noto Sans CJK, sans-serif" }}>
      <FrontNav />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-24 h-24 rounded-full opacity-70" style={{ backgroundColor: "#F4C2C2" }}></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full opacity-50" style={{ backgroundColor: "#C8D4C0" }}></div>
          <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full opacity-40" style={{ backgroundColor: "#D4AF37" }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F4C2C2" }}></div>
                <span className="text-sm" style={{ color: "#8A8A8A" }}>传统日式手工艺</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ color: "#4A4A4A" }}>
                和果子制作
                <br />
                <span style={{ color: "#7BA05B" }}>美学课程</span>
              </h1>
              
              <p className="text-lg lg:text-xl leading-relaxed" style={{ color: "#6A6A6A" }}>
                传承千年的日式和果子制作技艺
                <br />
                从基础入门到创作精品，系统掌握练切工艺
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 rounded-full font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "#7BA05B" }}>
                  开始学习之旅
                </button>
                <button className="px-8 py-4 rounded-full font-semibold border-2 hover:opacity-80 transition-opacity" 
                        style={{ color: "#4A4A4A", borderColor: "#E6C2C2", backgroundColor: "transparent" }}>
                  咨询老师
                </button>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="lg:w-1/2">
              <div className="relative p-8 rounded-3xl" style={{ backgroundColor: "#F8F5F0" }}>
                <div className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: "#F4C2C2" }}>
                      🌸
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: "#4A4A4A" }}>精美作品展示</h3>
                    <p className="text-sm" style={{ color: "#8A8A8A" }}>樱花主题练切</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Showcase */}
      <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#4A4A4A" }}>
              老师作品展示
            </h2>
            <p className="text-lg" style={{ color: "#6A6A6A" }}>
              这些都是您能够学会制作的精美和果子
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "樱花练切", season: "春季限定", color: "#F4C2C2" },
              { name: "梅花和果子", season: "冬季精品", color: "#E6C2C2" },
              { name: "抹茶系列", season: "经典款式", color: "#C8D4C0" },
              { name: "牡丹造型", season: "进阶作品", color: "#F4C2C2" },
              { name: "山茶花", season: "立体技法", color: "#E6C2C2" },
              { name: "季节创作", season: "综合技艺", color: "#C8D4C0" }
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl p-6 transition-transform group-hover:scale-105" 
                     style={{ backgroundColor: item.color, opacity: 0.3 }}>
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-3">
                    <div className="text-3xl lg:text-4xl">🍡</div>
                    <h3 className="font-bold text-lg" style={{ color: "#4A4A4A" }}>{item.name}</h3>
                    <p className="text-sm" style={{ color: "#8A8A8A" }}>{item.season}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Outline */}
      <section className="py-16" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#4A4A4A" }}>
              课程大纲
            </h2>
            <p className="text-lg" style={{ color: "#6A6A6A" }}>
              三个阶段，系统掌握和果子制作技艺
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Stage 1 */}
            <div className="rounded-3xl p-8" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#7BA05B" }}>
                      1
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: "#4A4A4A" }}>基础入门阶段</h3>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "#6A6A6A" }}>建议4-6课时</p>
                  <p style={{ color: "#8A8A8A" }}>掌握和果子基础知识和简单制作技法</p>
                </div>
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>课程导入</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>练切类和果子的美学特点</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>原料知识</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>白豆沙、红豆沙等主要原料</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>基础工具</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>必需工具清单与使用方法</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>初学者作品</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>简单花型练切制作</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="rounded-3xl p-8" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#F4C2C2" }}>
                      2
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: "#4A4A4A" }}>进阶技法</h3>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "#6A6A6A" }}>建议6-8课时</p>
                  <p style={{ color: "#8A8A8A" }}>掌握稳定皮配方、精细造型技法与色彩过渡</p>
                </div>
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>稳定配方</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>练切皮稳定版与保湿公式</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>色彩技巧</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>调色原则与渐变技法</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>造型进阶</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>立体花型（牡丹、山茶、樱花）</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>质感表现</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>细节与质感表现技巧</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="rounded-3xl p-8" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#D4AF37" }}>
                      3
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: "#4A4A4A" }}>综合创作</h3>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "#6A6A6A" }}>建议8-10课时</p>
                  <p style={{ color: "#8A8A8A" }}>独立创作主题系列果子，商业或展示呈现</p>
                </div>
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>主题创作</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>季节节气主题设计思路</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>组合摆盘</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>成品组合与传统摆盘美学</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>作品展示</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>拍摄技巧与社交媒体展示</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F5F0F0" }}>
                      <h4 className="font-semibold mb-2" style={{ color: "#4A4A4A" }}>保存运输</h4>
                      <p className="text-sm" style={{ color: "#8A8A8A" }}>保湿技术与运输解决方案</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Introduction */}
      <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="aspect-square rounded-3xl flex items-center justify-center" style={{ backgroundColor: "#F8F5F0" }}>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl" style={{ backgroundColor: "#F4C2C2" }}>
                    👩‍🍳
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: "#4A4A4A" }}>和果子老师</h3>
                  <p style={{ color: "#8A8A8A" }}>传统技艺传承人</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "#4A4A4A" }}>
                专业老师指导
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "#6A6A6A" }}>
                拥有15年和果子制作经验的专业老师，曾在日本传统茶室学习，
                深谙传统技艺精髓，致力于将正宗的和果子制作方法传授给每一位学员。
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7BA05B" }}>
                    ✓
                  </div>
                  <span style={{ color: "#4A4A4A" }}>15年专业制作经验</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7BA05B" }}>
                    ✓
                  </div>
                  <span style={{ color: "#4A4A4A" }}>日本传统茶室学习背景</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7BA05B" }}>
                    ✓
                  </div>
                  <span style={{ color: "#4A4A4A" }}>已培养300+优秀学员</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#4A4A4A" }}>
              学员反馈
            </h2>
            <p className="text-lg" style={{ color: "#6A6A6A" }}>
              听听学员们的真实学习体验
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: "#F4C2C2" }}>
                  张
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: "#4A4A4A" }}>张女士</h4>
                  <p className="text-sm" style={{ color: "#8A8A8A" }}>茶艺爱好者</p>
                </div>
              </div>
              <p className="mb-4" style={{ color: "#6A6A6A" }}>
                "老师的教学非常细致，从基础的原料选择到最后的成品呈现，
                每个步骤都讲解得很清楚。现在我能做出很多精美的和果子了！"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <div className="p-6 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: "#C8D4C0" }}>
                  李
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: "#4A4A4A" }}>李先生</h4>
                  <p className="text-sm" style={{ color: "#8A8A8A" }}>烘焙店老板</p>
                </div>
              </div>
              <p className="mb-4" style={{ color: "#6A6A6A" }}>
                "课程内容很实用，学会后在我的店里推出了和果子系列，
                顾客反响很好。老师还会定期分享新的创意和技巧。"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <div className="p-6 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: "#D4AF37" }}>
                  王
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: "#4A4A4A" }}>王小姐</h4>
                  <p className="text-sm" style={{ color: "#8A8A8A" }}>设计师</p>
                </div>
              </div>
              <p className="mb-4" style={{ color: "#6A6A6A" }}>
                "完全零基础开始学习，现在已经能够独立创作主题系列了。
                和果子制作不仅是技艺，更是一种美学修养的提升。"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: "#7BA05B" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              开始您的和果子学习之旅
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              未购买课程的学员请先咨询老师，了解课程详情和学习安排
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white font-semibold rounded-full hover:opacity-90 transition-opacity" style={{ color: "#7BA05B" }}>
                进入课程学习
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-green-700 transition-colors">
                咨询老师
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: "#4A4A4A", color: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 和果子制作课程. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:opacity-70 transition-opacity">微信</a>
              <a href="#" className="hover:opacity-70 transition-opacity">小红书</a>
              <a href="#" className="hover:opacity-70 transition-opacity">联系我们</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}