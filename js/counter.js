// counter.js

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".trust-bar__number");

  const animateCounter = (element, targetText) => {
    const match = targetText.match(/^(\d+)(.*)$/);

    if (!match) {
      element.textContent = targetText;
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2];

    // Dynamic duration based on target
    // Bigger numbers = longer animation
    const duration = target * 420;

    let current = 0;

    // Smaller numbers increment slower
    const increment = Math.max(target / (duration / 16), 0.05);

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = easeOutExpo(progress);

      current = eased * target;

      element.textContent = `${Math.floor(current)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Prevent re-animation
          if (el.dataset.animated) return;

          el.dataset.animated = "true";

          const finalValue = el.textContent.trim();

          animateCounter(el, finalValue);

          obs.unobserve(el);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  counters.forEach((counter) => observer.observe(counter));
});