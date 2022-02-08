<template>
  <swiper
    :style="style"
    :lazy="true"
    :zoom="true"
    :spaceBetween="30"
    :pagination="{ 'clickable': true }"
    @swiper="onSwiper"
    @click="onClick"
    @doubleClick="onDoubleClick"
    @touchStart="onTouchStart"
    @touchEnd="onTouchEnd"
    @touchMoveOpposite="onTouchMoveOpposite"
  >
    <swiper-slide v-for="(p, i) in photos" :key="i">
      <img :src="photos[i].src" class="animate-thumb" />
      <div class="swiper-zoom-container">
        <!-- Required swiper-lazy class and image source specified in data-src attribute -->
        <img :data-src="p.dataSrc || p.src" class="swiper-lazy" />
        <!-- Preloader image -->
        <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<script lang="ts">
import { defineComponent, PropType, watch, ref, onMounted, onUnmounted } from 'vue';
// Import Swiper Vue.js components
import { Swiper as SwiperVue, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import "swiper/css/lazy"
import "swiper/css/zoom"
import "swiper/css/pagination"

// import Swiper core and required modules
import SwiperCore, {
  Lazy, Zoom, Pagination, Swiper
} from 'swiper';

// install Swiper modules
SwiperCore.use([Lazy, Zoom, Pagination]);

export interface Open {
  el: HTMLElement | null
}

interface Photo {
  thumb: HTMLImageElement
  src: string
  dataSrc: string
}

/**
 * 根据key自动clearTimeout
 * key一般设为实例化时所在的方法的方法名，反复调用该方法时，前一次调用的timeout都会被自动clearTimeout
 */
class DelayQueue {
  static queue: Record<string, number[]> = {};
  private key: string;
  constructor(key: string) {
    this.key = key;
    const queue = DelayQueue.queue[key]
    if (queue) {
      for (let id of queue) {
        clearTimeout(id);
      }
    }
    DelayQueue.queue[key] = [];
  }
  timeout(handler: TimerHandler, timeout?: number, ...args: any[]) {
    DelayQueue.queue[this.key].push(setTimeout(handler, timeout, ...args));
  }
}

export default defineComponent({
  name: 'image-viewer',
  components: {
    Swiper: SwiperVue,
    SwiperSlide,
  },
  props: {
    open: {
      type: Object as PropType<Open>,
      required: true,
    },
    historyUrl: {
      type: String,
      default: '?img'
    },
  },
  emits: {
    swipeStarted: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
    swipeCancelled: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
    swipeExit: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
    swipeExited: () => true,
  },
  setup(props, { emit }) {
    const style = {
      '--swiper-pagination-color': '#fff',
      '--swiper-pagination-bullet-inactive-color': '#8E8E93',
      '--swiper-pagination-bullet-inactive-opacity': '.5',
    };
    const photos = ref<Photo[]>([]);
    let thumbs: HTMLCollectionOf<HTMLImageElement>;

    // 不监听`activeIndexChange`事件，因为显示时会调用slideTo从而触发一次该事件，这会导致thumb元素闪烁
    let lastIndex = 0;
    const updateThumbsVisibility = (currentIndex: number) => {
      if (currentIndex === lastIndex) { return; }
      thumbs[lastIndex].style.visibility = '';
      thumbs[currentIndex].style.visibility = 'hidden';
      lastIndex = currentIndex;
    }

    const getImg = (el: HTMLElement) => {
      if (el.tagName === 'IMG') { return el; }
      const imgs = el.getElementsByTagName('img');
      return imgs[imgs.length - 1];
    }
    const getActiveImg = (swiper: Swiper) => swiper.wrapperEl.querySelectorAll('img.swiper-lazy')[swiper.activeIndex] as HTMLImageElement;
    const loadPhotos = (openEl: HTMLElement, parent: HTMLElement | null): number => {
      if (!parent) { throw new Error('No `gallery` attribute found!'); }
      if (parent.hasAttribute('gallery')) {
        const ps: Photo[] = [];
        const initEl = getImg(openEl);
        let initIndex = 0;
        thumbs = parent.getElementsByTagName('img');
        for (let i = 0; i < thumbs.length; i++) {
          let thumb = thumbs[i];
          if (initEl === thumb) {
            initIndex = i;
          }
          let src = thumb.getAttribute('src');
          let dataSrc = thumb.getAttribute('data-src') || '';
          if (!src) { throw new Error('No `src` attribute found!') }
          ps.push({ thumb, src, dataSrc });
        }
        photos.value = ps;
        lastIndex = initIndex;
        return initIndex;
      }
      return loadPhotos(openEl, parent.parentElement);
    }
    let animating = false;
    const animateShow = (swiper: Swiper, photos: Photo[], callback?: () => void, delayCount: number = 1) => {
      animating = true;

      const img = getActiveImg(swiper);
      const delay = new DelayQueue('animateShow');
      // 非lazy-load图片的DOM未加载完成时，等待加载完成
      // 受限于原图的尺寸不是预知的，这个方案是个妥协，它没能覆盖显示异常的全部情况
      // TODO: 适配是lazy-load且为宽屏的情况
      if (!img.naturalWidth && !photos[swiper.activeIndex].dataSrc) {
        if (delayCount >= 10) {
          // 加载DOM超过100ms，放弃动画，直接显示
          img.style.transform = '';
          swiper.el.style.backgroundColor = '';
          swiper.el.style.zIndex = '999';
          swiper.el.style.visibility = 'visible';
          return;
        }
        delay.timeout(() => animateShow(swiper, photos, callback, ++delayCount), 10);
        return;
      }
      const needOriginScale = (img: HTMLImageElement) => img.naturalWidth && swiper.el.clientWidth > img.naturalWidth && swiper.el.clientHeight > img.naturalHeight;
      const from = photos[swiper.activeIndex].thumb;
      const fromBounds = from.getBoundingClientRect();
      const fitY = from.naturalWidth / from.naturalHeight < swiper.el.clientWidth / swiper.el.clientHeight;
      // img.naturalWidth和img.naturalHeight可能由于原图未加载而为0，为0则用thumb的naturalWidth和naturalHeight代替
      const originScale = needOriginScale(img);
      const dividerX = !fitY ? swiper.el.clientWidth : img.naturalWidth ? (swiper.el.clientHeight / img.naturalHeight) * img.naturalWidth : (swiper.el.clientHeight / from.naturalHeight) * from.naturalWidth;
      const dividerY = fitY ? swiper.el.clientHeight : img.naturalHeight ? (swiper.el.clientWidth / img.naturalWidth) * img.naturalHeight : (swiper.el.clientWidth / from.naturalWidth) * from.naturalHeight;
      const scaleX = fromBounds.width / (originScale ? img.naturalWidth : dividerX);
      const scaleY = fromBounds.height / (originScale ? img.naturalHeight : dividerY);
      const dX = (fromBounds.x + fromBounds.width / 2) - (swiper.el.clientWidth / 2);
      const dY = (fromBounds.y + fromBounds.height / 2) - (swiper.el.clientHeight / 2);

      img.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scaleX + ',' + scaleY + ')';
      swiper.el.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      swiper.el.style.zIndex = '999';
      swiper.el.style.visibility = 'visible';

      swiper.pagination.el.classList.remove('swiper-pagination-hidden');

      const aThumb = swiper.el.querySelector('.swiper-slide-active>img.animate-thumb') as HTMLImageElement;
      aThumb.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scaleX + ',' + scaleY + ')';
      if (originScale) {
        aThumb.style.width = img.naturalWidth + 'px';
        aThumb.style.height = img.naturalHeight + 'px';
      } else {
        if (fitY) {
          aThumb.style.height = '100%';
        } else {
          aThumb.style.width = '100%';
        }
      }
      aThumb.style.display = 'inline';
      aThumb.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';
      // 在原图加载完成时修正aThumb的尺寸
      img.onload = () => {
        if (needOriginScale(img)) {
          aThumb.style.width = img.naturalWidth + 'px';
          aThumb.style.height = img.naturalHeight + 'px';
        }
      }
      // 必须分开成两次100ms的timeout
      delay.timeout(() => aThumb.style.transform = '', 100);

      delay.timeout(() => {
        img.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';
        swiper.el.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';
        img.style.transform = '';
        swiper.el.style.backgroundColor = '';
        from.style.visibility = 'hidden';
      }, 100);
      delay.timeout(() => {
        img.style.transition = '';
        swiper.el.style.transition = '';

        const hideAnimateThumb = () => {
          aThumb.style.display = '';
          aThumb.style.transition = '';
          aThumb.style.width = '';
          aThumb.style.height = '';
        }
        // 在`.swiper-lazy-preloader`消失后再隐藏animate-thumb
        const preloaderEl = img.parentElement?.querySelector('.swiper-lazy+.swiper-lazy-preloader')
        if (img.parentElement && preloaderEl) {
          const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutations of mutationsList) {
              let removedNodes = mutations.removedNodes;
              for (let i = 0; i < removedNodes.length; i++) {
                let removed = removedNodes[i] as Element;
                if (removed.classList.contains('swiper-lazy-preloader')) {
                  hideAnimateThumb();
                  observer.disconnect();
                  return;
                }
              }
            }
          });
          observer.observe(img.parentElement, { childList: true });
        } else {
          hideAnimateThumb();
        }

        animating = false;
        callback && callback();
      }, 350);
    }
    const animateHide = (swiper: Swiper, photos: Photo[], callback: () => void) => {
      animating = true;

      const img = getActiveImg(swiper);
      const to = photos[swiper.activeIndex].thumb;
      const toBounds = to.getBoundingClientRect();
      const fitY = img.naturalWidth / img.naturalHeight < swiper.el.clientWidth / swiper.el.clientHeight;
      const originScale = img.naturalWidth && swiper.el.clientWidth > img.naturalWidth && swiper.el.clientHeight > img.naturalHeight;
      const dividerX = !fitY ? swiper.el.clientWidth : (swiper.el.clientHeight / img.naturalHeight) * img.naturalWidth;
      const dividerY = fitY ? swiper.el.clientHeight : (swiper.el.clientWidth / img.naturalWidth) * img.naturalHeight;
      const scaleX = toBounds.width / (originScale ? img.naturalWidth : dividerX);
      const scaleY = toBounds.height / (originScale ? img.naturalHeight : dividerY);
      const dX = (toBounds.x + toBounds.width / 2) - (swiper.el.clientWidth / 2);
      const dY = (toBounds.y + toBounds.height / 2) - (swiper.el.clientHeight / 2);

      img.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';
      swiper.el.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';

      img.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scaleX + ',' + scaleY + ')';
      swiper.el.style.backgroundColor = 'rgba(0, 0, 0, 0)';

      const delay = new DelayQueue('animateHide');
      delay.timeout(() => {
        to.style.visibility = '';
        img.style.transition = '';
        swiper.el.style.transition = '';
        swiper.el.style.zIndex = '-999';
        swiper.el.style.visibility = 'hidden';

        animating = false;
        callback();
      }, 250);
    }
    const animateCancelled = (swiper: Swiper) => {
      const img = getActiveImg(swiper);

      swiper.pagination.el.classList.remove('swiper-pagination-hidden');

      img.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';
      swiper.el.style.transition = 'all .25s cubic-bezier(.4,0,.22,1)';
      img.style.transform = '';
      swiper.el.style.backgroundColor = '';
      setTimeout(() => {
        img.style.transition = '';
        swiper.el.style.transition = '';
      }, 250);
    }

    let moveOpposite = false;
    let identifier = -1;
    let target: HTMLElement | null = null;
    let startX = 0, startY = 0, lastY = 0;
    let direction = -1;
    let lastDirection = -1;

    const trace = false;
    const log = (...data: any[]) => {
      if (trace) {
        console.log(...data);
      }
    }
    let swiper: Swiper;
    const onSwiper = (s: Swiper) => {
      swiper = s
    }
    const getTouch = (touches: TouchList, id: number) => {
      for (let i = 0; i < touches.length; i++) {
        if (touches[i].identifier === id) {
          return touches[i];
        }
      }
      throw new Error('No touch!');
    }
    const getPageXY = (ev: PointerEvent | MouseEvent | TouchEvent) => {
      const event = ev as any;
      let pageX, pageY;
      if (event.changedTouches) {
        const touch = getTouch(event.changedTouches, identifier);
        pageX = touch.pageX;
        pageY = touch.pageY;
      } else {
        pageX = event.pageX;
        pageY = event.pageY;
      }
      return { pageX, pageY };
    }
    const getIdentifier = (ev: PointerEvent | MouseEvent | TouchEvent) => {
      const event = ev as any;
      if (event.changedTouches) {
        return event.changedTouches[0].identifier;
      }
      return event.pointerId || 1000;
    }
    const onTouchStart = (s: Swiper, ev: PointerEvent | MouseEvent | TouchEvent) => {
      log('onTouchStart')
      moveOpposite = false;
      if (target !== null || identifier > -1 || s.zoom.scale !== 1 || animating) { return; }
      identifier = getIdentifier(ev);
      const { pageX, pageY } = getPageXY(ev);
      const event = ev as any;
      const el = event.changedTouches ? event.changedTouches[0].target : ev.target;
      target = getImg(el);
      startX = pageX;
      startY = pageY;
      lastY = pageY;
    }
    const onTouchMoveOpposite = (s: Swiper, ev: PointerEvent | MouseEvent | TouchEvent) => {
      log('onTouchMoveOpposite');
      moveOpposite = true;
      // ev.target可能传入的是pagination-bullets元素，所以target必须用onTouchStart记录的值
      if (target === null || getIdentifier(ev) !== identifier || s.zoom.scale !== 1 || animating) { return; }
      ev.preventDefault();// 消耗掉该事件
      emit('swipeStarted', ev);
      const { pageX, pageY } = getPageXY(ev);
      const el = target;
      const slide = s.el;
      el.style.transition = 'none';
      slide.style.transition = 'none';
      const dX = pageX - startX;
      const dY = pageY - startY;
      direction = dY;
      lastDirection = pageY - lastY;
      lastY = pageY;

      const scale = Math.max(1 - Math.abs(dY / s.el.clientHeight), 0.5).toString();
      slide.style.backgroundColor = 'rgba(0, 0, 0, ' + scale + ')';
      el.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scale + ')';

      const paginationClazz = s.pagination.el.classList;
      if (paginationClazz.contains('swiper-pagination-hidden') !== ((lastDirection > 0) === (direction > 0))
        && lastDirection !== 0) {
        paginationClazz.toggle('swiper-pagination-hidden');
      }

      updateThumbsVisibility(s.activeIndex);
    }
    const onTouchEnd = (s: Swiper, ev: PointerEvent | MouseEvent | TouchEvent) => {
      log('onTouchEnd', identifier);
      if (target === null || getIdentifier(ev) !== identifier) { return; }
      identifier = -1;
      target = null;
      if (!moveOpposite || s.zoom.scale !== 1 || animating) { return; }

      if ((lastDirection > 0) != (direction > 0) || Math.abs(direction) < 80) {
        animateCancelled(s);
        emit('swipeCancelled', ev);
        log('swipeCancelled');
      } else {
        log('swipeExit');
        emit('swipeExit', ev);
        historyHandler.exit();
      }
    }
    const destroy = () => {
      photos.value = [];
      props.open.el = null;
      thumbs = {} as HTMLCollectionOf<HTMLImageElement>;
      document.body.style.overflow = '';
      log('swipeExited', swiper.activeIndex)
      emit('swipeExited');
    }

    const historyHandler = {
      opened: false,
      onPopState(ev: PopStateEvent) {
        if (this.opened) {
          updateThumbsVisibility(swiper.activeIndex);
          animateHide(swiper, photos.value, destroy);
          this.opened = false;
        }
      },
      onImageOpened() {
        history.pushState('image-viewer', document.title, props.historyUrl);
        this.opened = true;
      },
      exit() {
        history.back();
      },
    }
    const popstateListener = (ev: PopStateEvent) => historyHandler.onPopState.call(historyHandler, ev)
    onMounted(() => {
      window.addEventListener('popstate', popstateListener);
    })
    onUnmounted(() => {
      window.removeEventListener('popstate', popstateListener);
    })

    watch(() => props.open.el, (el) => {
      if (el) {
        log('open')
        const initIndex = loadPhotos(el, el.parentElement);
        swiper.updateSlides();
        swiper.slideTo(initIndex, 0, false);
        document.body.style.overflow = 'hidden'
        const delay = new DelayQueue('open');
        delay.timeout(() => animateShow(swiper, photos.value), 0);
        delay.timeout(() => swiper.lazy.load(), 1);
        historyHandler.onImageOpened()
      }
    })

    const singleClickTracker = {
      timeout: -1,
      clickCount: 0,
      enqueue(action: () => void) {
        this.clickCount++;
        if (this.clickCount >= 2) {
          this.onDoubleClick();
          return;
        }
        this.timeout = setTimeout(() => {
          action();
          this.reset();
        }, 220)
      },
      reset() {
        if (this.timeout > -1) {
          clearTimeout(this.timeout);
        }
        this.timeout = -1;
        this.clickCount = 0;
      },
      onDoubleClick() {
        this.reset();
      },
    }

    return {
      style,
      photos,
      onClick: (s: Swiper, ev: Event) => {
        if (s.zoom.scale !== 1) {
          s.pagination.el.classList.toggle('swiper-pagination-hidden');
        } else {
          singleClickTracker.enqueue(historyHandler.exit)
        }
      },
      onDoubleClick: () => {
        singleClickTracker.onDoubleClick();
      },
      onTouchStart,
      onTouchMoveOpposite,
      onTouchEnd,
      onSwiper,
    };
  },
});
</script>

<style scoped>
.swiper {
  position: fixed;
  z-index: -999;
  visibility: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
}

.swiper-pagination {
  transition: all 0.25s cubic-bezier(.4,0,.22,1);
}

.swiper-pagination-hidden {
  visibility: hidden;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.swiper-slide > img {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  -o-object-fit: contain;
  object-fit: contain;
}
.swiper-slide > img.animate-thumb {
  display: none;
}
</style>