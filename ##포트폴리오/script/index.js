// var $html = $("html");
// var page = 1;
// var lastPage = $(".content").length;

// $html.animate({
//   scrollTop: 0
// });

// $(window).on("wheel", function (e) {

//       if ($html.is(":animated")) return;

//       if (e.originalEvent.deltaY > 0) {
//         if (page == lastPage) return;

//         page++;
//       } else if (e.originalEvent.deltaY < 0) {
//         if (page == 1) return;

//         page--;
//       }
//       var posTop = (page - 1) * $(window).height();

//       $html.animate({
//         scrollTop: posTop
//       });







"use strict"
window.l = console.log
let canvas = document.getElementById("mainCanvas")
const resizeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  console.log("resize")
}
resizeCanvas()
window.addEventListener("resize", resizeCanvas)

let imgs = []

function genLeaf(opacity = 0.3, color = "f55593") {
  let index = imgs.push(new Image()) - 1
  imgs[index].src = `data:image/svg+xml,%3Csvg id='leaf' width='45' height='45' style="opacity:${opacity}" viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath style='opacity:1;fill:%23${color};fill-opacity:1;stroke:%23${color};stroke-width:.3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M53.1 58.9s-9.3 13.2.5 14.7c9.7 1.4 8.8-6.3 8.8-6.3s.4-1-3.7-8.1z' transform='translate(-116.8 -116.3) scale(3.15017)'%3E%3C/path%3E%3Cpath style='fill:%23${color};fill-opacity:1;stroke:%23${color};stroke-width:.3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M53.5 53.3s-13.3-9.3-14.8.5c-1.4 9.7 6.3 8.8 6.3 8.8s1.1 0 8.1-3.7z' transform='translate(-116.8 -116.3) scale(3.15017)'%3E%3C/path%3E%3Cpath style='fill:%23${color};fill-opacity:1;stroke:%23${color};stroke-width:.3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M59 53.6s9.3-13.2-.5-14.7c-9.7-1.4-8.7 6.3-8.7 6.3s-.8 1 3.7 8.1zM58.7 59.2s13.2 9.3 14.7-.5C74.8 49 67 50 67 50s-1-.7-8.1 3.7z' transform='translate(-116.8 -116.3) scale(3.15017)'%3E%3C/path%3E%3Cpath style='opacity:1;fill:%23${color};fill-opacity:1;stroke:%23${color};stroke-width:.331228;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M53.2 53h6v6.1h-6z' transform='translate(-116.8 -116.3) scale(3.15017)'%3E%3C/path%3E%3C/svg%3E`
  return new Promise(resolve => {
    imgs[index].onload = () => resolve(index)
  })
}
let cursor = [0, 0, 0]
window.addEventListener('mousemove', e => {
  cursor[0] = e.clientX
  cursor[1] = e.clientY
})
window.onmousedown = () => {
  cursor[2] = 1
}
window.onmouseup = () => {
  cursor[2] = 0;
}
class Leaf {
  constructor(ctx, img, env, index) {
    this.img = img
    this.ctx = ctx
    this.vx = Math.random() * 1.3
    this.vy = -(Math.random() * 1.3)
    this.isImgIndex = !isNaN(this.img)
    this.size = 100 * (Math.random() + 0.3);
    this.x = -(this.size + 20 + (Math.random() * 100))
    this.y = canvas.height + this.size + Math.random() * 20
    this.env = env
    this.index = index
    this.ax = 1
    this.ay = 1
  }

  update() {
    if (cursor[2] && this.y < cursor[1] + 60 && this.y > cursor[1] - 60) {
      this.ax = 1.1
    } else if (this.ax != 1) {
      this.ax = 1
    }
    this.vx *= this.ax
    this.vy *= this.ay
    this.x += this.vx
    this.y += this.vy
    if (this.x > canvas.width || this.y < 0 - this.size - 20) {
      this.env[this.index] = new Leaf(this.ctx, 0, this.env, this.index)
    }
  }
  render() {
    this.update()
    this.ctx.drawImage(this.isImgIndex ? imgs[this.img] : this.img, this.x, this.y, this.size, this.size)
  }
}

function main() {
  let ctx = canvas.getContext('2d')
  Promise.all([genLeaf()]).then(() => {
    l(ctx)
    let leafs = []
    for (let i = 0; i < 130; i++) {
      leafs.push(new Leaf(ctx, 0, leafs, leafs.length))
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      leafs.forEach(item => item.render())
      requestAnimationFrame(animate)
    }
    animate()
  })
}
main()


// -----------------------------------------------

const cursorParent = document.getElementById('mouse-cursor')
const cursorChild = cursorParent.children[0]
window.addEventListener('mousemove', mousemove)
window.addEventListener('mousedown', mousedown)
window.addEventListener('mouseup', mouseup)

let scale = 1
let stage = ''
let carouselDirection = ''
let cursorX = 0,
  cursorY = 0

function mousemove(e) {
  cursorX = e.pageX - cursorParent.offsetWidth / 2
  cursorY = e.pageY - cursorParent.offsetHeight / 2
  cursorParent.style.transform =
    `translate3d(${cursorX}px, ${cursorY}px, 0)`

  switch (e.target.getAttribute('data-cursor')) {
    case 'carousel':
      carouselDirection = cursorX < innerWidth / 2 ? '방문해주셔서' : '감사합니다'
      cursorChild.setAttribute('data-name', carouselDirection)
      if (stage === 'carousel') return
      scale = 4
      stage = 'carousel'
      cursorParent.className = 'cursor-text-mode'
      break
    case 'Scroll-down':
      if (stage === 'Scroll-down') return
      scale = 3
      stage = 'Scroll-down'
      cursorChild.setAttribute('data-name', e.target.getAttribute('data-name'))
      cursorParent.className = 'cursor-text-mode'
      break
    case 'img':
      if (stage === 'img') return
      scale = 1
      stage = 'img'
      cursorChild.setAttribute('data-name', '')
      cursorParent.className = ''
      break


    default:
      if (stage === '') return
      scale = 1
      stage = ''
      cursorChild.setAttribute('data-name', '')
      cursorParent.className = ''
      break

  }
  cursorChild.style.setProperty('--cursor-scale', scale)
}

function mousedown(e) {
  scale *= 0.8
  cursorChild.style.setProperty('--cursor-scale', scale)
}

function mouseup(e) {
  scale *= 1.25
  cursorChild.style.setProperty('--cursor-scale', scale)
}

// --------------------------------------------------------------



const nava = document.querySelectorAll('.nava')
const contents = document.querySelectorAll('.content')
const firstTop = contents[0].offsetTop
const secondTop = contents[1].offsetTop
const thirdTop = contents[2].offsetTop
const fourthop = contents[3].offsetTop
const fifthTop = contents[4].offsetTop


nava[0].onclick = function () {
  window.scroll({
    top: firstTop,
    behavior: 'smooth',


  })
  return false
}

nava[1].onclick = function () {
  window.scroll({
    top: secondTop,
    behavior: 'smooth',
   
  })
  return false
}

nava[2].onclick = function () {
  window.scroll({
    top: thirdTop,
    behavior: 'smooth',
  
  })
  return false
}

nava[3].onclick = function () {
  window.scroll({
    top: fourthop,
    behavior: 'smooth',
  
  })
  return false
}

nava[4].onclick = function () {
  window.scroll({
    top: fifthTop,
    behavior: 'smooth',

  })
  return false
}

nava[5].onclick = function () {
  window.scroll({
    top: sixthTop,
    behavior: 'smooth',

  })
  return false;
}

// ----------------------------------------

// ------------------------------------------------