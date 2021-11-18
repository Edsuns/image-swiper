var le=Object.defineProperty;var re=(n,i,c)=>i in n?le(n,i,{enumerable:!0,configurable:!0,writable:!0,value:c}):n[i]=c;var M=(n,i,c)=>(re(n,typeof i!="symbol"?i+"":i,c),c);import{S as ce,L as ue,Z as de,P as ge,d as P,a as he,b as me,r as x,w as pe,c as J,o as _,e as w,f,g as q,h as U,n as ye,F as I,i as A,j as fe,u as ve,t as _e,k as be}from"./vendor.8a138d16.js";const we=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))g(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const h of r.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&g(h)}).observe(document,{childList:!0,subtree:!0});function c(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function g(a){if(a.ep)return;a.ep=!0;const r=c(a);fetch(a.href,r)}};we();var Te="/assets/swiper.a33b08cf.png";var Ee=(n,i)=>{for(const[c,g]of i)n[c]=g;return n};ce.use([ue,de,ge]);const C=class{constructor(i){M(this,"key");this.key=i;const c=C.queue[i];if(c)for(let g of c)clearTimeout(g);C.queue[i]=[]}timeout(i,c,...g){C.queue[this.key].push(setTimeout(i,c,...g))}};let k=C;M(k,"queue",{});const Se=P({components:{Swiper:he,SwiperSlide:me},props:{open:{type:Object,default:()=>({el:null})}},emits:{swipeStarted:n=>!0,swipeCancelled:n=>!0,swipeExit:n=>!0,swipeExited:n=>!0},setup(n,{emit:i}){const c={"--swiper-pagination-color":"#fff","--swiper-pagination-bullet-inactive-color":"#8E8E93","--swiper-pagination-bullet-inactive-opacity":".5"},g=x(),a=x(""),r=x([]);let h,p=0;const Y=e=>{e!==p&&(h[p].style.visibility="",h[e].style.visibility="hidden",p=e)},W=e=>e.tagName==="IMG"?e:e.getElementsByTagName("img")[0],V=(e,t)=>{if(!t)throw new Error("No gallery attribute!");if(t.hasAttribute("gallery")){const s=[],d=W(e);let l=0;h=t.getElementsByTagName("img");for(let o=0;o<h.length;o++){let u=h[o];d===u&&(l=o);let m=u.getAttribute("data-src")||u.getAttribute("src");if(!m)throw new Error("No data-src or src!");s.push({thumb:u,dataSrc:m})}return r.value=s,a.value=h[l].src,p=l,l}return V(e,t.parentElement)},F=(e,t,s,d=1)=>{const o=e.wrapperEl.getElementsByTagName("img")[e.activeIndex],u=new k("animateShow");if(!o.naturalWidth){if(d>=10){o.style.transform="",e.el.style.backgroundColor="";return}u.timeout(()=>F(e,t,s,++d),10);return}const m=t[e.activeIndex].thumb,y=m.getBoundingClientRect(),b=o.naturalWidth&&e.el.clientWidth>o.naturalWidth,B=y.width/(b?o.naturalWidth:e.el.clientWidth),X=o.naturalHeight?e.el.clientWidth/o.naturalWidth*o.naturalHeight:e.el.clientWidth/m.naturalWidth*m.naturalHeight,O=y.height/(b?o.naturalHeight:X),Z=y.x+y.width/2-e.el.clientWidth/2,K=y.y+y.height/2-e.el.clientHeight/2;o.style.transform="translate("+Z+"px, "+K+"px) scale("+B+","+O+")",e.el.style.backgroundColor="rgba(0, 0, 0, 0)",e.el.style.zIndex="999",e.el.style.visibility="visible",e.pagination.el.classList.remove("swiper-pagination-hidden");const v=g.value,N=v.parentElement;v.style.transform="translate("+Z+"px, "+K+"px) scale("+B+","+O+")",b&&(v.style.width=o.naturalWidth+"px",v.style.height=o.naturalHeight+"px"),u.timeout(()=>{N.style.zIndex="1000",N.style.visibility="visible",v.style.transition="all .2s ease-in-out",v.style.transform="",o.style.transition="all .2s ease-in-out",e.el.style.transition="all .2s ease-in-out",o.style.transform="",e.el.style.backgroundColor="",m.style.visibility="hidden"},100),u.timeout(()=>{o.style.transition="",e.el.style.transition="",v.style.transition="",N.style.zIndex="",N.style.visibility="hidden",v.style.width="",v.style.height="",s&&s()},300)},Q=(e,t,s)=>{const l=e.wrapperEl.getElementsByTagName("img")[e.activeIndex],o=t[e.activeIndex].thumb,u=o.getBoundingClientRect(),m=e.el.clientWidth>l.naturalWidth,y=u.width/(m?l.naturalWidth:e.el.clientWidth),b=u.height/(m?l.naturalHeight:e.el.clientWidth/l.naturalWidth*l.naturalHeight),B=u.x+u.width/2-e.el.clientWidth/2,X=u.y+u.height/2-e.el.clientHeight/2;l.style.transition="all .2s ease-in-out",e.el.style.transition="all .2s ease-in-out",l.style.transform="translate("+B+"px, "+X+"px) scale("+y+","+b+")",e.el.style.backgroundColor="rgba(0, 0, 0, 0)",new k("animateHide").timeout(()=>{o.style.visibility="",l.style.transition="",e.el.style.transition="",e.el.style.zIndex="-999",e.el.style.visibility="hidden",s()},200)},ee=e=>{const s=e.wrapperEl.getElementsByTagName("img")[e.activeIndex];e.pagination.el.classList.remove("swiper-pagination-hidden"),s.style.transition="all .2s ease-in-out",e.el.style.transition="all .2s ease-in-out",s.style.transform="",e.el.style.backgroundColor="",setTimeout(()=>{s.style.transition="",e.el.style.transition=""},200)};let $=!1,T=-1,E=null,G=0,D=0,H=0,z=-1,j=-1;const te=(...e)=>{};let S;const ne=e=>{S=e},ie=(e,t)=>{for(let s=0;s<e.length;s++)if(e[s].identifier===t)return e[s];throw new Error("No touch!")},R=e=>{const t=e;let s,d;if(t.changedTouches){const l=ie(t.changedTouches,T);s=l.pageX,d=l.pageY}else s=t.pageX,d=t.pageY;return{pageX:s,pageY:d}},L=e=>{const t=e;return t.changedTouches?t.changedTouches[0].identifier:t.pointerId||1e3},se=(e,t)=>{if($=!1,E!==null||T>-1)return;T=L(t);const{pageX:s,pageY:d}=R(t),l=t,o=l.changedTouches?l.changedTouches[0].target:t.target;E=W(o),G=s,D=d,H=d},oe=(e,t)=>{if($=!0,E===null||L(t)!==T)return;i("swipeStarted",t);const{pageX:s,pageY:d}=R(t),l=E,o=e.el;l.style.transition="none",o.style.transition="none";const u=s-G,m=d-D;z=m,j=d-H,H=d;const y=Math.max(1-Math.abs(m/e.el.clientHeight),.5).toString();o.style.backgroundColor="rgba(0, 0, 0, "+y+")",l.style.transform="translate("+u+"px, "+m+"px) scale("+y+")";const b=e.pagination.el.classList;b.contains("swiper-pagination-hidden")!==(j>0==z>0)&&j!==0&&b.toggle("swiper-pagination-hidden"),Y(e.activeIndex)},ae=(e,t)=>{E===null||L(t)!==T||(T=-1,E=null,!!$&&(j>0!=z>0||Math.abs(z)<80?(ee(e),i("swipeCancelled",t)):(i("swipeExit",t),Q(e,r.value,()=>{r.value=[],n.open.el=null,a.value="",h={},document.body.style.overflow="",te("swipeExited",e.activeIndex),i("swipeExited",t)}))))};return pe(()=>n.open.el,e=>{if(e){const t=V(e,e.parentElement);S.updateSlides(),S.slideTo(t,0,!1),document.body.style.overflow="hidden";const s=new k("open");s.timeout(()=>F(S,r.value),0),s.timeout(()=>S.lazy.load(),1)}}),{style:c,animateThumb:g,animateThumbSrc:a,photos:r,onClick:()=>S.pagination.el.classList.toggle("swiper-pagination-hidden"),onTouchStart:se,onTouchMoveOpposite:oe,onTouchEnd:ae,onSwiper:ne}}}),xe={class:"animate-thumb"},Ie=["src"],ke={class:"swiper-zoom-container"},Ce=["data-src"],We=f("div",{class:"swiper-lazy-preloader swiper-lazy-preloader-white"},null,-1);function ze(n,i,c,g,a,r){const h=J("swiper-slide"),p=J("swiper");return _(),w(I,null,[f("div",xe,[f("img",{ref:"animateThumb",src:n.animateThumbSrc},null,8,Ie)]),q(p,{style:ye(n.style),lazy:!0,zoom:!0,spaceBetween:30,pagination:{clickable:!0,dynamicBullets:!0},onSwiper:n.onSwiper,onClick:n.onClick,onTouchStart:n.onTouchStart,onTouchEnd:n.onTouchEnd,onTouchMoveOpposite:n.onTouchMoveOpposite},{default:U(()=>[(_(!0),w(I,null,A(n.photos,(Y,W)=>(_(),fe(h,{key:W},{default:U(()=>[f("div",ke,[f("img",{"data-src":Y.dataSrc,class:"swiper-lazy"},null,8,Ce),We])]),_:2},1024))),128))]),_:1},8,["style","onSwiper","onClick","onTouchStart","onTouchEnd","onTouchMoveOpposite"])],64)}var je=Ee(Se,[["render",ze]]);const Be=f("h3",null,"Group 1",-1),Ne={gallery:""},Ye=["src"],$e=f("h3",null,"Group 2",-1),He={gallery:""},Le=["src"],Xe=P({props:{msg:null},setup(n){const i=x(["https://swiperjs.com/demos/images/nature-1.jpg","https://swiperjs.com/demos/images/nature-2.jpg","https://swiperjs.com/demos/images/nature-3.jpg"]),c=x(["https://swiperjs.com/demos/images/nature-4.jpg","https://swiperjs.com/demos/images/nature-5.jpg","https://swiperjs.com/demos/images/nature-6.jpg"]),g=x({el:null}),a=r=>g.value.el=r.target;return(r,h)=>(_(),w(I,null,[q(ve(je),{open:g.value},null,8,["open"]),f("h1",null,_e(n.msg),1),Be,f("div",Ne,[(_(!0),w(I,null,A(i.value,p=>(_(),w("img",{key:p,src:p,width:"200",onClick:a},null,8,Ye))),128))]),$e,f("div",He,[(_(!0),w(I,null,A(c.value,p=>(_(),w("img",{key:p,src:p,width:"200",onClick:a},null,8,Le))),128))])],64))}});const Oe=f("img",{alt:"Image Swiper",src:Te},null,-1),Me=P({setup(n){return(i,c)=>(_(),w(I,null,[Oe,q(Xe,{msg:"Image Swiper"})],64))}});be(Me).mount("#app");
