# 3D 地球展示

基于 Three.js 的 3D 地球可视化项目。

## 功能特性

- 点状地球展示
- 地球自转动画
- 地球展开效果（3D -> 2D）
- 地球故障展开效果
- 基础地球展示

## 开发指南

### 环境要求

- Node.js >= 16
- npm 或 tnpm

### 安装依赖

```bash
npm install
# 或
tnpm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173 查看效果

### 构建部署

```bash
npm run build
```

构建产物将生成在 `dist` 目录下

## 项目结构

```
src/
  ├── pages/          # 页面组件
  ├── scene/          # 场景相关
  ├── glsl/           # shader 文件
  └── utils/          # 工具函数
```

## 技术栈

- Three.js
- TypeScript
- Vite
- GLSL

## 部署说明

本项目可通过 Cloudflare Pages 进行部署，构建命令为 `npm run build`，构建输出目录为 `dist`。

## License

GPL-2.0
```
