# Image Swiper

[![Version](https://img.shields.io/npm/v/image-swiper)](https://www.npmjs.com/package/image-swiper)

*English | [简体中文](README.zh-cn.md)*

## Features

[Demo](https://edsuns.github.io/image-swiper)

- Smooth enter and exit transitions
- Lazy-load images
- Multiple image groups
- Gesture control (Swipe left/right/up/down; Double click or pinch to zoom)

## Getting Started

Install from npm:

```bash
npm install image-swiper
```

Usage (TypeScript and Vue 3):

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
// 1. Define a `ref` with type `Open`.
const open = ref<Open>({ el: null })
// 2. Define a function which passing clicked image to image-swiper.
const openImg = (ev: Event) => open.value.el = ev.target as HTMLElement
</script>

<template>
  <!-- 3. Add `image-viewer` component and binding the `open` variable. -->
  <image-viewer :open="open" />
  <h3>Group 1</h3>
  <!-- 4. Add attribute `gallery` to the common parent tag of all the images. -->
  <div gallery>
    <!-- [Note] Required to use `img` tag to display images. -->
    <!-- [Supports lazy-load] -->
    <!-- You can use `src` attribute to provide thumbnail url and use `data-src` attribute to provide full-size image url. -->
    <!-- Here is an example: -->
    <!-- <img src="path/to/thumbnail" data-src="path/to/full-size-image" /> -->

    <!-- 5. Binding `click` event for images. -->
    <img v-for="url in imagesOne" :key="url" :src="url" width="200" @click="openImg" />
  </div>
  <h3>Group 2</h3>
  <!-- [Optional] Allowed to have multiple image groups, just by adding another `gallery`. -->
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
