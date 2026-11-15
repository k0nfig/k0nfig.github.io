{
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const activeAnimations = new Set();
  const motionSystems = document.querySelector("[data-systems]");
  const diagramAnimations = [];
  const hoverDelay = 250;
  let hoveredStage = null;
  let hoverTimer;

  function animateElement(element, frames, options) {
    if (motionPreference.matches || !element.animate) return;

    const animation = element.animate(frames, options);
    activeAnimations.add(animation);
    animation.addEventListener("finish", () => activeAnimations.delete(animation));
    animation.addEventListener("cancel", () => activeAnimations.delete(animation));
    return animation;
  }

  function resetDiagram() {
    window.clearTimeout(hoverTimer);
    hoveredStage?.classList.remove("is-hovered");
    hoveredStage = null;
    diagramAnimations.forEach((animation) => animation.cancel());
    diagramAnimations.length = 0;
  }

  function animateDiagram(diagram, packets) {
    const cycleStart = document.timeline.currentTime;
    function addCycle(element, frames) {
      const animation = animateElement(element, frames, {
        duration: 4800,
        iterations: Infinity,
        easing: "linear",
      });
      if (!animation) return;
      animation.startTime = cycleStart;
      diagramAnimations.push(animation);
    }

    packets.forEach((packet) => {
      packet.style.offsetPath = `path("${packet.dataset.route}")`;
      const output = packet.dataset.phase === "output";
      const start = output ? 0.62 : 0;
      const end = output ? 0.89 : 0.28;
      const frames = [{ offsetDistance: "0%", opacity: 0, offset: 0 }];
      if (start > 0) frames.push({ offsetDistance: "0%", opacity: 0, offset: start });
      frames.push(
        { offsetDistance: "8%", opacity: 1, offset: start + (end - start) * 0.08 },
        { offsetDistance: "96%", opacity: 1, offset: start + (end - start) * 0.96 },
        { offsetDistance: "100%", opacity: 0, offset: end },
        { offsetDistance: "100%", opacity: 0, offset: 1 }
      );
      addCycle(packet, frames);
    });

    // Only the processor glows, between the inbound and outbound packets.
    const quietGlow = "drop-shadow(0px 0px 0px rgba(217, 247, 147, 0))";
    const processingGlow = "drop-shadow(0px 0px 7px rgba(217, 247, 147, 0.65))";
    addCycle(diagram.querySelector(".map-core"), [
      { filter: quietGlow, offset: 0 },
      { filter: quietGlow, offset: 0.29 },
      { filter: processingGlow, offset: 0.36 },
      { filter: processingGlow, offset: 0.52 },
      { filter: quietGlow, offset: 0.62 },
      { filter: quietGlow, offset: 1 },
    ]);
    addCycle(diagram.querySelector(".core-fill"), [
      { fill: "#252e20", stroke: "#c4e78b", offset: 0 },
      { fill: "#252e20", stroke: "#c4e78b", offset: 0.29 },
      { fill: "#3b5027", stroke: "#efffc7", offset: 0.36 },
      { fill: "#3b5027", stroke: "#efffc7", offset: 0.52 },
      { fill: "#252e20", stroke: "#c4e78b", offset: 0.62 },
      { fill: "#252e20", stroke: "#c4e78b", offset: 1 },
    ]);
  }

  if (motionSystems) {
    motionSystems.querySelectorAll(".system-stage").forEach((stage) => {
      const diagram = stage.querySelector("svg");
      const packets = diagram.querySelectorAll("[data-route]");
      if (!packets.length) return;

      stage.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;
        resetDiagram();
        hoveredStage = stage;
        stage.classList.add("is-hovered");
        if (motionPreference.matches || document.hidden) return;

        hoverTimer = window.setTimeout(() => {
          animateDiagram(diagram, packets);
        }, hoverDelay);
      });

      stage.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "mouse" && hoveredStage === stage) resetDiagram();
      });
    });

    motionSystems.addEventListener("studychange", (event) => {
      resetDiagram();
      animateElement(event.detail.study, [
        { opacity: 0.5 },
        { opacity: 1 },
      ], { duration: 240, easing: "ease-out" });
    });

    document.addEventListener("visibilitychange", resetDiagram);
  }

  if ("IntersectionObserver" in window && !motionPreference.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        animateElement(entry.target, [
          { opacity: 0.55, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 480, easing: "cubic-bezier(.22, 1, .36, 1)" });
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(
      ".hero-copy, [data-systems], .featured-project, .additional-work, " +
      ".leadership-example, .note-card, .article-diagram, .execution-steps, .contact-panel"
    ).forEach((element) => revealObserver.observe(element));
  }

  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      resetDiagram();
      activeAnimations.forEach((animation) => animation.cancel());
    }
  });
}
