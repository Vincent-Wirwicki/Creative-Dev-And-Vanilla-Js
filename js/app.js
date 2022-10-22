const cursors = [...document.querySelectorAll(".cursor")];
const sections = [...document.querySelectorAll("section")];
const navItems = [...document.querySelectorAll("li")];
const underlines = [...document.querySelectorAll(".underline")];
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
//utils end

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
  underlines.forEach(line => (line.style.width = "0%"));
  underlines[id].style.width = "100%";
};

const updateNavItemsColor = (id, color) => {
  navItems.forEach(item => (item.style.color = "#f2ede4"));
  navItems[id].style.color = `${color}`;
};

const translateTitles = val =>
  titles.forEach((title, i) => {
    title.style.transitionDelay = `${50 * i}ms`;
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
    if (entry.intersectionRatio > 0.75) {
      updateUnderlinesWidth(currentId);
      updateNavItemsColor(currentId, color);
      scrollProgressInner.style.background = `${color}`;
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

const onCursorHover = () => {
  const { cursor } = state;
  const scaleUp = cursor.height * cursor.scale;
  const scaleDown = scaleUp / cursor.scale;
  state.cursor.isHover
    ? updateHeightWidth(cursors[0], scaleUp)
    : updateHeightWidth(cursors[0], scaleDown);
};

const onNavItemsClick = () =>
  navItems.forEach((item, i) => {
    item.addEventListener("click", () => {
      sections[i].scrollIntoView({ behavior: "smooth" });
    });
  });

const onNavItemsMouseEnter = () => {
  navItems.forEach(item => {
    item.addEventListener("mouseenter", () => (state.cursor.isHover = true));
  });
};

const onNavItemsMouseLeave = () => {
  navItems.forEach(item => {
    item.addEventListener("mouseleave", () => (state.cursor.isHover = false));
  });
};

const addEvents = () => {
  window.addEventListener("scroll", onScroll);
  window.addEventListener("mousemove", onMove);
  onNavItemsClick();
  onNavItemsMouseEnter();
  onNavItemsMouseLeave();
};
//user events  end

const app = () => {
  addEvents();
  initScroll();
  initObserver();
  raf();
};

window.addEventListener("beforeunload", () => window.scrollTo({ top: 0 }));
window.addEventListener("load", app);
