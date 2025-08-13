import bcrypt from 'bcrypt'
import prisma from '../../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request){
    const body = await request.json();
    const { name, email, password, role } = body;

    if(!name || !email || !password) {
        return new NextResponse('Missing Fields', { status: 400 })
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(exist) {
        throw new Error('Email already exists')
    }

    // 如果没有指定角色，检查订单表
    let userRole = role || 'FREE';
    
    if (!role) {
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

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
            image: "/avtar/a.svg",
            role: userRole  // 设置用户角色
        }
    });

    return NextResponse.json(user)
}