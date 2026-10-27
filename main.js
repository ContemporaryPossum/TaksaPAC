/* Taska & Tadika PAC: page motion and interactions.
   Lenis (smooth scroll) drives GSAP ScrollTrigger; every section has its own scroll moment. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const WHATSAPP = '60162729666';
  const EMAIL = 'amypac2008@gmail.com';
  const THEME_COLORS = { pink: '#F3B5C3', beech: '#EAD7B7', blue: '#1E4FA3', green: '#1F6E47', gold: '#F1B53A', red: '#C8361F', ink: '#1B1F3B' };

  const PAC = (window.PAC = window.PAC || {});
  PAC.reduce = reduce;

  // ---------------------------------------------------------------------------
  // Opening hours (Malaysia time), shared by the hero status and the week chart
  // ---------------------------------------------------------------------------
  const HOURS = [
    [390, 1140], [390, 1140], [390, 1140], [390, 1140], [390, 1140], // Mon–Fri 6:30–19:00
    [480, 780],                                                       // Sat 8:00–13:00
    null,                                                             // Sun closed
  ];
  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const fmtTime = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    const suffix = h < 12 ? 'am' : 'pm';
    const h12 = ((h + 11) % 12) + 1;
    return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
  };
  function malaysiaNow() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kuala_Lumpur', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
    return { dow, mins: Number(get('hour')) * 60 + Number(get('minute')) };
  }
  PAC.hours = { HOURS, DAY_NAMES, fmtTime, malaysiaNow };

  function openStatus() {
    const { dow, mins } = malaysiaNow();
    const today = HOURS[dow];
    if (today && mins >= today[0] && mins < today[1]) return { state: 'open', text: `Open now, until ${fmtTime(today[1])}` };
    if (today && mins < today[0]) return { state: 'closed', text: `Opens today at ${fmtTime(today[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (dow + i) % 7;
      if (HOURS[d]) return { state: 'closed', text: `Closed now, opens ${i === 1 ? 'tomorrow' : DAY_NAMES[d]} at ${fmtTime(HOURS[d][0])}` };
    }
    return { state: 'closed', text: 'Closed now' };
  }
  function paintStatus() {
    $$('[data-open-status]').forEach((el) => {
      const s = openStatus();
      el.dataset.state = s.state;
      $('.status__text', el).textContent = s.text;
    });
  }
  paintStatus();
  setInterval(paintStatus, 60_000);

  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // These work the same whether or not the animation libraries load
  initMomentThumbs();
  initShelfPhotos();

  // ---------------------------------------------------------------------------
  // Without GSAP (a script failed to load), keep the page fully usable
  // ---------------------------------------------------------------------------
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.add('ready');
    initAgeRod(null);
    initForm();
    initMap();
    initAlbums(null);
    initMenu(null);
    initThemeObserver();
    if (window.PACCharts) {
      window.PACCharts.years($('#chart-years'));
      window.PACCharts.themes($('#chart-themes'));
      window.PACCharts.week($('#chart-week'));
    }
    return;
  }

  const { gsap, ScrollTrigger } = window;
  const SplitText = window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 1 });

  // ---------------------------------------------------------------------------
  // Lenis smooth scroll, bridged to GSAP's ticker
  // ---------------------------------------------------------------------------
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  PAC.lenis = lenis;

  function scrollToTarget(target) {
    if (!target) return;
    const y = target === 'top' ? 0 : target;
    if (lenis) lenis.scrollTo(y, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else if (y === 0) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    else y.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  // In-page links glide with Lenis and move focus for keyboard users
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    closeMenu?.();
    scrollToTarget(id === 'top' ? 'top' : el);
    history.replaceState(null, '', `#${id}`);
    const focusEl = id === 'top' ? $('#main') : el;
    focusEl.setAttribute('tabindex', '-1');
    focusEl.focus({ preventScroll: true });
  });

  // ---------------------------------------------------------------------------
  // Hero: the headline is set like the Montessori movable alphabet
  // (consonants blue, vowels red), letters placed one at a time
  // ---------------------------------------------------------------------------
  const intro = gsap.timeline({ delay: 0.15 });
  const display = $('[data-movable]');
  if (display && SplitText) {
    const split = SplitText.create(display, { type: 'words,chars', charsClass: 'mv', aria: 'auto' });
    split.chars.forEach((ch) => {
      const c = ch.textContent;
      if (/[aeiou]/i.test(c)) ch.classList.add('mv-v');
      else if (/[a-z]/i.test(c)) ch.classList.add('mv-c');
    });
    if (!reduce) {
      intro.from(split.chars, {
        yPercent: -130, rotate: () => gsap.utils.random(-16, 16), autoAlpha: 0,
        duration: 0.9, ease: 'back.out(1.5)', stagger: 0.035,
      });
    }
  }
  if (!reduce) {
    intro.from('.hero [data-reveal]:not(.hero__note)', { y: 26, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.55);
    const arrow = $$('.hero__arrow path');
    arrow.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    intro.from('.hero__note', { autoAlpha: 0, x: 16, duration: 0.8 }, 1.3);
    intro.to(arrow, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.35 }, 1.5);
    gsap.to('.hero__copy', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // ---------------------------------------------------------------------------
  // Text reveals (different per section so nothing feels stamped out)
  // ---------------------------------------------------------------------------
  if (!reduce && SplitText) {
    $$('[data-lines]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 115, duration: 1.1, stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          });
        },
      });
    });
    $$('[data-words]').forEach((el) => {
      SplitText.create(el, {
        type: 'words', mask: 'words', autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 105, rotate: 4, duration: 0.9, stagger: 0.06,
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          });
        },
      });
    });
    $$('[data-reveal]').filter((el) => !el.closest('.hero')).forEach((el) => {
      gsap.from(el, { y: 36, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  // Numbers count up when they arrive
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    const fmt = (v) => v.toLocaleString('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (reduce) { el.textContent = fmt(end); return; }
    const o = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power3.out',
      onUpdate: () => (el.textContent = fmt(o.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // ---------------------------------------------------------------------------
  // Approach: pinned scene that swaps the verb as you scroll
  // ---------------------------------------------------------------------------
  (function approach() {
    const sec = $('.approach');
    if (!sec || reduce) return;
    sec.classList.add('is-live');
    const words = $$('.swap__word', sec);
    const aims = $$('.aims__item', sec);
    let current = 0;
    gsap.set(words.slice(1), { yPercent: 100, autoAlpha: 0 });

    function show(i) {
      if (i === current) return;
      const dir = i > current ? 1 : -1;
      const prev = words[current], next = words[i];
      gsap.killTweensOf([prev, next]);
      gsap.to(prev, { yPercent: -100 * dir, autoAlpha: 0, duration: 0.55, ease: 'power3.inOut' });
      gsap.fromTo(next, { yPercent: 100 * dir, autoAlpha: 1, rotate: 3 * dir }, { yPercent: 0, rotate: 0, duration: 0.85, ease: 'expo.out', delay: 0.08 });
      words.forEach((w, k) => w.classList.toggle('is-on', k === i));
      aims.forEach((a, k) => a.classList.toggle('is-on', k === i));
      current = i;
    }

    ScrollTrigger.create({
      trigger: $('.approach__pin', sec),
      start: 'top top',
      end: () => '+=' + Math.round(innerHeight * 2.6),
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => show(Math.min(words.length - 1, Math.floor(self.progress * words.length * 0.9999))),
    });

    gsap.from($$('.aims__item', sec), {
      y: 30, autoAlpha: 0, stagger: 0.08, duration: 1,
      scrollTrigger: { trigger: sec, start: 'top 60%', once: true },
    });
  })();

  // ---------------------------------------------------------------------------
  // Programmes: the age picker is a Montessori number rod
  // ---------------------------------------------------------------------------
  initAgeRod(gsap);

  // ---------------------------------------------------------------------------
  // Curriculum: the shelf slides sideways while the page is pinned
  // ---------------------------------------------------------------------------
  (function areas() {
    const sec = $('.areas');
    if (!sec || reduce) return;
    sec.classList.add('is-pinned');
    const track = $('.areas__track', sec);
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);

    const slide = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: $('.areas__pin', sec),
        start: 'top top',
        end: () => '+=' + dist(),
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => (PAC.shelf = self.progress),
      },
    });

    // The ribbon of enrichment subjects slides with the scroll instead of looping on its own
    gsap.fromTo('.ribbon__row', { xPercent: 0 }, {
      xPercent: -35, ease: 'none',
      scrollTrigger: { trigger: '.ribbon', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });

    $$('.area', sec).forEach((area) => {
      const glyph = $('.area__glyph', area);
      gsap.from(glyph.children, {
        autoAlpha: 0, scale: 0.7, y: 10, transformOrigin: '50% 50%', stagger: 0.05, duration: 0.7,
        scrollTrigger: { trigger: area, containerAnimation: slide, start: 'left 82%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo($('.area__photo img', area), { xPercent: 0 }, {
        xPercent: -9, ease: 'none',
        scrollTrigger: { trigger: area, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
      });
      gsap.from([...area.children].filter((c) => c !== glyph), {
        y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.9,
        scrollTrigger: { trigger: area, containerAnimation: slide, start: 'left 92%', toggleActions: 'play none none reverse' },
      });
    });
  })();

  // ---------------------------------------------------------------------------
  // Moments: charts and a hover index with a photo that follows the cursor
  // ---------------------------------------------------------------------------
  if (window.PACCharts) {
    window.PACCharts.years($('#chart-years'));
    window.PACCharts.themes($('#chart-themes'));
    window.PACCharts.week($('#chart-week'));
  }

  (function moments() {
    const list = $('.moments__list');
    if (!list) return;
    const rows = $$('.moment', list);
    if (!finePointer) return;
    const peek = $('.peek');
    const img = $('img', peek);
    gsap.set(peek, { xPercent: 0, yPercent: -50, scale: 0.86 });
    const xTo = gsap.quickTo(peek, 'x', { duration: 0.55, ease: 'power3' });
    const yTo = gsap.quickTo(peek, 'y', { duration: 0.55, ease: 'power3' });
    const show = (row) => {
      if (img.getAttribute('src') !== row.dataset.img) img.src = row.dataset.img;
      gsap.to(peek, { autoAlpha: 1, scale: 1, rotate: gsap.utils.random(-5, 5), duration: reduce ? 0 : 0.4, ease: 'expo.out', overwrite: 'auto' });
    };
    const hide = () => gsap.to(peek, { autoAlpha: 0, scale: 0.86, duration: reduce ? 0 : 0.25, ease: 'power2.out', overwrite: 'auto' });
    PAC.hidePeek = hide;
    list.addEventListener('pointermove', (e) => {
      // Ride along the empty middle of the list so the photo never covers a title
      const r = list.getBoundingClientRect();
      const w = peek.offsetWidth;
      const x = Math.min(r.right - w - 160, Math.max(e.clientX + 40, r.left + r.width * 0.46));
      xTo(x); yTo(e.clientY);
    });
    rows.forEach((row) => {
      row.addEventListener('pointerenter', () => show(row));
    });
    list.addEventListener('pointerleave', hide);
    // Warm the cache so the first hover is instant
    const warm = () => rows.forEach((r) => { const i = new Image(); i.src = r.dataset.img; });
    ScrollTrigger.create({ trigger: list, start: 'top bottom+=400', once: true, onEnter: warm });

    if (!reduce) {
      gsap.from(rows, {
        y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.8,
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
      });
    }
  })();

  // ---------------------------------------------------------------------------
  // Visit: the exercise book opens onto the desk
  // ---------------------------------------------------------------------------
  if (!reduce) {
    gsap.from('.book__page', {
      rotateY: -16, rotateX: 5, y: 70, autoAlpha: 0, duration: 1.3,
      scrollTrigger: { trigger: '.book', start: 'top 82%', once: true },
    });
    gsap.from('.contact > div', {
      y: 20, autoAlpha: 0, stagger: 0.07, duration: 0.9,
      scrollTrigger: { trigger: '.contact', start: 'top 88%', once: true },
    });
    gsap.from('.foot__mark span', {
      yPercent: 70, rotate: (i) => [-8, 5, -4][i] || 0, ease: 'none', stagger: 0.06,
      scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'top 25%', scrub: 0.6 },
    });
  }
  initForm();
  initMap();
  initAlbums(gsap);

  // ---------------------------------------------------------------------------
  // Pause control for everything that moves on its own (3D idle motion, pulses)
  // ---------------------------------------------------------------------------
  (function motionToggle() {
    const btn = $('.motion-toggle');
    if (!btn || reduce) return;
    const label = $('span', btn);
    const apply = (paused) => {
      PAC.paused = paused;
      root.classList.toggle('paused', paused);
      btn.setAttribute('aria-pressed', String(paused));
      label.textContent = paused ? 'Play motion' : 'Pause motion';
    };
    let saved = false;
    try { saved = localStorage.getItem('pac-motion') === 'paused'; } catch {}
    apply(saved);
    btn.addEventListener('click', () => {
      const next = !PAC.paused;
      apply(next);
      try { localStorage.setItem('pac-motion', next ? 'paused' : 'playing'); } catch {}
    });
  })();

  // ---------------------------------------------------------------------------
  // Navigation: hide on the way down, return on the way up; mobile menu
  // ---------------------------------------------------------------------------
  const nav = $('#nav');
  let menuOpen = false;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 24);
      nav.classList.toggle('is-hidden', !menuOpen && self.direction === 1 && y > innerHeight * 0.7);
    },
  });
  const closeMenu = initMenu(lenis, (open) => (menuOpen = open));

  // Number-rod progress bar: ten segments fill in order, like counting to ten
  const rodSegs = $$('.rodbar span');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const p = self.progress * rodSegs.length;
      rodSegs.forEach((s, i) => s.style.setProperty('--f', Math.min(1, Math.max(0, p - i)).toFixed(3)));
    },
  });

  // Current-section highlight in the nav
  $$('.nav__links a').forEach((a) => {
    const sec = document.getElementById(a.getAttribute('href').slice(1));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => (self.isActive ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')),
    });
  });

  // ---------------------------------------------------------------------------
  // The page ground flows through the Montessori material colours.
  // Created last so pinned sections above have already added their spacing.
  // ---------------------------------------------------------------------------
  const metaTheme = $('meta[name="theme-color"]');
  function setTheme(name) {
    if (root.dataset.theme === name) return;
    root.dataset.theme = name;
    if (metaTheme) metaTheme.content = THEME_COLORS[name] || THEME_COLORS.pink;
    PAC.theme = name;
  }
  $$('[data-ground]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => self.isActive && setTheme(sec.dataset.ground),
    });
  });

  root.classList.add('ready');

  // Re-measure once fonts and images settle
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());

  // ===========================================================================
  // Functions shared with the no-GSAP fallback
  // ===========================================================================
  function initAgeRod(g) {
    const input = $('#age');
    if (!input) return;
    const AGES = ['1½', '2', '2½', '3', '3½', '4', '4½', '5', '5½', '6'];
    const AGE_WORDS = ['18 months', '2 years', '2 and a half years', '3 years', '3 and a half years', '4 years', '4 and a half years', '5 years', '5 and a half years', '6 years'];
        const ROOMS = {
      taska: {
        title: 'Montessori Nursery', tag: 'Taska', ages: 'for 18 months to 4 years',
        text: 'A calm first classroom. Children pour, sort, stack and sing, building concentration and independence through practical life and sensorial work, with early phonics when they’re ready.',
        list: ['Practical life and sensorial work', 'Early phonics, songs and stories', 'Water play and music gym', 'Full-day or half-day care'],
        img: 'photo-nursery-water-play.jpg',
        alt: 'Nursery children splashing in a paddling pool during water play',
      },
      tadika: {
        title: 'Montessori Kindergarten', tag: 'Tadika', ages: 'for 4 to 6 years',
        text: 'Full Montessori work in maths, literacy and culture. Children move from golden beads to multiplication boards and from sounds to sentences, with science experiments and excursions along the way.',
        list: ['Montessori maths and literacy', 'Science experiments and projects', 'E-learning in technology-aided classrooms', 'Excursions and cultural celebrations'],
        img: 'photo-multiplication-board.jpg',
        alt: 'A kindergarten child working on the Montessori multiplication board',
      },
      bridging: {
        title: 'Bridging Class', tag: 'Tadika', ages: 'for 6 years',
        text: 'The last year before Primary One. Aligned with the National Preschool Curriculum, so children start school confident with reading, writing and numbers.',
        list: ['Aligned with the National Preschool Curriculum', 'Reading, writing and number readiness', 'Bahasa Melayu, Chinese and English practice', 'Science projects and outings'],
        img: 'photo-science-materials.jpg',
        alt: 'A six-year-old completing a science worksheet on materials',
      },
    };
    const roomFor = (i) => (i <= 4 ? 'taska' : i <= 8 ? 'tadika' : 'bridging');

    const thumb = $('.rod__thumb');
    const thumbAge = $('.rod__thumb-age');
    const segs = $$('.rod__track span');
    const card = $('.room');
    const media = $('.room__media', card);
    const body = $('.room__body', card);
    let currentRoom = roomFor(Number(input.value));

    function render(roomKey) {
      const r = ROOMS[roomKey];
      $('.room__title', card).textContent = r.title;
      $('.room__ages', card).innerHTML = '';
      const tag = document.createElement('span');
      tag.className = 'room__tag';
      tag.textContent = r.tag;
      $('.room__ages', card).append(tag, ' ' + r.ages);
      $('.room__text', card).textContent = r.text;
      const ul = $('.room__list', card);
      ul.replaceChildren(...r.list.map((t) => Object.assign(document.createElement('li'), { textContent: t })));
    }

    function swapImage(roomKey, animate) {
      const r = ROOMS[roomKey];
      const next = new Image();
      next.className = 'room__img';
      next.src = r.img;
      next.alt = r.alt;
      next.width = 800; next.height = 600;
      next.decoding = 'async';
      const old = $$('.room__img', media);
      media.append(next);
      if (animate && g) {
        g.fromTo(next, { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }, {
          clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 0.9, ease: 'expo.out',
          onComplete: () => old.forEach((o) => o.remove()),
        });
      } else old.forEach((o) => o.remove());
    }

    function update(i, animate = true) {
      thumb.style.setProperty('--k', i);
      thumbAge.textContent = AGES[i];
      input.setAttribute('aria-valuetext', AGE_WORDS[i]);
      segs.forEach((s, k) => s.classList.toggle('is-off', k > i));
      PAC.age = i;
      window.dispatchEvent(new CustomEvent('pac:age', { detail: i }));
      const key = roomFor(i);
      if (key === currentRoom) return;
      currentRoom = key;
      if (animate && g && !reduce) {
        g.timeline()
          .to(body.children, { y: -14, autoAlpha: 0, duration: 0.18, ease: 'power2.in', stagger: 0.02 })
          .add(() => render(key))
          .fromTo(body.children, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', stagger: 0.05 });
        swapImage(key, true);
      } else {
        render(key);
        swapImage(key, false);
      }
    }

    input.addEventListener('input', () => update(Number(input.value)));
    update(Number(input.value), false);
    // Preload the other room photos
    Object.values(ROOMS).forEach((r) => { const i = new Image(); i.src = r.img; });
  }

  // On touch screens there is no hover preview, so each album row shows a thumbnail
  function initMomentThumbs() {
    if (finePointer) return;
    $$('.moment').forEach((row) => {
      const img = new Image();
      img.className = 'moment__thumb';
      img.src = row.dataset.img;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 64; img.height = 64;
      $('.moment__open', row)?.prepend(img);
    });
  }

  // The curriculum shelf moves sideways, where lazy images can arrive late;
  // start fetching its photos as soon as the section is about a screen away
  function initShelfPhotos() {
    const sec = $('.areas');
    if (!sec) return;
    const load = () => $$('.area__photo img', sec).forEach((img) => (img.loading = 'eager'));
    if (!('IntersectionObserver' in window)) return load();
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { load(); io.disconnect(); }
    }, { rootMargin: '1200px 0px' });
    io.observe(sec);
  }

  // Section colours without GSAP: switch the theme as each section crosses the middle of the screen
  function initThemeObserver() {
    if (!('IntersectionObserver' in window)) return;
    const meta = $('meta[name="theme-color"]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const name = e.target.dataset.ground;
        root.dataset.theme = name;
        if (meta) meta.content = THEME_COLORS[name] || THEME_COLORS.pink;
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    $$('[data-ground]').forEach((sec) => io.observe(sec));
  }

  // Album viewer: each "favourite" opens its photos full screen
  function initAlbums(g) {
    const dialog = $('#album');
    const data = window.PAC_ALBUMS;
    if (!dialog || !data || typeof dialog.showModal !== 'function') return;
    const keys = Object.keys(data);
    const img = $('.album__img', dialog);
    const thumbs = $('.album__thumbs', dialog);
    const stage = $('.album__stage', dialog);
    let key = null;
    let index = 0;
    let trigger = null;
    let seq = 0;

    function render(k) {
      const a = data[k];
      key = k;
      $('.album__title', dialog).textContent = a.title;
      $('.album__sub', dialog).textContent = `${a.theme}, ${a.year}. Showing ${a.photos.length} of the ${a.total} photos in the original album.`;
      $('.album__text', dialog).textContent = a.text;
      thumbs.replaceChildren(...a.photos.map(([src, text], i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Photo ${i + 1}: ${text}`);
        const t = new Image();
        t.src = src; t.alt = ''; t.decoding = 'async'; t.width = 64; t.height = 48;
        b.append(t);
        b.addEventListener('click', () => show(i, i > index ? 1 : -1));
        return b;
      }));
      const next = data[keys[(keys.indexOf(k) + 1) % keys.length]];
      $('.album__next', dialog).textContent = `Next album: ${next.title}`;
    }

    function show(i, dir = 0) {
      const photos = data[key].photos;
      index = (i + photos.length) % photos.length;
      const [src, text] = photos[index];
      $('.album__count', dialog).textContent = `${index + 1} / ${photos.length}`;
      $('.album__alt', dialog).textContent = text;
      $$('button', thumbs).forEach((b, k) => b.setAttribute('aria-current', String(k === index)));
      $$('button', thumbs)[index]?.scrollIntoView({ block: 'nearest', inline: 'center' });
      // Load first so the swap never flashes (giving up waiting after 1.5 s);
      // ignore photos the viewer has already moved past
      const token = ++seq;
      const swap = () => {
        if (token !== seq || img.getAttribute('src') === src) return;
        img.src = src;
        img.alt = text;
        if (g && !reduce) g.fromTo(img, { autoAlpha: 0, x: 36 * dir }, { autoAlpha: 1, x: 0, duration: dir ? 0.5 : 0.35, ease: 'expo.out', overwrite: true });
      };
      const pre = new Image();
      pre.onload = pre.onerror = swap;
      pre.src = src;
      if (pre.complete) swap();
      setTimeout(swap, 1500);
      [index + 1, index - 1].forEach((n) => { new Image().src = photos[(n + photos.length) % photos.length][0]; });
    }

    function open(k, from) {
      if (!data[k]) return;
      trigger = from || null;
      render(k);
      show(0);
      PAC.hidePeek?.();
      history.replaceState(null, '', `#album-${k}`);
      if (dialog.open) return;
      dialog.showModal();
      root.classList.add('album-open');
      PAC.lenis?.stop();
      if (g && !reduce) g.fromTo(dialog, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
    }

    // Tidy up straight away rather than waiting for the dialog's async close event
    function cleanup() {
      if (!root.classList.contains('album-open')) return;
      root.classList.remove('album-open');
      PAC.lenis?.start();
      history.replaceState(null, '', '#moments');
      trigger?.focus({ preventScroll: true });
    }
    function close() {
      if (dialog.open) dialog.close();
      cleanup();
    }
    dialog.addEventListener('close', cleanup);
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    $('.album__close', dialog).addEventListener('click', close);
    $('.album__nav--prev', dialog).addEventListener('click', () => show(index - 1, -1));
    $('.album__nav--next', dialog).addEventListener('click', () => show(index + 1, 1));
    $('.album__next', dialog).addEventListener('click', () => {
      render(keys[(keys.indexOf(key) + 1) % keys.length]);
      show(0, 1);
      history.replaceState(null, '', `#album-${key}`);
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, -1); }
    });

    // Swipe left or right on touch screens; vertical drags still scroll as normal
    let x0 = null;
    stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    stage.addEventListener('pointercancel', () => (x0 = null));
    stage.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 45) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });

    $$('.moment').forEach((row) => {
      $('.moment__open', row)?.addEventListener('click', (e) => open(row.dataset.album, e.currentTarget));
    });

    // A shared link like /#album-bomba opens that album straight away
    const fromHash = location.hash.match(/^#album-(\w+)$/);
    if (fromHash && data[fromHash[1]]) {
      const row = $(`.moment[data-album="${fromHash[1]}"] .moment__open`);
      open(fromHash[1], row);
    }
  }

  function initMap() {
    const btn = $('.map__load');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.title = 'Map showing Taska & Tadika PAC in Kota Kemuning, Shah Alam';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.src = 'https://www.google.com/maps?q=Taska%20%26%20Tadika%2C%20Pusat%20Jaga%20Kanak%20Kanak%20PAC%2C%20Kota%20Kemuning&ll=2.9931679,101.5487996&z=16&output=embed';
      btn.replaceWith(frame);
      frame.setAttribute('data-lenis-prevent', '');
      window.ScrollTrigger?.refresh();
    });
  }

  function initForm() {
    const form = $('#enquiry');
    if (!form) return;
    const status = $('.book__status', form);
    const fields = { name: $('#f-name', form), age: $('#f-age', form) };
    const errors = {
      name: 'Please add your name so we know who to reply to.',
      age: 'Please choose your child’s age so we can suggest the right room.',
    };

    function setError(key, msg) {
      const input = fields[key];
      const err = $('#' + input.id + '-err', form);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      err.textContent = msg || '';
    }
    function validate() {
      let first = null;
      for (const key of Object.keys(fields)) {
        const ok = fields[key].value.trim() !== '';
        setError(key, ok ? '' : errors[key]);
        if (!ok && !first) first = fields[key];
      }
      return first;
    }
    Object.keys(fields).forEach((key) => {
      fields[key].addEventListener('input', () => fields[key].getAttribute('aria-invalid') === 'true' && fields[key].value.trim() && setError(key, ''));
    });

    function message() {
      const data = new FormData(form);
      const interests = data.getAll('interest');
      const lines = [
        'Hi PAC, I’d like to arrange a visit.',
        `Name: ${String(data.get('name')).trim()}`,
        `Child’s age: ${data.get('age')}`,
      ];
      if (interests.length) lines.push(`Interested in: ${interests.join(', ')}`);
      lines.push(`Best day: ${data.get('day')}`);
      const note = String(data.get('note') || '').trim();
      if (note) lines.push(`Note: ${note}`);
      return lines.join('\n');
    }

    function send(kind) {
      status.classList.remove('is-error');
      const bad = validate();
      if (bad) {
        status.textContent = 'A couple of details are missing. They’re marked above.';
        status.classList.add('is-error');
        bad.focus();
        return;
      }
      const text = message();
      if (kind === 'email') {
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Visit request from the website')}&body=${encodeURIComponent(text)}`;
        status.textContent = 'Your email app should open with the message ready. Press send there to reach us.';
        return;
      }
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
      const win = window.open(url, '_blank', 'noopener');
      if (!win) location.href = url;
      status.textContent = 'WhatsApp is opening with your message. Press send there to reach us.';
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); send('whatsapp'); });
    $('[data-email]', form).addEventListener('click', () => send('email'));
  }

  function initMenu(lenisRef, onChange) {
    const toggle = $('.nav__toggle');
    const menu = $('#menu');
    const label = $('.nav__toggle-label');
    if (!toggle || !menu) return () => {};
    let open = false;
    const outside = () => [$('#main'), $('.foot')].filter(Boolean);

    function setOpen(next) {
      if (next === open) return;
      open = next;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close' : 'Menu';
      outside().forEach((el) => (el.inert = open));
      root.style.overflow = open ? 'hidden' : '';
      if (open) {
        lenisRef?.stop();
        $('a', menu)?.focus();
        if (window.gsap && !reduce) window.gsap.from($$('li a, .menu__foot', menu), { yPercent: 60, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'expo.out' });
      } else {
        lenisRef?.start();
      }
      onChange?.(open);
    }
    toggle.addEventListener('click', () => setOpen(!open));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
    });
    matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && setOpen(false));
    return () => setOpen(false);
  }
})();
