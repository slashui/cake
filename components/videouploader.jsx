'use client'

import { useState } from 'react'
import OSS from 'ali-oss'

export default function VideoUploader() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      // 获取上传凭证
      const res = await fetch('/api/updatevideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: file.name,
          fileName: file.name
        })
      })
      
      const { uploadAuth, uploadAddress, videoId } = await res.json()
      
      // 解析上传地址和凭证
      const uploadAddressInfo = JSON.parse(atob(uploadAddress))
      const uploadAuthInfo = JSON.parse(atob(uploadAuth))
      
      // 创建OSS客户端
      const client = new OSS({
        region: uploadAddressInfo.Region,
        accessKeyId: uploadAuthInfo.AccessKeyId,
        accessKeySecret: uploadAuthInfo.AccessKeySecret,
        stsToken: uploadAuthInfo.SecurityToken,
        bucket: uploadAddressInfo.Bucket,
        endpoint: uploadAddressInfo.Endpoint
      })

      // 上传文件
      const result = await client.multipartUpload(
        uploadAddressInfo.FileName,
        file,
        {
          progress: (p) => {
            setProgress(Math.floor(p * 100))
          }
        }
      )

      console.log('上传成功，视频ID:', videoId)
      return videoId

    } catch (error) {
      console.error('上传失败:', error)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => handleUpload(e.target.files[0])}
        className="hidden"
        id="video-upload"
      />
      <label
        htmlFor="video-upload"
        className="cursor-pointer block"
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span>上传中... {progress}%</span>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="block text-gray-600">点击或拖拽视频文件到这里上传</span>
          </div>
        )}
      </label>
    </div>
  )
}