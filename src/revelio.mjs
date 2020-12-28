const revelio = (() => {
  // Return null if not executed in a browser.
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  };

  // User variables.
  let variables = {};
  variables.root = window.revelioConfig && window.revelioConfig.root || null;
  variables.rootMargin = root && window.revelioConfig && window.revelioConfig.rootMargin || null;
  variables.threshold = window.revelioConfig && window.revelioConfig.threshold || 0.25;
  variables.cssClasses = window.revelioConfig && window.revelioConfig.cssClasses || ['fade-in', 'slide-up'];

  // Find all DOM elements with [data-revelio] attribute. Return if none.
  const animatedElements = document.querySelectorAll('[data-revelio]');
  if (animatedElements.length < 1) { return };
  
  // Don't hide content from Google; no IntersectionObserver fallback.
  const googlebot = navigator.userAgent.toLowerCase().includes('googlebot');
  if (window.IntersectionObserver === null || googlebot) {
    animatedElements.forEach(element => {
      variables.cssClasses.forEach(cssClass =>
        element.classList.remove(cssClass));
    });
    return;
  };
  
  // IntersectionObserver callback function.
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting === false) return;
      const target = entry.target;
      const styles = getComputedStyle(target);
      const display = styles.getPropertyValue('display');
      const visibility = styles.getPropertyValue('visibility');
      requestAnimationFrame(() => {
        // Skip processing non-visible elements.
        if (display == 'none' || visibility == 'hidden') return;
        variables.cssClasses.forEach(cssClass =>
          element.classList.remove(cssClass));
        observer.unobserve(target);
      });
    });
  };
  
  const options = {
    root: variables.root,
    rootMargin: variables.rootMargin,
    threshold: variables.threshold
  };
  const observer = new IntersectionObserver(handleIntersection, options);
  animatedElements.forEach(element => observer.observe(element));
})();

export { revelio };