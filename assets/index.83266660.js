var ye=Object.defineProperty;var fe=(l,o,c)=>o in l?ye(l,o,{enumerable:!0,configurable:!0,writable:!0,value:c}):l[o]=c;var P=(l,o,c)=>(fe(l,typeof o!="symbol"?o+"":o,c),c);import{S as ve,L as _e,Z as be,P as we,d as V,a as Se,b as xe,r as X,w as ze,c as ee,o as v,e as te,f as ne,n as He,g as w,h as D,i as f,F as I,j as ie,u as Te,t as We,k as Ee}from"./vendor.aa233e01.js";const Ie=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))d(s);new MutationObserver(s=>{for(const u of s)if(u.type==="childList")for(const _ of u.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&d(_)}).observe(document,{childList:!0,subtree:!0});function c(s){const u={};return s.integrity&&(u.integrity=s.integrity),s.referrerpolicy&&(u.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?u.credentials="include":s.crossorigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function d(s){if(s.ep)return;s.ep=!0;const u=c(s);fetch(s.href,u)}};Ie();var ke="/image-swiper/assets/swiper.a33b08cf.png";var Ce=(l,o)=>{for(const[c,d]of o)l[c]=d;return l};ve.use([_e,be,we]);const C=class{constructor(o){P(this,"key");this.key=o;const c=C.queue[o];if(c)for(let d of c)clearTimeout(d);C.queue[o]=[]}timeout(o,c,...d){C.queue[this.key].push(setTimeout(o,c,...d))}};let k=C;P(k,"queue",{});const Ye=V({components:{Swiper:Se,SwiperSlide:xe},props:{open:{type:Object,required:!0}},emits:{swipeStarted:l=>!0,swipeCancelled:l=>!0,swipeExit:l=>!0,swipeExited:l=>!0},setup(l,{emit:o}){const c={"--swiper-pagination-color":"#fff","--swiper-pagination-bullet-inactive-color":"#8E8E93","--swiper-pagination-bullet-inactive-opacity":".5"},d=X([]);let s,u=0;const _=e=>{e!==u&&(s[u].style.visibility="",s[e].style.visibility="hidden",u=e)},y=e=>{if(e.tagName==="IMG")return e;const t=e.getElementsByTagName("img");return t[t.length-1]},S=e=>e.wrapperEl.querySelectorAll("img.swiper-lazy")[e.activeIndex],W=(e,t)=>{if(!t)throw new Error("No `gallery` attribute found!");if(t.hasAttribute("gallery")){const a=[],i=y(e);let n=0;s=t.getElementsByTagName("img");for(let r=0;r<s.length;r++){let p=s[r];i===p&&(n=r);let h=p.getAttribute("src"),m=p.getAttribute("data-src")||"";if(!h)throw new Error("No `src` attribute found!");a.push({thumb:p,src:h,dataSrc:m})}return d.value=a,u=n,n}return W(e,t.parentElement)},F=(e,t,a,i=1)=>{const n=S(e),r=new k("animateShow");if(!n.naturalWidth&&!t[e.activeIndex].dataSrc){if(i>=10){n.style.transform="",e.el.style.backgroundColor="",e.el.style.zIndex="999",e.el.style.visibility="visible";return}r.timeout(()=>F(e,t,a,++i),10);return}const p=T=>T.naturalWidth&&e.el.clientWidth>T.naturalWidth&&e.el.clientHeight>T.naturalHeight,h=t[e.activeIndex].thumb,m=h.getBoundingClientRect(),b=h.naturalWidth/h.naturalHeight<e.el.clientWidth/e.el.clientHeight,E=p(n),$=b?n.naturalWidth?e.el.clientHeight/n.naturalHeight*n.naturalWidth:e.el.clientHeight/h.naturalHeight*h.naturalWidth:e.el.clientWidth,q=b?e.el.clientHeight:n.naturalHeight?e.el.clientWidth/n.naturalWidth*n.naturalHeight:e.el.clientWidth/h.naturalWidth*h.naturalHeight,L=m.width/(E?n.naturalWidth:$),M=m.height/(E?n.naturalHeight:q),K=m.x+m.width/2-e.el.clientWidth/2,J=m.y+m.height/2-e.el.clientHeight/2;n.style.transform="translate("+K+"px, "+J+"px) scale("+L+","+M+")",e.el.style.backgroundColor="rgba(0, 0, 0, 0)",e.el.style.zIndex="999",e.el.style.visibility="visible",e.pagination.el.classList.remove("swiper-pagination-hidden");const g=e.el.querySelector(".swiper-slide-active>img.animate-thumb");g.style.transform="translate("+K+"px, "+J+"px) scale("+L+","+M+")",E?(g.style.width=n.naturalWidth+"px",g.style.height=n.naturalHeight+"px"):b?g.style.height="100%":g.style.width="100%",g.style.display="inline",g.style.transition="all .25s cubic-bezier(.4,0,.22,1)",n.onload=()=>{p(n)&&(g.style.width=n.naturalWidth+"px",g.style.height=n.naturalHeight+"px")},r.timeout(()=>g.style.transform="",100),r.timeout(()=>{n.style.transition="all .25s cubic-bezier(.4,0,.22,1)",e.el.style.transition="all .25s cubic-bezier(.4,0,.22,1)",n.style.transform="",e.el.style.backgroundColor="",h.style.visibility="hidden"},100),r.timeout(()=>{var U;n.style.transition="",e.el.style.transition="";const T=()=>{g.style.display="",g.style.transition="",g.style.width="",g.style.height=""},he=(U=n.parentElement)==null?void 0:U.querySelector(".swiper-lazy+.swiper-lazy-preloader");n.parentElement&&he?new MutationObserver((ge,me)=>{for(let pe of ge){let Q=pe.removedNodes;for(let A=0;A<Q.length;A++)if(Q[A].classList.contains("swiper-lazy-preloader")){T(),me.disconnect();return}}}).observe(n.parentElement,{childList:!0}):T(),a&&a()},350)},le=(e,t,a)=>{const i=S(e),n=t[e.activeIndex].thumb,r=n.getBoundingClientRect(),p=i.naturalWidth/i.naturalHeight<e.el.clientWidth/e.el.clientHeight,h=i.naturalWidth&&e.el.clientWidth>i.naturalWidth&&e.el.clientHeight>i.naturalHeight,m=p?e.el.clientHeight/i.naturalHeight*i.naturalWidth:e.el.clientWidth,b=p?e.el.clientHeight:e.el.clientWidth/i.naturalWidth*i.naturalHeight,E=r.width/(h?i.naturalWidth:m),$=r.height/(h?i.naturalHeight:b),q=r.x+r.width/2-e.el.clientWidth/2,L=r.y+r.height/2-e.el.clientHeight/2;i.style.transition="all .25s cubic-bezier(.4,0,.22,1)",e.el.style.transition="all .25s cubic-bezier(.4,0,.22,1)",i.style.transform="translate("+q+"px, "+L+"px) scale("+E+","+$+")",e.el.style.backgroundColor="rgba(0, 0, 0, 0)",new k("animateHide").timeout(()=>{n.style.visibility="",i.style.transition="",e.el.style.transition="",e.el.style.zIndex="-999",e.el.style.visibility="hidden",a()},250)},oe=e=>{const t=S(e);e.pagination.el.classList.remove("swiper-pagination-hidden"),t.style.transition="all .25s cubic-bezier(.4,0,.22,1)",e.el.style.transition="all .25s cubic-bezier(.4,0,.22,1)",t.style.transform="",e.el.style.backgroundColor="",setTimeout(()=>{t.style.transition="",e.el.style.transition=""},250)};let N=!1,x=-1,z=null,G=0,R=0,O=0,Y=-1,j=-1;const se=(...e)=>{};let H;const ae=e=>{H=e},re=(e,t)=>{for(let a=0;a<e.length;a++)if(e[a].identifier===t)return e[a];throw new Error("No touch!")},Z=e=>{const t=e;let a,i;if(t.changedTouches){const n=re(t.changedTouches,x);a=n.pageX,i=n.pageY}else a=t.pageX,i=t.pageY;return{pageX:a,pageY:i}},B=e=>{const t=e;return t.changedTouches?t.changedTouches[0].identifier:t.pointerId||1e3},ce=(e,t)=>{if(N=!1,z!==null||x>-1||e.zoom.scale!==1)return;x=B(t);const{pageX:a,pageY:i}=Z(t),n=t,r=n.changedTouches?n.changedTouches[0].target:t.target;z=y(r),G=a,R=i,O=i},ue=(e,t)=>{if(N=!0,z===null||B(t)!==x||e.zoom.scale!==1)return;t.preventDefault(),o("swipeStarted",t);const{pageX:a,pageY:i}=Z(t),n=z,r=e.el;n.style.transition="none",r.style.transition="none";const p=a-G,h=i-R;Y=h,j=i-O,O=i;const m=Math.max(1-Math.abs(h/e.el.clientHeight),.5).toString();r.style.backgroundColor="rgba(0, 0, 0, "+m+")",n.style.transform="translate("+p+"px, "+h+"px) scale("+m+")";const b=e.pagination.el.classList;b.contains("swiper-pagination-hidden")!==(j>0==Y>0)&&j!==0&&b.toggle("swiper-pagination-hidden"),_(e.activeIndex)},de=(e,t)=>{z===null||B(t)!==x||(x=-1,z=null,!(!N||e.zoom.scale!==1)&&(j>0!=Y>0||Math.abs(Y)<80?(oe(e),o("swipeCancelled",t)):(o("swipeExit",t),le(e,d.value,()=>{d.value=[],l.open.el=null,s={},document.body.style.overflow="",se("swipeExited",e.activeIndex),o("swipeExited",t)}))))};return ze(()=>l.open.el,e=>{if(e){const t=W(e,e.parentElement);H.updateSlides(),H.slideTo(t,0,!1);const a=new k("open");a.timeout(()=>F(H,d.value,()=>document.body.style.overflow="hidden"),0),a.timeout(()=>H.lazy.load(),1)}}),{style:c,photos:d,onClick:()=>H.pagination.el.classList.toggle("swiper-pagination-hidden"),onTouchStart:ce,onTouchMoveOpposite:ue,onTouchEnd:de,onSwiper:ae}}}),je=["src"],Le={class:"swiper-zoom-container"},Xe=["data-src"],Ne=f("div",{class:"swiper-lazy-preloader swiper-lazy-preloader-white"},null,-1);function Oe(l,o,c,d,s,u){const _=ee("swiper-slide"),y=ee("swiper");return v(),te(y,{style:He(l.style),lazy:!0,zoom:!0,spaceBetween:30,pagination:{clickable:!0,dynamicBullets:!0},onSwiper:l.onSwiper,onClick:l.onClick,onTouchStart:l.onTouchStart,onTouchEnd:l.onTouchEnd,onTouchMoveOpposite:l.onTouchMoveOpposite},{default:ne(()=>[(v(!0),w(I,null,D(l.photos,(S,W)=>(v(),te(_,{key:W},{default:ne(()=>[f("img",{src:l.photos[W].src,class:"animate-thumb"},null,8,je),f("div",Le,[f("img",{"data-src":S.dataSrc||S.src,class:"swiper-lazy"},null,8,Xe),Ne])]),_:2},1024))),128))]),_:1},8,["style","onSwiper","onClick","onTouchStart","onTouchEnd","onTouchMoveOpposite"])}var Be=Ce(Ye,[["render",Oe]]);const $e=f("h3",null,"Group 1",-1),qe={gallery:""},Me=["src"],Ae=f("h3",null,"Group 2",-1),Pe={gallery:""},Ve=["src"],De=V({props:{msg:null},setup(l){const o=X(["https://swiperjs.com/demos/images/nature-1.jpg","https://swiperjs.com/demos/images/nature-2.jpg","https://swiperjs.com/demos/images/nature-3.jpg"]),c=X(["https://swiperjs.com/demos/images/nature-4.jpg","https://swiperjs.com/demos/images/nature-5.jpg","https://swiperjs.com/demos/images/nature-6.jpg"]),d=X({el:null}),s=u=>d.value.el=u.target;return(u,_)=>(v(),w(I,null,[ie(Te(Be),{open:d.value},null,8,["open"]),f("h1",null,We(l.msg),1),$e,f("div",qe,[(v(!0),w(I,null,D(o.value,y=>(v(),w("img",{key:y,src:y,width:"200",onClick:s},null,8,Me))),128))]),Ae,f("div",Pe,[(v(!0),w(I,null,D(c.value,y=>(v(),w("img",{key:y,src:y,width:"200",onClick:s},null,8,Ve))),128))])],64))}});const Fe=f("img",{alt:"Image Swiper",src:ke},null,-1),Ge=V({setup(l){return(o,c)=>(v(),w(I,null,[Fe,ie(De,{msg:"Image Swiper"})],64))}});Ee(Ge).mount("#app");
