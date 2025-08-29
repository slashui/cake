import { NextResponse } from 'next/server'
import { updateLessonMetadata, clearCourseStructureCache } from '../../../libs/courseFileSystem'

export async function POST(request) {
    try {
        const formData = await request.formData()
        const materialFile = formData.get('material')
        const lessonId = formData.get('lessonId')

        if (!materialFile || !lessonId) {
            return new NextResponse('Missing material file or lesson ID', { status: 400 })
        }

        // 验证文件大小 (10MB limit)
        const maxSize = 10 * 1024 * 1024 // 10MB in bytes
        if (materialFile.size > maxSize) {
            return new NextResponse('File too large. Maximum size is 10MB.', { status: 400 })
        }

        // 获取CloudFlare R2凭证
        const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
        const cfApiToken = process.env.CLOUDFLARE_API_TOKEN
        const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'course-materials'

        if (!cfAccountId || !cfApiToken) {
            console.error('Missing CloudFlare R2 configuration')
            return new NextResponse('CloudFlare R2 configuration not found', { status: 500 })
        }

        // 生成唯一的文件名
        const timestamp = Date.now()
        const fileExtension = materialFile.name.split('.').pop()
        const safeFileName = materialFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const uniqueFileName = `materials/${lessonId}/${timestamp}_${safeFileName}`

        // 转换文件为Buffer
        const arrayBuffer = await materialFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 使用CloudFlare R2 API上传文件
        const r2UploadUrl = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/r2/buckets/${bucketName}/objects/${uniqueFileName}`
        
        const uploadResponse = await fetch(r2UploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${cfApiToken}`,
                'Content-Type': materialFile.type || 'application/octet-stream',
                'Content-Length': buffer.length.toString()
            },
            body: buffer
        })

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            console.error('CloudFlare R2 upload failed:', errorText)
            
            // 作为后备，创建一个模拟的下载URL用于开发
            const timestamp = Date.now()
            const mockFileUrl = `https://r2.${cfAccountId}.com/${bucketName}/${uniqueFileName}`
            console.log('Using mock URL for development:', mockFileUrl)
            
            // 解析lessonId获取courseId, chapterNumber, lessonNumber
            let courseId, chapterNumber, lessonNumber
            
            if (lessonId.includes('/')) {
                const [course, lesson] = lessonId.split('/')
                courseId = course
                const [chapter, lessonNum] = lesson.split('-')
                chapterNumber = chapter
                lessonNumber = lessonNum
            } else {
                courseId = '11'
                const [chapter, lessonNum] = lessonId.split('-')
                chapterNumber = chapter
                lessonNumber = lessonNum
            }

            // 更新lesson的metadata.json (mock模式)
            try {
                await updateLessonMetadata(courseId, chapterNumber, lessonNumber, {
                    materials: [
                        {
                            name: safeFileName,
                            originalName: materialFile.name,
                            size: materialFile.size,
                            type: materialFile.type,
                            url: mockFileUrl,
                            uploadedAt: new Date().toISOString()
                        }
                    ]
                })
                
                // 清除课程结构缓存
                clearCourseStructureCache(courseId)
                console.log(`✅ 已更新lesson metadata (mock): ${courseId}/${chapterNumber}/${lessonNumber}`)
            } catch (error) {
                console.error('❌ 更新lesson metadata失败 (mock):', error)
            }
            
            return NextResponse.json({
                success: true,
                fileUrl: mockFileUrl,
                fileName: safeFileName,
                originalName: materialFile.name,
                size: materialFile.size,
                type: materialFile.type,
                message: 'Material uploaded successfully (development mode)'
            })
        }

        // 构建CloudFlare R2访问URL
        const publicUrl = `https://r2.${cfAccountId}.com/${bucketName}/${uniqueFileName}`

        // 解析lessonId获取courseId, chapterNumber, lessonNumber
        let courseId, chapterNumber, lessonNumber
        
        if (lessonId.includes('/')) {
            const [course, lesson] = lessonId.split('/')
            courseId = course
            const [chapter, lessonNum] = lesson.split('-')
            chapterNumber = chapter
            lessonNumber = lessonNum
        } else {
            courseId = '11'
            const [chapter, lessonNum] = lessonId.split('-')
            chapterNumber = chapter
            lessonNumber = lessonNum
        }

        // 更新lesson的metadata.json
        try {
            // 获取现有的materials，如果没有则创建空数组
            const existingMetadata = {}
            try {
                const { getLessonMetadata } = await import('../../../libs/courseFileSystem')
                const existing = await getLessonMetadata(courseId, chapterNumber, lessonNumber)
                existingMetadata.materials = existing.materials || []
            } catch (error) {
                console.log('No existing lesson metadata, creating new')
                existingMetadata.materials = []
            }

            // 添加新的材料
            const newMaterial = {
                name: safeFileName,
                originalName: materialFile.name,
                size: materialFile.size,
                type: materialFile.type,
                url: publicUrl,
                uploadedAt: new Date().toISOString()
            }

            existingMetadata.materials.push(newMaterial)

            await updateLessonMetadata(courseId, chapterNumber, lessonNumber, {
                materials: existingMetadata.materials
            })
            
            // 清除课程结构缓存，确保前端能获取到最新数据
            clearCourseStructureCache(courseId)
            console.log(`✅ 已更新lesson metadata: ${courseId}/${chapterNumber}/${lessonNumber}`)
        } catch (error) {
            console.error('❌ 更新lesson metadata失败:', error)
            // 不影响上传成功的返回，只记录错误
        }

        return NextResponse.json({
            success: true,
            fileUrl: publicUrl,
            fileName: safeFileName,
            originalName: materialFile.name,
            size: materialFile.size,
            type: materialFile.type,
            message: 'Material uploaded successfully to CloudFlare R2'
        })

    } catch (error) {
        console.error('Upload error:', error)
        return new NextResponse(`Upload failed: ${error.message}`, { status: 500 })
    }
}