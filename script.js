const logoWrap = document.getElementById('logoWrap');
const snakePath = document.getElementById('snakePath');
const heroLogo = document.getElementById('heroLogo');

if (logoWrap && snakePath && heroLogo) {
  const drawDuration = 800;
  const keyStepDelay = 100;
  const logoKeys = Array.from(document.querySelectorAll('.logo-key'));
  let sequenceStarted = false;

  const pathLength = snakePath.getTotalLength();
  snakePath.style.setProperty('--path-length', String(pathLength));
  snakePath.style.strokeDasharray = String(pathLength);
  snakePath.style.strokeDashoffset = String(pathLength);

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const revealKeysRandom = () => {
    const randomized = shuffle([...logoKeys]);
    randomized.forEach((key, index) => {
      window.setTimeout(() => key.classList.add('show'), index * keyStepDelay);
    });

    const totalRevealTime = randomized.length * keyStepDelay;
    window.setTimeout(() => {
      logoWrap.classList.add('keys-idle');
      document.body.classList.add('keyboard-docked');
      window.setTimeout(() => {
        document.body.classList.add('content-ready');
        initContentReveal();
      }, 460);
    }, totalRevealTime + 120);
  };

  const finishLineAnimation = () => {
    if (sequenceStarted) return;
    sequenceStarted = true;
    revealKeysRandom();
  };

  const startSequence = () => {
    snakePath.addEventListener(
      'animationend',
      (event) => {
        if (event.animationName === 'drawLine') finishLineAnimation();
      },
      { once: true }
    );
    window.setTimeout(finishLineAnimation, drawDuration + 120);
  };

  if (heroLogo.complete) {
    startSequence();
  } else {
    heroLogo.addEventListener('load', startSequence, { once: true });
  }
}

function initContentReveal() {
  const revealItems = Array.from(document.querySelectorAll('.site-content .reveal'));
  const showItem = (el) => el.classList.add('show');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showItem(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach(showItem);
  }
}
