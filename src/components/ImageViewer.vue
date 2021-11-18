<template>
  <div class="animate-thumb">
    <img ref="animateThumb" :src="animateThumbSrc" />
  </div>
  <swiper
    :style="style"
    :lazy="true"
    :zoom="true"
    :spaceBetween="30"
    :pagination="{ 'clickable': true, 'dynamicBullets': true }"
    @swiper="onSwiper"
    @click="onClick"
    @touchStart="onTouchStart"
    @touchEnd="onTouchEnd"
    @touchMoveOpposite="onTouchMoveOpposite"
  >
    <swiper-slide v-for="(p, i) in photos" :key="i">
      <div class="swiper-zoom-container">
        <!-- Required swiper-lazy class and image source specified in data-src attribute -->
        <img :data-src="p.dataSrc" class="swiper-lazy" />
        <!-- Preloader image -->
        <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<script lang="ts">
import { defineComponent, PropType, watch, ref } from 'vue';
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
  components: {
    Swiper: SwiperVue,
    SwiperSlide,
  },
  props: {
    open: {
      type: Object as PropType<Open>,
      default: () => ({ el: null })
    },
  },
  emits: {
    swipeStarted: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
    swipeCancelled: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
    swipeExit: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
    swipeExited: (ev: PointerEvent | MouseEvent | TouchEvent) => true,
  },
  setup(props, { emit }) {
    const style = {
      '--swiper-pagination-color': '#fff',
      '--swiper-pagination-bullet-inactive-color': '#8E8E93',
      '--swiper-pagination-bullet-inactive-opacity': '.5',
    };
    const animateThumb = ref<HTMLImageElement>();
    const animateThumbSrc = ref('');
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

    const getImg = (el: HTMLElement) => el.tagName === 'IMG' ? el : el.getElementsByTagName('img')[0];
    const loadPhotos = (openEl: HTMLElement, parent: HTMLElement | null): number => {
      if (!parent) { throw new Error('No gallery attribute!'); }
      if (parent.hasAttribute('gallery')) {
        const ps: Photo[] = [];
        const initEl = getImg(openEl);
        let initIndex = 0;
        thumbs = parent.getElementsByTagName('img');
        for (let i = 0; i < thumbs.length; i++) {
          let img = thumbs[i];
          if (initEl === img) {
            initIndex = i;
          }
          let data = img.getAttribute('data-src') || img.getAttribute('src');
          if (!data) { throw new Error('No data-src or src!') }
          ps.push({ thumb: img, dataSrc: data });
        }
        photos.value = ps;
        animateThumbSrc.value = thumbs[initIndex].src;
        lastIndex = initIndex;
        return initIndex;
      }
      return loadPhotos(openEl, parent.parentElement);
    }
    const animateShow = (swiper: Swiper, photos: Photo[], callback?: () => void, delayCount: number = 1) => {
      const imgEls = swiper.wrapperEl.getElementsByTagName('img');
      const img = imgEls[swiper.activeIndex];
      const delay = new DelayQueue('animateShow');
      if (!img.naturalWidth) {
        if (delayCount >= 10) {
          // 加载DOM超过100ms，放弃动画，直接显示
          img.style.transform = '';
          swiper.el.style.backgroundColor = '';
          return;
        }
        delay.timeout(() => animateShow(swiper, photos, callback, ++delayCount), 10);
        return;
      }
      const from = photos[swiper.activeIndex].thumb;
      const fromBounds = from.getBoundingClientRect();
      // img.naturalWidth和img.naturalHeight可能由于原图未加载而为0，为0则用thumb的naturalWidth和naturalHeight代替
      const originScale = img.naturalWidth && swiper.el.clientWidth > img.naturalWidth;
      const scaleX = fromBounds.width / (originScale ? img.naturalWidth : swiper.el.clientWidth);
      const dividerY = img.naturalHeight ? (swiper.el.clientWidth / img.naturalWidth) * img.naturalHeight : (swiper.el.clientWidth / from.naturalWidth) * from.naturalHeight;
      const scaleY = fromBounds.height / (originScale ? img.naturalHeight : dividerY);
      const dX = (fromBounds.x + fromBounds.width / 2) - (swiper.el.clientWidth / 2);
      const dY = (fromBounds.y + fromBounds.height / 2) - (swiper.el.clientHeight / 2);

      img.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scaleX + ',' + scaleY + ')';
      swiper.el.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      swiper.el.style.zIndex = '999';
      swiper.el.style.visibility = 'visible';

      swiper.pagination.el.classList.remove('swiper-pagination-hidden');

      const aThumb = animateThumb.value as HTMLImageElement;
      const aThumbParent = aThumb.parentElement as HTMLDivElement;
      aThumb.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scaleX + ',' + scaleY + ')';
      if (originScale) {
        aThumb.style.width = img.naturalWidth + 'px';
        aThumb.style.height = img.naturalHeight + 'px';
      }

      delay.timeout(() => {
        aThumbParent.style.zIndex = '1000';
        aThumbParent.style.visibility = 'visible';
        aThumb.style.transition = 'all .2s ease-in-out';
        aThumb.style.transform = '';

        img.style.transition = 'all .2s ease-in-out';
        swiper.el.style.transition = 'all .2s ease-in-out';
        img.style.transform = '';
        swiper.el.style.backgroundColor = '';
        from.style.visibility = 'hidden';
      }, 100);
      delay.timeout(() => {
        img.style.transition = '';
        swiper.el.style.transition = '';

        aThumb.style.transition = '';
        aThumbParent.style.zIndex = '';
        aThumbParent.style.visibility = 'hidden';
        aThumb.style.width = '';
        aThumb.style.height = '';
        callback && callback();
      }, 300);
    }
    const animateHide = (swiper: Swiper, photos: Photo[], callback: () => void) => {
      const imgEls = swiper.wrapperEl.getElementsByTagName('img');
      const img = imgEls[swiper.activeIndex];
      const to = photos[swiper.activeIndex].thumb;
      const toBounds = to.getBoundingClientRect();
      const originScale = swiper.el.clientWidth > img.naturalWidth;
      const scaleX = toBounds.width / (originScale ? img.naturalWidth : swiper.el.clientWidth);
      const scaleY = toBounds.height / (originScale ? img.naturalHeight : (swiper.el.clientWidth / img.naturalWidth) * img.naturalHeight);
      const dX = (toBounds.x + toBounds.width / 2) - (swiper.el.clientWidth / 2);
      const dY = (toBounds.y + toBounds.height / 2) - (swiper.el.clientHeight / 2);

      img.style.transition = 'all .2s ease-in-out';
      swiper.el.style.transition = 'all .2s ease-in-out';

      img.style.transform = 'translate(' + dX + 'px, ' + dY + 'px)' + ' scale(' + scaleX + ',' + scaleY + ')';
      swiper.el.style.backgroundColor = 'rgba(0, 0, 0, 0)';

      const delay = new DelayQueue('animateHide');
      delay.timeout(() => {
        to.style.visibility = '';
        img.style.transition = '';
        swiper.el.style.transition = '';
        swiper.el.style.zIndex = '-999';
        swiper.el.style.visibility = 'hidden';
        callback();
      }, 200);
    }
    const animateCancelled = (swiper: Swiper) => {
      const imgEls = swiper.wrapperEl.getElementsByTagName('img');
      const img = imgEls[swiper.activeIndex];

      swiper.pagination.el.classList.remove('swiper-pagination-hidden');

      img.style.transition = 'all .2s ease-in-out';
      swiper.el.style.transition = 'all .2s ease-in-out';
      img.style.transform = '';
      swiper.el.style.backgroundColor = '';
      setTimeout(() => {
        img.style.transition = '';
        swiper.el.style.transition = '';
      }, 200);
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
      if (target !== null || identifier > -1) { return; }
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
      if (target === null || getIdentifier(ev) !== identifier) { return; }
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
      if (!moveOpposite) { return; }

      if ((lastDirection > 0) != (direction > 0) || Math.abs(direction) < 80) {
        animateCancelled(s);
        emit('swipeCancelled', ev);
        log('swipeCancelled');
      } else {
        log('swipeExit');
        emit('swipeExit', ev);
        animateHide(s, photos.value, () => {
          photos.value = [];
          props.open.el = null;
          animateThumbSrc.value = '';
          thumbs = {} as HTMLCollectionOf<HTMLImageElement>;
          document.body.style.overflow = '';
          log('swipeExited', s.activeIndex)
          emit('swipeExited', ev);
        })
      }
    }

    watch(() => props.open.el, (el) => {
      if (el) {
        log('open')
        const initIndex = loadPhotos(el, el.parentElement);
        swiper.updateSlides();
        swiper.slideTo(initIndex, 0, false);
        document.body.style.overflow = 'hidden';
        const delay = new DelayQueue('open');
        delay.timeout(() => animateShow(swiper, photos.value), 0);
        delay.timeout(() => swiper.lazy.load(), 1);
      }
    })

    return {
      style,
      animateThumb,
      animateThumbSrc,
      photos,
      onClick: () => swiper.pagination.el.classList.toggle('swiper-pagination-hidden'),
      onTouchStart,
      onTouchMoveOpposite,
      onTouchEnd,
      onSwiper,
    };
  },
});
</script>

<style>
.swiper {
  position: fixed;
  z-index: -999;
  visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.swiper-pagination {
  transition: all 0.2s ease-in-out;
}

.swiper-pagination-hidden {
  visibility: hidden;
}

.animate-thumb {
  position: fixed;
  z-index: -1000;
  visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}

.animate-thumb > img {
  margin: auto;
  width: 100%;
}
</style>