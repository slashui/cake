import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - 验证邀请码
export async function POST(request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: '邀请码不能为空' },
        { status: 400 }
      )
    }

    // 查找邀请码
    const inviteCode = await prisma.inviteCode.findUnique({
      where: {
        code: code.toUpperCase()
      },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                courseId: true,
                description: true
              }
            }
          }
        }
      }
    })

    if (!inviteCode) {
      return NextResponse.json(
        { error: '邀请码不存在' },
        { status: 404 }
      )
    }

    // 检查邀请码状态
    if (inviteCode.status === 'USED') {
      return NextResponse.json(
        { error: '此邀请码已经被使用过' },
        { status: 400 }
      )
    }

    if (inviteCode.status === 'EXPIRED') {
      return NextResponse.json(
        { error: '此邀请码已过期' },
        { status: 400 }
      )
    }

    // 检查是否过期
    if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
      // 更新状态为过期
      await prisma.inviteCode.update({
        where: { id: inviteCode.id },
        data: { status: 'EXPIRED' }
      })
      
      return NextResponse.json(
        { error: '此邀请码已过期' },
        { status: 400 }
      )
    }

    // 返回验证成功的信息和关联的课程
    return NextResponse.json({
      valid: true,
      inviteCode: {
        id: inviteCode.id,
        code: inviteCode.code,
        courses: inviteCode.courses.map(ic => ic.course)
      }
    })
  } catch (error) {
    console.error('验证邀请码失败:', error)
    return NextResponse.json(
      { error: '验证邀请码失败' },
      { status: 500 }
    )
  }
}

// PUT - 使用邀请码（标记为已使用）
export async function PUT(request) {
  try {
    const { code, userId } = await request.json()

    if (!code || !userId) {
      return NextResponse.json(
        { error: '邀请码和用户ID不能为空' },
        { status: 400 }
      )
    }

    // 查找邀请码
    const inviteCode = await prisma.inviteCode.findUnique({
      where: {
        code: code.toUpperCase()
      },
      include: {
        courses: {
          include: {
            course: true
          }
        }
      }
    })

    if (!inviteCode) {
      return NextResponse.json(
        { error: '邀请码不存在' },
        { status: 404 }
      )
    }

    // 检查邀请码状态
    if (inviteCode.status === 'USED') {
      return NextResponse.json(
        { error: '此邀请码已经被使用过' },
        { status: 400 }
      )
    }

    if (inviteCode.status === 'EXPIRED') {
      return NextResponse.json(
        { error: '此邀请码已过期' },
        { status: 400 }
      )
    }

    // 检查是否过期
    if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
      await prisma.inviteCode.update({
        where: { id: inviteCode.id },
        data: { status: 'EXPIRED' }
      })
      
      return NextResponse.json(
        { error: '此邀请码已过期' },
        { status: 400 }
      )
    }

    // 开始事务：标记邀请码为已使用并为用户添加课程权限
    const result = await prisma.$transaction(async (tx) => {
      // 标记邀请码为已使用
      const updatedInviteCode = await tx.inviteCode.update({
        where: { id: inviteCode.id },
        data: {
          status: 'USED',
          usedAt: new Date(),
          usedBy: userId
        }
      })

      // 为用户添加课程权限
      const userCourses = []
      for (const inviteCourse of inviteCode.courses) {
        try {
          const userCourse = await tx.userCourse.create({
            data: {
              userId: userId,
              courseId: inviteCourse.course.id
            }
          })
          userCourses.push(userCourse)
        } catch (error) {
          // 如果课程已经授权给用户，忽略错误
          if (error.code === 'P2002') {
            console.log(`用户 ${userId} 已经拥有课程 ${inviteCourse.course.id} 的权限`)
          } else {
            throw error
          }
        }
      }

      return {
        inviteCode: updatedInviteCode,
        userCourses,
        courses: inviteCode.courses.map(ic => ic.course)
      }
    })

    return NextResponse.json({
      message: '邀请码使用成功',
      courses: result.courses
    })
  } catch (error) {
    console.error('使用邀请码失败:', error)
    return NextResponse.json(
      { error: '使用邀请码失败' },
      { status: 500 }
    )
  }
}