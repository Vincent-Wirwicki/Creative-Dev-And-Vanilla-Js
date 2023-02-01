const sections = [...document.querySelectorAll("section")];
const navLinksWrap = [...document.querySelectorAll(".nav__wrap__text")];
const navWraps = [...document.querySelectorAll(".nav__wrap")];
const underlines = [...document.querySelectorAll(".nav__underline")];
const images = [...document.querySelectorAll(".project__img")];
const imagesWrap = [...document.querySelectorAll(".project__wrap__img")];

const lerp = (start, end, ease) => (1 - ease) * start + ease * end;

const getMousePos = e => {
  return {
    mx: e.clientX,
    my: e.clientY,
  };
};

//create span and clone nav item 
const createNavSpan = () => {
  const navLinks = [...document.querySelectorAll(".nav__text")];
  navLinks.forEach(link => {
    const letters = link.innerText.split("");
    link.innerHTML = "";
    letters.forEach((letter, i) => {
      const span = document.createElement("span");
      span.innerText += `${letter}`;
      span.style.transitionDelay = `${i * 30}ms`;
      link.append(span);
    });
    const cloneSpan = link.cloneNode(true);
    link.parentElement.append(cloneSpan);
  });
};
//nav items number = section number to work
const onNavLinksSmothScroll = () =>
  navWraps.forEach((item, i) => {
    item.addEventListener("click", () => {
      sections[i].scrollIntoView({
        behavior: "smooth",
      });
    });
  });

const addCursorHoverClassToElem = elem =>
  Array.isArray(elem)
    ? elem.forEach(el => el.classList.add("cursor__hover"))
    : elem.classList.add("cursor__hover");

addCursorHoverClassToElem(navLinksWrap);

class Cursor {

  constructor() {
    this.cursors = [...document.querySelectorAll(".cursor")];
    this.hoverEvents = ["mouseenter", "mouseleave"];
    this.hoverElements = [...document.querySelectorAll(".cursor__hover")];
    this.isHover = false;
    this.currentX = 0;
    this.currentY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.ease = 0.075;
  }

  animate() {
    this.cursors.forEach(cursor => {
      const { height } = cursor.getBoundingClientRect();
      this.targetX = lerp(this.targetX, this.currentX, this.ease).toFixed(2);
      this.targetY = lerp(this.targetY, this.currentY, this.ease).toFixed(2);
      cursor.style.transform = `translate3d(
      ${parseFloat(this.targetX) - height / 2}px, 
      ${parseFloat(this.targetY) - height / 2}px, 0)`;
    });
  }

  onMove(e) {
    const { mx, my } = getMousePos(e);
    this.currentX = mx;
    this.currentY = my;
  }

  onHover() {
    this.isHover = !this.isHover;
    this.isHover
      ? this.cursors.forEach(cursor => cursor.classList.add("hover"))
      : this.cursors.forEach(cursor => cursor.classList.remove("hover"));
  }

  addEvents() {
    this.hoverEvents.forEach(event =>
      this.hoverElements.forEach(element =>
        element.addEventListener(event, this.onHover.bind(this))
      )
    );
  }
}

class PreLoad {
  
  constructor(){
    this.preLoadDiv = document.querySelector(".pre__load");
    this.letters = [...document.querySelectorAll(".pre__load__letter")];
    this.duration = 2100;
    this.delay = 600
  }

  fadeOut(){
    this.letters.forEach(letter => letter.classList.add('fade__out'))
    this.preLoadDiv.classList.add("fade__out")
  }

  timeout(){
    setTimeout(()=>{
      this.fadeOut();
      document.body.style.overflowY = "scroll";
    }, this.duration)
    setTimeout(() => this.preLoadDiv.remove(), this.duration + this.delay);
  }
}

class ScrollProgress {
  
  constructor(){
    this.element = document.querySelector(".scroll__progress__inner");
    this.progress = 0;
  }

  calc() {
    this.progress = 
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100 | 0;
  }

  display() {
     this.element.style.height = `${this.progress}%`;
  }

}

const updateCssClass = (items, id) => {
  items.forEach(item => item.classList.remove("active"));
  items[id].classList.add("active");
};

const options = {
  root: null,
  rootMargin: "0px",
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

//update nav items underline if section intersecting
const observeSections = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    const currentId = entry.target.id;
    if (entry.intersectionRatio >= 0.25) {
      updateCssClass(underlines, currentId);
      updateCssClass(navWraps, currentId);
      // sections[currentId].style.position = "sticky";
    } else {
      // sections[currentId].style.position = "relative";
    }
  });
}, options);

//Images from project section
// const observeImages = new IntersectionObserver(entries => {
//   entries.forEach((entry, i) => {
//     if (entry.isIntersecting) {
//       images[i].classList.add("active");
//       imagesWrap[i].classList.add("active");
//     } else {
//       images[i].classList.remove("active");
//       imagesWrap[i].classList.remove("active");
//     }
//   });
// }, options);

const initObserver = () => {
  sections.forEach(section => observeSections.observe(section));
  // imagesWrap.forEach(image => observeImages.observe(image));
};

const cursor = new Cursor();
const preLoad = new PreLoad();
const scrollProgress = new ScrollProgress();

preLoad.timeout();

const raf = () => {
  cursor.animate()
  requestAnimationFrame(raf);
};
  
const addEvents = () => {
  window.addEventListener("scroll", ()=>{
    scrollProgress.calc()
    scrollProgress.display();
  });
  window.addEventListener("mousemove", e => {
    cursor.onMove(e)
  });
  cursor.addEvents();  
};

const app = () => { 
  createNavSpan();
  onNavLinksSmothScroll();
  initObserver();
  addEvents();
  raf();
};

window.addEventListener("load", app);

// reset scroll to top page
// window.addEventListener("beforeunload", () => window.scrollTo({
//   top: 0
// }));


//if i need some stuff about scroll direction
// direction: {
//   up: false,
//   down: false,
// },
// const onWheel = e => {
//   getScrollDirection(e);
// };
// const getScrollDirection = e => {
//   let dir = e.deltaY;
//   const { scroll } = state;
//   const { direction } = scroll;
//   if (dir > 0) {
//     direction.down = true;
//     direction.up = false;
//   } else {
//     direction.down = false;
//     direction.up = true;
//   }
// };
// window.addEventListener("wheel", onWheel);



// cursor.app();