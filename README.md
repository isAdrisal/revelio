# Revelio
A very small library to reveal elements on scroll using an IntersectionObserver and CSS.

## Installation
Install from npm using your favourite package manager.

```
yarn add revelio
```

Import into your project.

```
import { revelio } from 'revelio'
```

## Usage
- Add a `[data-revelio]` attribute to DOM elements you wish to animate. This attribute identifies elements to observe for entries into the viewport.

- Add one or more comma-separated animation names as the `[data-revelio]` attribute value to the element.

- Define the CSS for the animation names used. This will control the actual animation. Basic examples:

```
:root {
  --animate-distance: 20px;
  --animate-timing: 450ms;
  --animate-easing: ease-out;
}

[data-revelio] {
  transition: all var(--animate-timing) var(--animate-easing);
}

[data-revelio*="slide-up"] {
  transform: translateY(var(--animate-distance));
}

[data-revelio*="fade-in"] {
  opacity: 0;
}
```

- Call the `revelio()` method in your code.

- That's it! Ensure that the bundle containing the revelio script is loaded with the `defer` attribute or has a `DOMContentLoaded` event listener to ensure that all DOM elements are detected correctly.

## Options
- Users can tailor revelio by including a `revelioConfig` object on the global `window` object. This must be included in the HTML before the bundle containing revelio.

```
// Default values shown.
<script>
  const window.revelioConfig = {
    root: null,
    rootMargin: null,
    threshold: 0.25,
  };
</script>
```
|**Variable**|**Description**|
|:-----:|:-----|
|root|IntersectionObserver `root` element. Default is the browser viewport, but can be any scrollable element represented by a DOMString (eg. `document.body`)|
|rootMargin|Used to modify the `root` element shape. Can only be set if `root` is not `null` (viewport).|
|threshold|Amount (%) that an element must have entered the `root` to trigger the animation. Decimal value from 0.00 to 1.00|
