const cursors = [...document.querySelectorAll(".cursor")];
const sections = [...document.querySelectorAll("section")];
const navLinks = [...document.querySelectorAll(".nav__text")];
const navLinksWrap = [...document.querySelectorAll(".nav__wrap__text")];
const navWraps = [...document.querySelectorAll(".nav__wrap")];
const underlines = [...document.querySelectorAll(".nav__underline")];
const scrollProgressInner = document.querySelector(".scroll__progress__inner");
const preLoadText =
  "This page is about animation and having fun with vanilla javscript";
const preLoadTitle = document.querySelector(".pre__load__text");
const images = [...document.querySelectorAll(".project__img")];
const imagesWrap = [...document.querySelectorAll(".project__wrap__img")];
// let step = 0;
let test = 0;
const state = {
  cursor: {
    current: {
      x: 0,
      y: 0,
    },
    target: {
      x: 0,
      y: 0,
    },
    isHover: false,
  },
  preLoad: {
    text: {
      length: preLoadText.split(" ").length,
      tick: 300,
    },
    isComplet: false,
  },
  scroll: {
    current: 0,
    target: 0,
    progress: 0,
  },
  ease: 0.075,
};

const lerp = (start, end, ease) => (1 - ease) * start + ease * end;

const getMousePos = e => {
  return {
    mx: e.clientX,
    my: e.clientY,
  };
};

const getScrollProgress = () => {
  state.scroll.progress =
    ((window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100) |
    0;
};

const preLoadDisplayText = x => {
  const words = preLoadText.split(" ");
  if (x > state.preLoad.text.length) {
    preLoadTitle.innerText = "";
    return;
  }
  setTimeout(() => {
    x++;
    preLoadTitle.innerText = words[x - 1];
    preLoadDisplayText(x);
  }, state.preLoad.text.tick);
};

const onPreLoad = () => {
  document.body.style.overflowY = "hidden";
  const preLoadDiv = document.querySelector(".pre__load");
  const {
    preLoad: {
      text: {
        tick,
        length
      },
    },
  } = state;
  preLoadDisplayText(0);
  // preLoadTimer();
  setTimeout(() => {
    preLoadDiv.classList.add("fade__out");
    document.body.style.overflowY = "scroll";
    state.preLoad.isComplet = true;
    setTimeout(() => {
      //init first animation with observer
      window.scrollTo({
        top: 5
      });
      preLoadDiv.remove();
    }, tick);
  }, tick * (length + 1) + tick);
};

//clone nav item
const createSpan = () => {
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

// const updateCursorsHeightWidth = (r, opacity) => {
//   cursors[0].style.height = `${r}px`;
//   cursors[0].style.width = `${r}px`;
//   cursors[1].style.opacity = `${opacity}`;
// };

// const updateCursors

// const onCursorHover = () => {
//   state.cursor.isHover ?
//     updateCursorsHeightWidth(40, 0) :
//     updateCursorsHeightWidth(10, 1);
// };

const onCursorHover = () => {
  state.cursor.isHover
    ? (cursors[1].style.background = "#f2ede4")
    : (cursors[1].style.background = "none");
};

const onCursorHoverState = () => {
  const {
    cursor
  } = state;
  cursor.isHover = !cursor.isHover;
};

const onCursorHoverElem = elem => {
  const events = ["mouseenter", "mouseleave"];
  if (Array.isArray(elem)) {
    elem.forEach(el => {
      events.forEach(event => el.addEventListener(event, onCursorHoverState));
    });
  } else {
    events.forEach(event => elem.addEventListener(event, onCursorHoverState));
  }
};

const onCursorEvents = () => {
  onCursorHoverElem(navWraps);
  onCursorHoverElem(images);
};

const updateCursors = () => {
  cursors.forEach(cursor => {
    const {
      height
    } = cursor.getBoundingClientRect();
    const {
      cursor: c,
      ease
    } = state;
    c.current.x = parseFloat(lerp(c.current.x, c.target.x, ease).toFixed(2));
    c.current.y = parseFloat(lerp(c.current.y, c.target.y, ease).toFixed(2));
    cursor.style.transform = `translate3d(
    ${c.current.x - height / 2}px, 
    ${c.current.y - height / 2}px, 0)`;
  });
};

// const translateTitles = val =>
//   titles.forEach((title, i) => {
//     title.style.transitionDelay = `${30 * i}ms`;
//     title.style.transform = `translateY(${-val}%)`;
//   });

const raf = () => {
  updateCursors();
  // testRaf();
  onCursorHover();
  requestAnimationFrame(raf);
};

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
    // const color = colors[currentId];
    if (entry.intersectionRatio >= 0.25) {
      updateCssClass(underlines, currentId);
      updateCssClass(navLinksWrap, currentId);
      sections[currentId].style.position = "sticky";
    } else {
      sections[currentId].style.position = "relative";
    }
  });
}, options);

//Images from project section
const observeImages = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      images[i].classList.add("active");
      imagesWrap[i].classList.add("active");
    } else {
      images[i].classList.remove("active");
      imagesWrap[i].classList.remove("active");
    }
  });
}, options);

const initObserver = () => {
  sections.forEach(section => observeSections.observe(section));
  imagesWrap.forEach(image => observeImages.observe(image));
};

const onMove = e => {
  const {
    cursor
  } = state;
  const {
    mx,
    my
  } = getMousePos(e);
  cursor.target.x = mx;
  cursor.target.y = my;
};

const onScroll = () => {
  getScrollProgress();
  scrollProgressInner.style.width = `${state.scroll.progress}%`;
};

const onNavLinksSmothScroll = () =>
  navWraps.forEach((item, i) => {
    item.addEventListener("click", () => {
      sections[i].scrollIntoView({
        behavior: "smooth"
      });
    });
  });

const addEvents = () => {
  window.addEventListener("scroll", onScroll);
  window.addEventListener("mousemove", onMove);
  onCursorEvents();
};

const app = () => {
  onPreLoad();
  addEvents();
  onNavLinksSmothScroll();
  createSpan();
  initObserver();
  raf();
};

// reset scroll to top page
window.addEventListener("beforeunload", () => window.scrollTo({
  top: 0
}));
window.addEventListener("load", app);

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
