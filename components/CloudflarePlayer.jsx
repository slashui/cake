'use client'
import { useRef, useEffect } from 'react';

const CloudflarePlayer = ({ videoUrl, streamId, thumbnail, className = "" }) => {
  const playerRef = useRef(null);
  
  // 调试信息
  console.log('CloudflarePlayer props:', { videoUrl, streamId, thumbnail });
  
  if (!videoUrl && !streamId) {
    console.log('CloudflarePlayer: No video data available')
  }

  // 不再使用复杂的SDK加载，直接使用iframe

  // 从videoUrl中提取streamId的辅助函数
  const extractStreamIdFromUrl = (url) => {
    if (!url) return null;
    // 匹配 Cloudflare Stream URL 格式
    // https://customer-xxx.cloudflarestream.com/STREAM_ID/manifest/video.m3u8
    const match = url.match(/cloudflarestream\.com\/([^\/]+)\//);
    return match ? match[1] : null;
  };

  // 如果没有视频URL，显示占位符
  if (!videoUrl) {
    return (
      <div className={`w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📹</div>
          <p className="text-gray-500">暂无视频内容</p>
        </div>
      </div>
    );
  }

  const currentStreamId = streamId || extractStreamIdFromUrl(videoUrl);

  // 如果无法获取streamId，使用HTML5视频播放器作为后备
  if (!currentStreamId) {
    return (
      <div className={`w-full aspect-video ${className}`}>
        <video
          className="w-full h-full rounded-lg"
          controls
          preload="metadata"
          poster={thumbnail}
        >
          <source src={videoUrl} type="application/x-mpegURL" />
          <p>您的浏览器不支持视频播放。</p>
        </video>
      </div>
    );
  }

  return (
    <div className={`w-full aspect-video ${className}`}>
      <iframe
        src={`https://iframe.cloudflarestream.com/${currentStreamId}`}
        className="w-full h-full rounded-lg border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title="Cloudflare Stream Player"
      />
    </div>
  );
};

export default CloudflarePlayer;