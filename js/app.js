const cursors = [...document.querySelectorAll(".cursor")];
const sections = [...document.querySelectorAll("section")];
const navItems = [...document.querySelectorAll(".nav__text")];
const navWraps = [...document.querySelectorAll(".nav__wrap")];
const underlines = [...document.querySelectorAll(".nav__underline")];
const titles = [...document.querySelectorAll("h3")];
const scrollProgressInner = document.querySelector(".scroll__progress__inner");
const colors = ["#f28080", "#a4d955", "#f2d852", "#18d9d9"];

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
    height: cursors[0].getBoundingClientRect().height,
    isHover: false,
    scale: 4,
  },
  scroll: {
    direction: {
      up: false,
      down: false,
    },
    current: 0,
    target: 0,
    progress: 0,
  },
  ease: 0.075,
};

//utils start
const lerp = (start, end, ease) => (1 - ease) * start + ease * end;

const getMousePos = e => {
  return {
    mx: e.clientX,
    my: e.clientY,
  };
};

const getScrollProgress = () => {
  const { scroll } = state;
  scroll.progress =
    ((window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100) |
    0;
};

const getScrollDirection = e => {
  let dir = e.deltaY;
  const { scroll } = state;
  const { direction } = scroll;
  if (dir > 0) {
    direction.down = true;
    direction.up = false;
  } else {
    direction.down = false;
    direction.up = true;
  }
};

//utils end
const createSpan = () => {
  navItems.forEach(item => {
    const letters = item.innerText.split("");
    item.innerHTML = "";
    letters.forEach((letter, i) => {
      const span = document.createElement("span");
      span.innerText += `${letter}`;
      span.style.transitionDelay = `${i * 30}ms`;
      item.append(span);
    });
    let cloneSpan = item.cloneNode(true);
    // cloneSpan.classList.add("nav__text");
    item.parentElement.append(cloneSpan);
  });
};
// update and animation start
const updateHeightWidth = (element, value) => {
  element.style.height = `${value}px`;
  element.style.width = `${value}px`;
};

const updateCursors = () => {
  cursors.forEach(cursor => {
    const { height, width } = cursor.getBoundingClientRect();
    const { cursor: c, ease } = state;
    c.current.x = lerp(c.current.x, c.target.x, ease);
    c.current.y = lerp(c.current.y, c.target.y, ease);
    cursor.style.transform = `translate3d(
    ${c.current.x - width / 2}px, 
    ${c.current.y - height / 2}px, 0)`;
  });
};

const updateUnderlinesWidth = id => {
  const { scroll } = state;
  underlines.forEach(line => (line.style.clipPath = "inset(0 100% 0 0)"));
  underlines[id].style.clipPath = "inset(0 0 0 0)";
};

const updateNavItemsOpacity = id => {
  navWraps.forEach(item => (item.style.opacity = 0.75));
  navWraps[id].style.opacity = 1;
};

const translateTitles = val =>
  titles.forEach((title, i) => {
    title.style.transitionDelay = `${30 * i}ms`;
    title.style.transform = `translateY(${-val}%)`;
  });

const raf = () => {
  updateCursors();
  onCursorHover();
  requestAnimationFrame(raf);
};

const options = {
  root: null,
  rootMargin: "0px",
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

const observeSections = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const currentId = entry.target.id;
    const color = colors[currentId];
    if (entry.intersectionRatio >= 0.25) {
      // updateUnderlinesWidth(currentId);
      underlines.forEach(
        line => (line.style.clipPath = "inset(0 100% 0 100%)")
      );
      underlines[currentId].style.clipPath = "inset(0 0 0 0)";
      updateNavItemsOpacity(currentId);
      // scrollProgressInner.style.background = `${color}`;
    }

    entry.isIntersecting && currentId === "0"
      ? translateTitles(0)
      : translateTitles(100);
  });
}, options);
// update and animation end

//on load events start
const initObserver = () =>
  sections.forEach(section => observeSections.observe(section));
//small scroll to trigger observer
const initScroll = () =>
  setTimeout(() => {
    window.scrollTo({ top: 10 });
  }, 300);
//on load events end

//user events start
const onMove = e => {
  const { cursor } = state;
  const { mx, my } = getMousePos(e);
  cursor.target.x = mx;
  cursor.target.y = my;
};

const onScroll = () => {
  getScrollProgress();
  scrollProgressInner.style.width = `${state.scroll.progress}%`;
};

const onWheel = e => {
  getScrollDirection(e);
};

const onCursorHover = () => {
  const { cursor } = state;
  const scaleUp = cursor.height * cursor.scale;
  const scaleDown = scaleUp / cursor.scale;
  cursor.isHover
    ? updateHeightWidth(cursors[0], scaleUp)
    : updateHeightWidth(cursors[0], scaleDown);
};

const onNavItemsClick = () =>
  navWraps.forEach((item, i) => {
    item.addEventListener("click", () => {
      sections[i].scrollIntoView({ behavior: "smooth" });
    });
  });

const onNavItemsMouseEnter = () =>
  navWraps.forEach(item => {
    item.addEventListener("mouseenter", () => (state.cursor.isHover = true));
  });

const onNavItemsMouseLeave = () =>
  navWraps.forEach(item => {
    item.addEventListener("mouseleave", () => (state.cursor.isHover = false));
  });

const addEvents = () => {
  window.addEventListener("scroll", onScroll);
  window.addEventListener("wheel", onWheel);
  window.addEventListener("mousemove", onMove);
  onNavItemsClick();
  onNavItemsMouseEnter();
  onNavItemsMouseLeave();
};
//user events  end

const app = () => {
  addEvents();
  createSpan();
  initScroll();
  initObserver();
  raf();
  // console.log(navItems[3].innerText.lenght);
};

window.addEventListener("beforeunload", () => window.scrollTo({ top: 0 }));
window.addEventListener("load", app);
