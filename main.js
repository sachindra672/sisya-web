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

  gsap.registerPlugin(TextPlugin);

  const revealLines = document.querySelectorAll(".text-block .reveal-line");

  revealLines.forEach((line, index) => {
    const fullText = line.innerHTML;
    line.innerHTML = "&nbsp;";

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl.to(line, {
      duration: 3,
      text: {
        value: fullText,
        delimiter: "",
      },
      ease: "none",
      autoAlpha: 1,
    }).to(line, {
      duration: 2,
      delay: 2,
      text: {
        value: "",
        delimiter: "",
      },
      ease: "none",
    });
  });

  gsap.from(".cta-btn", {
    opacity: 0,
    scale: 0.85,
    duration: 1,
    ease: "back.out(1.7)",
    delay: revealLines.length * 2.5,
  });

  gsap.from(".hero-image", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    delay: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top 70%",
      scrub: 3,
    },
  });

  gsap.from(".stat-item", {
    x: -300,
    duration: 1,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".stats-section .stats-container .stat-item",
      scroller: "body",
      start: "top 90%",
      end: "top 75%",
      scrub: 3,
    },
  });

  gsap.from(".features-header h2", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".features-header",
      start: "top 80%",
      end: "top 60%",
      toggleActions: "play none none none",
      scrub: true,
      // markers: true,
    },
  });

  // gsap.from(".feature-card", {
  //   y: -600,
  //   opacity: 0,
  //   duration: 1.2,
  //   stagger: 0.2,
  //   ease: "power3.out",
  //   scrollTrigger: {
  //     trigger: ".features-container .feature-card",
  //     start: "top 85%",
  //     end: "top 50%",
  //     toggleActions: "play none none none",
  //     scrub: true,
  //     // markers: true,
  //   },
  // });

  gsap.from(".offer-container .image-container-desk", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".offer-section",
      start: "top 85%",
      end: "top 60%",
      toggleActions: "play none none none",
      markers: false,
      scrub: true,
    },
  });

  gsap.from(".offer-content h2", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".offer-section",
      start: "top 85%",
      end: "top 70%",
      toggleActions: "play none none none",
      scrub: true,
    },
  });

  gsap.from(".offer", {
    x: -200,
    y: 100,
    opacity: 0,
    rotation: -20,
    duration: 1.3,
    ease: "back.out(1.7)",
    stagger: 0.25,
    scrollTrigger: {
      trigger: ".offer-section",
      start: "top 80%",
      end: "top 60%",
      toggleActions: "play none none none",
      markers: false,
      scrub: true,
    },
  });

  gsap.from(".image-container-mob img", {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".image-container-mob",
      start: "top 90%",
      end: "top 70%",
      toggleActions: "play none none none",
    },
  });

  gsap.from(".video-box", {
    x: -100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".course-promo",
      start: "top 80%",
      end: "top 50%",
      toggleActions: "play none none none",
      scrub: true,
      // markers: true,
    },
  });

  gsap.from(".content-box > *", {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".course-promo",
      start: "top 80%",
      end: "top 50%",
      toggleActions: "play none none none",
      scrub: true,
      // markers: true,
    },
  });

  gsap.from(".faculty-section h2, .faculty-section .subheading", {
    x: -1000,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".faculty-section",
      start: "top 80%",
      end: "top 80%",
      toggleActions: "play none none none",
      // markers: true,
      scrub: 3,
    },
  });

  const cards = document.querySelectorAll(".faculty-card");

  cards.forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "left 95%",
        end: "left 90%",
        scrub: true,
        horizontal: true,
        // markers: true,
        scroller: ".faculty-carousel",
      },
      x: 80,
      scaleY: 0,
      transformOrigin: "top center",
      opacity: 0,
      delay: 1,
      duration: 2,
      ease: "power2.out",
    });
  });

  gsap.from(".factor-card", {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".factor-container",
      start: "top 80%",
      end: "top 40%",
      toggleActions: "play none none none",
      scrub: 3,
    },
  });

  gsap.from(".factor-section h2", {
    opacity: 0,
    y: -30,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".factor-section h2",
      start: "top 90%",
      toggleActions: "play none none none",
      scrub: 3,
    },
  });

  gsap.from(".coming-next-section h2", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".coming-next-section",
      start: "top 80%",
      end: "top 60%",
      toggleActions: "play none none none",
      scrub: true,
      // markers: true,
    },
  });

  gsap.from(".coming-next-section .video-placeholder", {
    x: -800,
    scale: 0.5,
    opacity: 0,
    duration: 2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".coming-next-section",
      start: "top 80%",
      end: "top 60%",
      toggleActions: "play none none none",
      scrub: true,
      // markers: true,
    },
  });

  gsap.from(".testimonial-section h2, .testimonial-section p", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".testimonial-section",
      start: "top 80%",
      end: "top 60%",
      toggleActions: "play none none none",
      scrub: true,
      markers: true,
    },
  });

  // gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
  //   gsap.from(card, {
  //     opacity: 0,
  //     y: 50,
  //     duration: 0.8,
  //     delay: index * 0.1, // Stagger effect
  //     scrollTrigger: {
  //       trigger: card,
  //       start: "top 90%",
  //       toggleActions: "play none none none",
  //     },
  //   });
  // });

  const testimonials = document.querySelectorAll(".testimonial-card");

  testimonials.forEach((testimonial) => {
    gsap.from(testimonial, {
      scrollTrigger: {
        trigger: testimonial,
        start: "left 95%",
        end: "left 90%",
        scrub: true,
        horizontal: true,
        markers: true,
        scroller: ".testimonial-wrapper",
      },
      x: 80,
      scaleY: 0,
      transformOrigin: "bottom left",
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  });

  // const testimonials = document.querySelectorAll(".testimonial-card");

  // testimonials.forEach((testimonial, index) => {
  //   // Vertical scroll trigger (staggered reveal on scroll into view)
  //   gsap.from(testimonial, {
  //     opacity: 0,
  //     y: 50,
  //     duration: 0.8,
  //     delay: index * 0.1,
  //     scrollTrigger: {
  //       trigger: testimonial,
  //       start: "top 90%",
  //       toggleActions: "play none none none",
  //     },
  //   });

  //   // Horizontal scroll scrub animation
  //   gsap.from(testimonial, {
  //     scrollTrigger: {
  //       trigger: testimonial,
  //       start: "left 95%",
  //       end: "left 90%",
  //       scrub: true,
  //       horizontal: true,
  //       markers: true,
  //       scroller: ".testimonial-wrapper",
  //     },
  //     x: 80,
  //     scaleY: 0,
  //     transformOrigin: "bottom left",
  //     opacity: 0,
  //     duration: 1,
  //     ease: "power2.out",
  //   });
  // });

  gsap.from(".download-app-text > *", {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".download-app-section",
      start: "top 80%",
      end: "top 85%",
      toggleActions: "play none none none",
      scrub: true,
    },
  });

  gsap.from(".download-app-image img", {
    opacity: 0,
    scale: 0.8,
    x: 100,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".download-app-section",
      start: "top 80%",
      toggleActions: "play none none none",
      // scrub: true,
    },
    onComplete: () => {
      gsap.set(".download-app-image img", { clearProps: "transform" });
    },
  });

  gsap.from(".awards-title", {
    scrollTrigger: {
      trigger: ".awards-section",
      start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".award", {
    scrollTrigger: {
      trigger: ".awards-section",
      start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
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
        const maxVisibleHeight = 400;
        // content.style.maxHeight =
          // Math.min(content.scrollHeight, maxVisibleHeight) + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });
});
