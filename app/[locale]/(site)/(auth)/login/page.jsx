'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from 'next-auth/react'
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"



export default function Login() {
    const t = useTranslations("Loginpage");
    const session = useSession()
    const router = useRouter()

    const [lang, setLang] = useState('');
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    
    useEffect(() => {
        setLang(document.documentElement.lang);
        if (session?.status === 'authenticated') {
            router.push(`/${lang}/dashboard`)
        }
    }, [session?.status, lang])

    const loginUser = async (e) => {
        e.preventDefault()
        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
                callbackUrl: `/${lang}/dashboard`
            })

            if (result?.error) {
                console.error('Authentication error:', result.error)
                toast.error(result.error || 'Failed to login')
                return
            }

            if (result?.ok) {
                toast.success('Logged in successfully!')
                await router.push(`/${lang}/dashboard`)
                window.location.reload();
            } else {
                toast.error('Login failed. Please try again.')
            }
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            })
            toast.error('An unexpected error occurred')
        }
    }

    return (
        <>
            <main className="w-full h-screen flex flex-col bg-gradient-to-br from-[#d6cbff] to-[#b8a5ff] items-center justify-center sm:px-4">
                <div className="w-full space-y-6 sm:max-w-md">
                    <div className="text-center">
                        <div className="mt-5 space-y-2">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">{t("One")}</h3>
                           
                        </div>
                    </div>
                    <div className="mx-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8">
                        
                       
                        <form
                            onSubmit={loginUser}
                            className=""
                        >
                            <div>
                                <div>
                                    <label className="text-gray-700 font-medium block mb-2">
                                        {t("Five")}
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={e => setData({ ...data, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#845eee]/50 focus:border-[#845eee] outline-none transition-all"
                                        placeholder={t("Seven")}
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium block mt-4 mb-2">
                                        {t("Six")}
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
                                        placeholder={t("Eight")}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-[#845eee] py-3 px-6 text-white font-medium hover:bg-[#845eee]/90 rounded-lg transition-colors duration-200"
                                style={{ backgroundColor: '#845eee' }}
                            >
                                {t("Nine")}
                            </button>
                        </form>
                    </div>
                    
                </div>
            </main>

        </>
    )
}