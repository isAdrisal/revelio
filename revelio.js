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
  variables.ignoreDisplayNone = window.revelioConfig && window.revelioConfig.ignoreDisplayNone || true;
  variables.ignoreHidden = window.revelioConfig && window.revelioConfig.ignoreHidden || false;

  // Find all DOM elements with non-empty [data-revelio] attribute. Return if none.
  const animatedElements = document.querySelectorAll('[data-revelio]:not([data-revelio=""])');
  if (animatedElements.length < 1) { return };
  
  // Don't hide content from Google; no IntersectionObserver fallback.
  const googlebot = navigator.userAgent.toLowerCase().includes('googlebot');
  if (window.IntersectionObserver === null || googlebot) {
    animatedElements.forEach(element => element.dataset.revelio = '');
    return;
  };
  
  // IntersectionObserver callback function.
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      // Skip non-intersecting elements.
      if (entry.isIntersecting === false) return;
      const target = entry.target;
      requestAnimationFrame(() => {
        // Skip processing non-visible elements (user configurable).
        // isVisible property only available in Chromium-based browsers
        // with ioV2, so unused here.
        const styles = getComputedStyle(target);
        const display = styles.getPropertyValue('display');
        const visibility = styles.getPropertyValue('visibility');
        if (variables.ignoreDisplayNone && display == 'none') return;
        if (variables.ignoreHidden && visibility == 'hidden') return;

        // Trigger animations. Animations will only run once.
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