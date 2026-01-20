$(function () {
  //Mauszeiger
  const cursor = document.getElementById("cursor");
  const cursorBallBig = document.querySelector(".circle-big");
  const cursorBallSmall = document.querySelector(".circle-small");

  let posS = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let posB = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let mouse = { x: posS.x, y: posS.y };
  const speed = 0.1;
  let fpms = 60 / 1000;

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  const xSetBallSmall = gsap.quickSetter(cursorBallSmall, "x", "px");
  const ySetBallSmall = gsap.quickSetter(cursorBallSmall, "y", "px");
  const xSetBallBig = gsap.quickSetter(cursorBallBig, "x", "px");
  const ySetBallBig = gsap.quickSetter(cursorBallBig, "y", "px");

  gsap.ticker.add((time, deltaTime) => {
    let delta = deltaTime * fpms;
    let dt = 1.0 - Math.pow(1.0 - speed, delta);

    posS.x += mouse.x - posS.x;
    posS.y += mouse.y - posS.y;
    posB.x += (mouse.x - posB.x) * dt;
    posB.y += (mouse.y - posB.y) * dt;
    xSetBallSmall(posS.x);
    ySetBallSmall(posS.y);
    xSetBallBig(posB.x);
    ySetBallBig(posB.y);
  });

  const hoverTargets = document.querySelectorAll(".hover-target");

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorBallBig.classList.add("hovered");
    });

    target.addEventListener("mouseleave", () => {
      cursorBallBig.classList.remove("hovered");
    });

    target.addEventListener("mousedown", () => {
      cursorBallBig.classList.add("clicked");
    });

    target.addEventListener("mouseup", () => {
      cursorBallBig.classList.remove("clicked");
    });
  });

  gsap.registerPlugin(SplitText);
  document.fonts.ready.then(() => {
    document
      .querySelectorAll("#wrapper h1,#wrapper .highlight-small")
      .forEach((h1) => {
        let split = SplitText.create(h1, { type: "chars, words" });
        gsap.set(h1, { opacity: 1 });
        gsap.from(split.chars, {
          scrollTrigger: {
            trigger: h1,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "restart reverse restart reverse",
          },
          y: 20,
          autoAlpha: 0,
          stagger: 0.05,
          ease: "power2.out",
          duration: 1,
          //smartWrap: true,
        });
      });
  });
  /*
        gsap.set(".overlay-logo", { opacity: 1 });
        gsap.from(".overlay-logo", {
            autoAlpha: 0,
            duration: 1,
            scale: 0,  
        });
        */

  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".table .table-cell.background-image", {
    scrollTrigger: {
      trigger: ".table .table-cell.background-image",
      start: "top bottom",
      end: "bottom top",
      toggleActions: "restart reverse restart reverse",
      scrub: 3,
    },
    y: -60,
    duration: 1,
    ease: "power2.out",
  });

  gsap.from(".margin-image", {
    scrollTrigger: {
      trigger: ".margin-image",
      start: "top bottom",
      end: "bottom top",
      toggleActions: "restart reverse restart reverse",
      scrub: 3,
    },
    y: -60,
    duration: 1,
    ease: "power2.out",
  });

  if (!ScrollTrigger.isTouch && window.innerWidth >= 767) {
    gsap.utils.toArray(".highlight").forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          toggleActions: "restart pause reverse pause",
          start: "top bottom",
          end: "bottom top",
          scrub: 3,
        },
        x: -60,
        duration: 3,
      });
    });

    /*
            gsap.registerPlugin(ScrollSmoother);
            const smoother = ScrollSmoother.create({
                smooth: 2,
                effects: true,
                normalizeScroll: true,
            });
            */
  }
});
