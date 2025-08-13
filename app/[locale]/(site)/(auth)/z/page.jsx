'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"
import { useRouter } from 'next/navigation';


export default function Register() {
    const router = useRouter();
    const t = useTranslations("Register");
    const [lang, setLang] = useState('');
    const [data, setData] = useState({
        
        email: '',
        password: ''
    })
    useEffect(() => {
        setLang(document.documentElement.lang);
        // 获取 URL 参数中的 email
        const params = new URLSearchParams(window.location.search);
        const emailFromUrl = params.get('email');
        if (emailFromUrl) {
            setData(prev => ({
                ...prev,
                email: emailFromUrl
            }));
        }
    }, []);
    const registerUser = async (e) => {
        e.preventDefault()
        try {
            const registerData = {
                ...data,
                name: 'user_' + Math.random().toString(36).substr(2, 8) // 生成随机用户名
            };
            await axios.post('/api/register', registerData);
                toast.success('Registration successful. Redirecting to the login page in 3 seconds.');
                setTimeout(() => {
                    router.push(`/${lang}/login`);
                }, 3000);
            } catch (error) {
            console.error('Registration error:', error);

            if (error.response) {

                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {

                console.error('No response received. Request:', error.request);
            } else {

                console.error('Error setting up the request or unknown error:', error.message);
            }
            toast.error('Something went wrong!')

        }



    }

    return (
        <>

            <main className="w-full h-screen flex flex-col bg-gradient-to-br from-[#d6cbff] to-[#b8a5ff] items-center justify-center sm:px-4">
                <div className="w-full space-y-6 sm:max-w-md">
                    <div className="text-center">
                        <div className="mt-5 space-y-2">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">请注册成为课程会员</h3>
                            <p className="text-gray-600">{t("Two")}</p>
                        </div>
                    </div>
                    <div className="mx-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8">
                        <form
                            onSubmit={registerUser}
                            className="space-y-5"
                        >
                            <div className='space-y-4'>
                                

                                <div>
                                    <label className="text-gray-700 font-medium block mb-2">
                                        {t("Six")}
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={e => setData({ ...data, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#845eee]/50 focus:border-[#845eee] outline-none transition-all"
                                        placeholder={t("Seven")}
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 font-medium block mb-2">
                                        {t("Eight")}
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={data.password}
                                        onChange={e => setData({ ...data, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#845eee]/50 focus:border-[#845eee] outline-none transition-all"
                                        placeholder={t("Nine")}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#845eee] py-3 px-6 text-white font-medium  hover:bg-[#845eee]/90 rounded-lg transition-colors duration-200 "
                                style={{ backgroundColor: '#845eee' }}
                            >
                                {t("Ten")}
                            </button>
                        </form>
                    </div>
                    <div className="text-center  text-gray-600">
                        {t("Eleven")}? <a href={`/${lang}/login`} className="text-[#845eee] hover:text-[#845eee]/80 font-semibold transition-colors">{t("Twelve")}</a>
                    </div>
                </div>
            </main>

        </>
    )
}