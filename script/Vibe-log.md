# 2025-08-28

## 一些小的修改：
- 优化播放器界面，移除用户查看视频时显示的非必要信息（包括播放器来源和StreamID，HTML5切换功能）。
- 在课程管理系统中，删除lesson模块内手动设置的所有视频相关信息，包括视频URL、StreamID以及缩略图数据。确保这些字段被完全清除且不可恢复。
- 在上传视频时，将当前的进度条显示方式改为圆形进度指示器（旋转圆圈）。保持流畅的动画效果。
- 看一下http://localhost:3000/cn/admin的头部的导航，三个标签。修改http://localhost:3000/cn/invite-codes的头部
- 这是http://localhost:3001/cn/invite-codes，左边的菜单时哪里来的？dashboard都没有左边的菜单，为什么invite-codes有呢？
- 这个邀请码列表中的每一个邀请码框都太高了，缩小一半。
