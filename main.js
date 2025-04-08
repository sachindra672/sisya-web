window.addEventListener("DOMContentLoaded", () => {
  // Nav animation
  gsap.from(".logo", { y: -50, duration: 0.3, opacity: 0 });
  gsap.from(".nav-actions ul li", {
    y: -50,
    duration: 0.3,
    opacity: 0,
    stagger: 0.1,
  });

  gsap.from(".mobile-menu", {
    y: -50,
    duration: 0.3,
    opacity: 0,
  });

  const tlSidebar = gsap.timeline({ paused: true });
  tlSidebar.to(".sidebar", { right: 0, duration: 0.5, ease: "power2.out" });
  tlSidebar.from(
    ".sidebar ul li",
    {
      x: 150,
      duration: 0.4,
      stagger: 0.1,
      opacity: 0,
    },
    "-=0.3"
  );

  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const sidebar = document.querySelector(".sidebar");
  let sidebarOpen = false;

  // opening of sidebar
  hamburgerIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebarOpen ? tlSidebar.reverse() : tlSidebar.play();
    sidebarOpen = !sidebarOpen;
  });

  // closing of sidebar
  document.addEventListener("click", (e) => {
    if (
      sidebarOpen &&
      !sidebar.contains(e.target) &&
      !hamburgerIcon.contains(e.target)
    ) {
      tlSidebar.reverse();
      sidebarOpen = false;
    }
  });

  // Carousel styling
  const carousel = document.querySelector(".carousel");
  const container = document.querySelector(".carousel-container");
  const images = carousel.querySelectorAll("img");
  const dotsContainer = document.createElement("div");
  dotsContainer.classList.add("carousel-dots");
  container.appendChild(dotsContainer);

  const firstSlide = images[0].cloneNode(true);
  carousel.appendChild(firstSlide);

  const slides = carousel.querySelectorAll("img");
  const totalSlides = slides.length;
  let index = 0;
  let slideWidth = 0;
  let isTransitioning = false;
  let interval;

  slides.forEach((_, i) => {
    if (i < totalSlides - 1) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    }
  });

  // creating dots for the crousel
  const dots = dotsContainer.querySelectorAll(".dot");

  function updateSlideWidth() {
    slideWidth = carousel.querySelector("img").clientWidth;
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index % (totalSlides - 1));
    });
  }

  function goToSlide(i) {
    isTransitioning = true;
    gsap.to(carousel, {
      x: -i * slideWidth,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        isTransitioning = false;
        if (i === totalSlides - 1) {
          gsap.set(carousel, { x: 0 });
          index = 0;
        }
        updateDots();
      },
    });
  }

  function startAutoPlay() {
    interval = setInterval(() => {
      if (!isTransitioning) {
        index++;
        goToSlide(index);
      }
    }, 3000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  // Swipe detection (for crousel in mobile view)
  let startX = 0;
  container.addEventListener("touchstart", (e) => {
    stopAutoPlay();
    startX = e.touches[0].clientX;
  });

  container.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 50 && !isTransitioning) {
      if (diff < 0) index++; // swipe left
      else index = index === 0 ? totalSlides - 2 : index - 1; // swipe right
      goToSlide(index);
    }

    startAutoPlay();
  });

  // Pause on hover (desktop only)
  container.addEventListener("mouseenter", stopAutoPlay);
  container.addEventListener("mouseleave", startAutoPlay);

  window.addEventListener("resize", updateSlideWidth);

  function initCarousel() {
    updateSlideWidth();
    gsap.set(carousel, { x: 0 });
    startAutoPlay();
  }

  // Ensure images loaded
  const preloadImages = () => {
    const imgs = Array.from(slides);
    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length) initCarousel();
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === imgs.length) initCarousel();
        };
      }
    });
  };

  preloadImages();

  gsap.from(".stat-item", {
    x: -300,
    duration: 1,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".stats-section .stats-container .stat-item",
      scroller: "body",
      markers: true,
      start: "top 90%",
      end: "top 75%",
      scrub: 3,
    },
  });

  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const currentlyActive = document.querySelector(
        ".accordion-header.active"
      );
      if (currentlyActive && currentlyActive !== header) {
        currentlyActive.classList.remove("active");
        const openContent = currentlyActive.nextElementSibling;
        openContent.classList.remove("open");
        openContent.style.maxHeight = null;
      }

      header.classList.toggle("active");
      const content = header.nextElementSibling;
      content.classList.toggle("open");

      if (content.classList.contains("open")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });
});
