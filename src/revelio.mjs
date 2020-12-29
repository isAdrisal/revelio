const revelio = () => {
  // Return null if not executed in a browser.
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  };

  // User variables.
  let variables = {};
  variables.root = window.revelioConfig && window.revelioConfig.root || null;
  variables.rootMargin = variables.root && window.revelioConfig && window.revelioConfig.rootMargin || null;
  variables.threshold = window.revelioConfig && window.revelioConfig.threshold || 0.25;

  // Find all DOM elements with [data-revelio] attribute. Return if none.
  const animatedElements = document.querySelectorAll('[data-revelio]');
  if (animatedElements.length < 1) { return };
  
  // Don't hide content from Google; no IntersectionObserver fallback.
  const googlebot = navigator.userAgent.toLowerCase().includes('googlebot');
  if (window.IntersectionObserver === null || googlebot) {
    animatedElements.forEach(element => element.dataset.revelio = '');
    return;
  };
  
  // IntersectionObserver callback function.
  const handleIntersection = (entries, observer) => {
    let vw, vh = null;
    if (variables.root === null) {
      const html = document.querySelector('html');
      vw = html.clientWidth;
      vh = html.clientHeight;
    };
    entries.forEach(entry => {
      // Fix for intermittent Chrome bug with improperly calculated
      // viewport size on first callback instance.
      if (vw && vh) {
        const bounds = entry.rootBounds;
        if (bounds.width !== vw || bounds.height !== vh) return;
      };

      // Skip non-intersecting elements on first callback instance.
      if (entry.isIntersecting === false) return;
      // Apply animations.
      const target = entry.target;
      const styles = getComputedStyle(target);
      const display = styles.getPropertyValue('display');
      const visibility = styles.getPropertyValue('visibility');
      requestAnimationFrame(() => {
        // Skip processing non-visible elements. isVisible property only
        // available in Chromium-based browsers with ioV2, so unused.
        if (display == 'none' || visibility == 'hidden') return;
        target.dataset.revelio = '';
        observer.unobserve(target);
      });
    });
  };
  
  let options = {
    root: variables.root,
    threshold: variables.threshold
  };
  if (variables.rootMargin) {
    options.rootMargin = variables.rootMargin
  };
  const observer = new IntersectionObserver(handleIntersection, options);
  animatedElements.forEach(element => observer.observe(element));
};

export { revelio };