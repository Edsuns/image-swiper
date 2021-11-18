# Image Swiper

[![Version](https://img.shields.io/npm/v/image-swiper)](https://www.npmjs.com/package/image-swiper)

*[English](README.md) | 简体中文*

## 特性

[查看示例](https://edsuns.github.io/image-swiper)

- 连贯顺滑的进入退出过渡动画
- 图片热加载
- 多图片组
- 手势控制（上下左右滑、双击或双指缩合）

## 快速上手

安装依赖：

```bash
npm install image-swiper
```

用法（TypeScript 和 Vue 3）：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ImageViewer, Open } from 'image-swiper'

const imagesOne = ref([
  'https://swiperjs.com/demos/images/nature-1.jpg',
  'https://swiperjs.com/demos/images/nature-2.jpg',
  'https://swiperjs.com/demos/images/nature-3.jpg',
])
const imagesTwo = ref([
  'https://swiperjs.com/demos/images/nature-4.jpg',
  'https://swiperjs.com/demos/images/nature-5.jpg',
  'https://swiperjs.com/demos/images/nature-6.jpg',
])
// 1. 定义一个类型为 `Open` 的 `ref`.
const open = ref<Open>({ el: null })
// 2. 定义一个方法用来传递图片元素给 image-swiper.
const openImg = (ev: Event) => open.value.el = ev.target as HTMLElement
</script>

<template>
  <!-- 3. 添加 `image-viewer` 组件并绑定 `open` 变量. -->
  <image-viewer :open="open" />
  <h3>Group 1</h3>
  <!-- 4. 给所有的 `img` 标签的共同父标签添加属性 `gallery`. -->
  <div gallery>
    <!-- [注意] 要求使用 `img` 标签显示图片. -->
    <!-- [热加载支持] -->
    <!-- 可以使用 `src` 属性提供缩略图的 url 并使用 `data-src` 属性提供原图的 url. -->
    <!-- 以下是一个例子： -->
    <!-- <img src="path/to/thumbnail" data-src="path/to/full-size-image" /> -->

    <!-- 5. 给所有的 `img` 标签绑定 `click` 事件. -->
    <img v-for="url in imagesOne" :key="url" :src="url" width="200" @click="openImg" />
  </div>
  <h3>Group 2</h3>
  <!-- [可选] 想要有多个图片组, 添加另一个 `gallery` 即可. -->
  <div gallery>
    <img v-for="url in imagesTwo" :key="url" :src="url" width="200" @click="openImg" />
  </div>
</template>

<style>
div[gallery] {
  min-height: 200px;
}
</style>
```
