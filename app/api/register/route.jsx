import bcrypt from 'bcrypt'
import prisma from '../../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request){
    const body = await request.json();
    const { name, email, password, role, user_level, inviteCode } = body;

    if(!name || !email || !password) {
        return new NextResponse('Missing Fields', { status: 400 })
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(exist) {
        return NextResponse.json(
            { success: false, message: '该邮箱已被注册' },
            { status: 400 }
        )
    }

    // 验证邀请码（如果提供）
    let inviteCodeData = null;
    if (inviteCode) {
        inviteCodeData = await prisma.inviteCode.findUnique({
            where: { code: inviteCode },
            include: {
                inviteCodeCourses: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (!inviteCodeData) {
            return NextResponse.json(
                { success: false, message: '邀请码不存在' },
                { status: 400 }
            )
        }

        if (inviteCodeData.status === 'USED') {
            return NextResponse.json(
                { success: false, message: '邀请码已被使用' },
                { status: 400 }
            )
        }

        if (inviteCodeData.expiresAt && new Date() > inviteCodeData.expiresAt) {
            return NextResponse.json(
                { success: false, message: '邀请码已过期' },
                { status: 400 }
            )
        }
    }

    // 如果没有指定角色，检查用户等级或订单表
    let userRole = role || user_level || 'FREE';
    
    if (!role && !user_level) {
        const order = await prisma.orderlist.findFirst({
            where: { email },
            orderBy: { addtime: 'desc' },
        });
        
        if (order) {
            // 根据订单金额设置角色
            if (order.amount === 79) {
                userRole = 'PRIME';
            } else if (order.amount === 99) {
                userRole = 'VIP';
            }
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // 使用事务确保数据一致性
        const result = await prisma.$transaction(async (tx) => {
            // 创建用户
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    hashedPassword,
                    image: "/avtar/a.svg",
                    role: userRole
                }
            });

            // 如果有邀请码，关联课程
            if (inviteCodeData && inviteCodeData.inviteCodeCourses.length > 0) {
                const userCourseData = inviteCodeData.inviteCodeCourses.map(icc => ({
                    userId: user.id,
                    courseId: icc.courseId,
                    grantedAt: new Date()
                }));

                await tx.userCourse.createMany({
                    data: userCourseData
                });
            }

            return user;
        });

        return NextResponse.json({
            success: true,
            user: result,
            message: '注册成功'
        })
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: '注册失败，请稍后重试' },
            { status: 500 }
        )
    }
}