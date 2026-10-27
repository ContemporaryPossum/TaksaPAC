/* Taska & Tadika PAC: interactive charts.
   Built in the spirit of Bklit UI (composable grid, series, axes, crosshair tooltip,
   ~1.1s enter animation, theme tokens), as plain SVG so the site needs no build step.
   Data: the centre's own photo albums on taskapac.com (2012–2020) and its opening hours. */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const THEMES = [
    { key: 'lessons', label: 'Montessori lessons', color: '#1E4FA3' },
    { key: 'science', label: 'Science & nature', color: '#1F6E47' },
    { key: 'outings', label: 'Outings', color: '#C8361F' },
    { key: 'culture', label: 'Festivals & culture', color: '#D2577A' },
    { key: 'food', label: 'Food & cooking', color: '#B7791F' },
    { key: 'arts', label: 'Arts & movement', color: '#6B4226' },
  ];

  // Photos published per year, grouped by theme (74 albums, 2,296 photos)
  const YEARS = [
    { year: 2012, lessons: 0, science: 0, outings: 52, culture: 0, food: 0, arts: 5 },
    { year: 2013, lessons: 8, science: 21, outings: 0, culture: 4, food: 14, arts: 43 },
    { year: 2014, lessons: 0, science: 72, outings: 8, culture: 228, food: 0, arts: 0 },
    { year: 2015, lessons: 0, science: 124, outings: 410, culture: 58, food: 121, arts: 0 },
    { year: 2016, lessons: 161, science: 2, outings: 21, culture: 40, food: 87, arts: 17 },
    { year: 2017, lessons: 44, science: 5, outings: 0, culture: 0, food: 0, arts: 23 },
    { year: 2018, lessons: 5, science: 7, outings: 48, culture: 17, food: 14, arts: 4 },
    { year: 2019, lessons: 329, science: 41, outings: 65, culture: 157, food: 0, arts: 34 },
    { year: 2020, lessons: 7, science: 0, outings: 0, culture: 0, food: 0, arts: 0 },
  ];
  const ALBUMS = { lessons: 17, science: 11, outings: 12, culture: 12, food: 11, arts: 11 };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const svg = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  const html = (tag, attrs = {}, parent) => {
    const el = document.createElement(tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  const fmt = (n) => n.toLocaleString('en-MY');
  const total = (d, keys) => keys.reduce((s, k) => s + d[k], 0);
  const niceMax = (v) => {
    const steps = [10, 20, 25, 50, 100, 200, 250, 500, 1000];
    const step = steps.find((s) => v / s <= 4) || 1000;
    return { max: Math.max(step, Math.ceil(v / step) * step), step };
  };

  // Shared tooltip
  const tip = document.querySelector('.tip');
  function showTip(content, x, y) {
    if (!tip) return;
    tip.replaceChildren(content);
    tip.classList.add('is-on');
    const r = tip.getBoundingClientRect();
    let left = x + 18;
    if (left + r.width > innerWidth - 10) left = x - r.width - 18;
    let top = y - r.height - 14;
    if (top < 10) top = y + 18;
    tip.style.translate = `${Math.max(10, left)}px ${top}px`;
  }
  const hideTip = () => tip?.classList.remove('is-on');
  addEventListener('scroll', hideTip, { passive: true });

  function tipContent(title, rows, foot) {
    const frag = document.createDocumentFragment();
    const b = document.createElement('b');
    b.textContent = title;
    frag.append(b);
    rows.forEach(({ label, value, color }) => {
      const row = html('div', { class: 'row' }, frag);
      const l = html('span', {}, row);
      if (color) { const i = html('i', {}, l); i.style.setProperty('--c', color); }
      l.append(label);
      html('span', {}, row).textContent = value;
    });
    if (foot) { const f = html('div', { class: 'row' }, frag); f.textContent = foot; }
    return frag;
  }

  // Plays an enter animation the first time the chart scrolls into view
  function onEnter(el, fn) {
    if (reduce || !window.ScrollTrigger) return fn(false);
    window.ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => fn(true) });
  }

  // Charts subscribe here so a legend click in one chart focuses the others
  const focusListeners = new Set();
  let focused = null;
  function setFocus(key) {
    focused = key;
    focusListeners.forEach((fn) => fn(key));
  }

  // Screen-reader table mirroring a chart's data
  function srTable(fig, caption, head, rows) {
    // Tables ignore width: 1px, so the visually hidden box is a wrapper
    const table = html('table', {}, html('div', { class: 'sr-only' }, fig));
    html('caption', {}, table).textContent = caption;
    const tr = html('tr', {}, html('thead', {}, table));
    head.forEach((h) => (html('th', { scope: 'col' }, tr).textContent = h));
    const tb = html('tbody', {}, table);
    rows.forEach((r) => { const row = html('tr', {}, tb); r.forEach((c, i) => (html(i ? 'td' : 'th', i ? {} : { scope: 'row' }, row).textContent = c)); });
  }

  // ---------------------------------------------------------------------------
  // Stacked bar chart: photos per year by theme
  // ---------------------------------------------------------------------------
  function years(fig) {
    if (!fig) return;
    const plot = fig.querySelector('.chart__plot');
    const legend = fig.querySelector('.legend');
    const H = 300;
    const m = { t: 22, r: 6, b: 30, l: 40 };
    let W = 0, node, bars = [], gridG, yLabels = [], crosshair, entered = false;

    srTable(fig, 'Photos published each year, by theme', ['Year', ...THEMES.map((t) => t.label), 'Total'],
      YEARS.map((d) => [d.year, ...THEMES.map((t) => d[t.key]), total(d, THEMES.map((t) => t.key))]));

    const buttons = THEMES.map((t) => {
      const b = html('button', { type: 'button', 'aria-pressed': 'false' }, legend);
      b.style.setProperty('--c', t.color);
      html('i', {}, b);
      b.append(t.label);
      b.addEventListener('click', () => setFocus(focused === t.key ? null : t.key));
      return b;
    });

    const keysFor = (f) => (f ? [f] : THEMES.map((t) => t.key));

    function layout(f) {
      const keys = keysFor(f);
      const { max, step } = niceMax(Math.max(...YEARS.map((d) => total(d, keys))));
      const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
      const band = innerW / YEARS.length;
      const bw = Math.min(46, band * 0.62);
      const y = (v) => m.t + innerH - (v / max) * innerH;
      return {
        max, step, band, bw, y, base: m.t + innerH,
        cols: YEARS.map((d, i) => {
          let acc = 0;
          const cx = m.l + band * i + band / 2;
          const segs = THEMES.map((t) => {
            const on = keys.includes(t.key);
            const v = on ? d[t.key] : 0;
            const y0 = y(acc), y1 = y(acc + v);
            acc += v;
            return { key: t.key, y: y1, h: Math.max(0, y0 - y1 - (v ? 2 : 0)) };
          });
          return { cx, total: acc, segs };
        }),
      };
    }

    function build() {
      W = Math.round(plot.clientWidth);
      if (!W) return;
      const narrow = W < 520;
      const L = layout(focused);
      plot.replaceChildren();
      node = svg('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Stacked bar chart of photos published each year from 2012 to 2020, by theme. Detailed figures follow in a table.' }, plot);
      gridG = svg('g', { class: 'grid' }, node);
      yLabels = [];
      for (let v = 0; v <= L.max; v += L.step) {
        const yy = L.y(v);
        svg('line', { x1: m.l, x2: W - m.r, y1: yy, y2: yy }, gridG);
        const t = svg('text', { x: m.l - 8, y: yy + 4, 'text-anchor': 'end' }, gridG);
        t.textContent = fmt(v);
        yLabels.push(t);
      }
      crosshair = svg('line', { class: 'crosshair', y1: m.t - 6, y2: L.base }, node);
      bars = L.cols.map((col, i) => {
        const g = svg('g', { class: 'seg' }, node);
        const rects = col.segs.map((s, k) => svg('rect', {
          x: col.cx - L.bw / 2, width: L.bw, rx: 3,
          y: entered || reduce ? s.y : L.base, height: entered || reduce ? s.h : 0,
          fill: THEMES[k].color,
        }, g));
        const totalLabel = svg('text', { x: col.cx, y: (entered || reduce ? L.y(col.total) : L.base) - 7, 'text-anchor': 'middle', 'font-weight': 600 }, g);
        totalLabel.textContent = narrow ? '' : fmt(col.total);
        const xl = svg('text', { x: col.cx, y: H - 8, 'text-anchor': 'middle' }, node);
        xl.textContent = narrow ? `’${String(YEARS[i].year).slice(2)}` : YEARS[i].year;
        const hit = svg('rect', {
          class: 'bar-hit', x: col.cx - L.band / 2, width: L.band, y: m.t - 10, height: L.base - m.t + 10,
          tabindex: 0, role: 'img', 'aria-label': `${YEARS[i].year}: ${fmt(col.total)} photos`,
        }, node);
        const show = (x, y) => {
          const d = YEARS[i];
          const keys = keysFor(focused);
          bars.forEach((b, j) => b.g.classList.toggle('is-dim', j !== i));
          crosshair.setAttribute('x1', col.cx); crosshair.setAttribute('x2', col.cx);
          crosshair.style.opacity = 1;
          const rows = THEMES.filter((t) => keys.includes(t.key) && d[t.key] > 0).map((t) => ({ label: t.label, value: fmt(d[t.key]), color: t.color }));
          showTip(tipContent(String(d.year), rows.length ? rows : [{ label: 'No albums this year', value: '' }], `Total ${fmt(total(d, keys))} photos`), x, y);
        };
        const clear = () => { bars.forEach((b) => b.g.classList.remove('is-dim')); crosshair.style.opacity = 0; hideTip(); };
        hit.addEventListener('pointermove', (e) => show(e.clientX, e.clientY));
        hit.addEventListener('pointerleave', clear);
        hit.addEventListener('focus', () => { const r = hit.getBoundingClientRect(); show(r.left + r.width / 2, r.top + 40); });
        hit.addEventListener('blur', clear);
        return { g, rects, totalLabel };
      });
    }

    function animateTo(f, first) {
      const L = layout(f);
      if (!first) {
        // Rebuild the grid for the new scale
        gridG.replaceChildren();
        yLabels = [];
        for (let v = 0; v <= L.max; v += L.step) {
          const yy = L.y(v);
          svg('line', { x1: m.l, x2: W - m.r, y1: yy, y2: yy }, gridG);
          const t = svg('text', { x: m.l - 8, y: yy + 4, 'text-anchor': 'end' }, gridG);
          t.textContent = fmt(v);
          yLabels.push(t);
        }
        if (window.gsap && !reduce) window.gsap.from(gridG.children, { opacity: 0, duration: 0.5, stagger: 0.02 });
      }
      L.cols.forEach((col, i) => {
        col.segs.forEach((s, k) => {
          const r = bars[i].rects[k];
          if (window.gsap && !reduce) {
            window.gsap.to(r, { attr: { y: s.y, height: s.h }, duration: first ? 1.1 : 0.7, ease: 'expo.out', delay: first ? i * 0.06 + k * 0.05 : 0 });
          } else { r.setAttribute('y', s.y); r.setAttribute('height', s.h); }
        });
        const lab = bars[i].totalLabel;
        lab.textContent = W >= 520 ? fmt(col.total) : '';
        if (window.gsap && !reduce) window.gsap.to(lab, { attr: { y: L.y(col.total) - 7 }, duration: first ? 1.1 : 0.7, ease: 'expo.out', delay: first ? i * 0.06 + 0.2 : 0 });
        else lab.setAttribute('y', L.y(col.total) - 7);
      });
    }

    focusListeners.add((key) => {
      buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(THEMES[i].key === key)));
      if (node) animateTo(key, false);
    });

    build();
    onEnter(fig, (animate) => { entered = true; if (animate) animateTo(focused, true); else build(); });
    let lastW = W;
    new ResizeObserver(() => { const w = Math.round(plot.clientWidth); if (w && w !== lastW) { lastW = w; build(); } }).observe(plot);
  }

  // ---------------------------------------------------------------------------
  // Ring chart: albums by theme
  // ---------------------------------------------------------------------------
  function themes(fig) {
    if (!fig) return;
    const plot = fig.querySelector('.chart__plot');
    const S = 300, cx = S / 2, cy = S / 2, r0 = 86, r1 = 132;
    const sum = Object.values(ALBUMS).reduce((a, b) => a + b, 0);

    srTable(fig, 'Albums by theme', ['Theme', 'Albums'], THEMES.map((t) => [t.label, ALBUMS[t.key]]));

    const node = svg('svg', { viewBox: `0 0 ${S} ${S}`, role: 'img', 'aria-label': `Ring chart of ${sum} albums by theme. Detailed figures follow in a table.` }, plot);
    plot.style.maxWidth = '340px';
    plot.style.marginInline = 'auto';
    const center = html('div', { class: 'ring-center' }, plot);
    const big = html('strong', {}, center);
    const small = html('span', {}, center);
    const setCenter = (n, label) => { big.textContent = n; small.textContent = label; };
    setCenter(sum, 'albums since 2012');

    const arc = (a0, a1, ra, rb) => {
      if (a1 - a0 <= 0.0001) return '';
      const p = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const [x0, y0] = p(rb, a0), [x1, y1] = p(rb, a1), [x2, y2] = p(ra, a1), [x3, y3] = p(ra, a0);
      return `M${x0},${y0}A${rb},${rb} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${ra},${ra} 0 ${large} 0 ${x3},${y3}Z`;
    };

    let acc = 0;
    const segs = THEMES.map((t) => {
      const a0 = (acc / sum) * Math.PI * 2;
      acc += ALBUMS[t.key];
      const a1 = (acc / sum) * Math.PI * 2;
      const path = svg('path', {
        class: 'ring-seg', fill: t.color, stroke: '#FFF4DA', 'stroke-width': 3, 'stroke-linejoin': 'round',
        tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': `Focus ${t.label}: ${ALBUMS[t.key]} albums`,
      }, node);
      const mid = (a0 + a1) / 2;
      return { t, a0, a1, path, mid };
    });

    const state = { p: 0 };
    const draw = () => {
      const lim = state.p * Math.PI * 2;
      segs.forEach((s) => s.path.setAttribute('d', arc(s.a0, Math.min(s.a1, Math.max(s.a0, lim)), r0, r1)));
    };
    draw();

    const highlight = (key) => {
      segs.forEach((s) => s.path.setAttribute('aria-pressed', String(focused === s.t.key)));
      segs.forEach((s) => {
        const on = !key || s.t.key === key;
        s.path.classList.toggle('is-dim', !on);
        const push = key && s.t.key === key ? 8 : 0;
        const tx = Math.sin(s.mid) * push, ty = -Math.cos(s.mid) * push;
        if (window.gsap && !reduce) window.gsap.to(s.path, { x: tx, y: ty, duration: 0.45, ease: 'expo.out' });
        else s.path.setAttribute('transform', `translate(${tx} ${ty})`);
      });
      const s = segs.find((x) => x.t.key === key);
      if (s) setCenter(ALBUMS[key], `${s.t.label} albums`);
      else setCenter(sum, 'albums since 2012');
    };

    segs.forEach((s) => {
      const enter = () => highlight(s.t.key);
      const leave = () => highlight(focused);
      s.path.addEventListener('pointerenter', enter);
      s.path.addEventListener('pointerleave', leave);
      s.path.addEventListener('focus', enter);
      s.path.addEventListener('blur', leave);
      s.path.addEventListener('click', () => setFocus(focused === s.t.key ? null : s.t.key));
      s.path.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFocus(focused === s.t.key ? null : s.t.key); } });
    });
    focusListeners.add(highlight);

    onEnter(fig, (animate) => {
      if (!animate) { state.p = 1; draw(); return; }
      window.gsap.to(state, { p: 1, duration: 1.4, ease: 'expo.out', onUpdate: draw });
      window.gsap.fromTo(big, { textContent: 0 }, { textContent: sum, duration: 1.4, ease: 'expo.out', snap: { textContent: 1 } });
    });
  }

  // ---------------------------------------------------------------------------
  // Week chart: opening hours, with a live "now" line in Malaysia time
  // ---------------------------------------------------------------------------
  function week(fig) {
    if (!fig) return;
    const plot = fig.querySelector('.chart__plot');
    const H_ = window.PAC?.hours;
    if (!H_) return;
    const { HOURS, DAY_NAMES, fmtTime, malaysiaNow } = H_;
    const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const START = 5 * 60, END = 21 * 60;
    const rowH = 44, barH = 24;
    const m = { t: 34, r: 12, b: 30, l: 50 };
    const H = m.t + rowH * 7 + m.b;
    let W = 0, entered = false, nowG;

    srTable(fig, 'Opening hours', ['Day', 'Hours'], DAY_NAMES.map((d, i) => [d, HOURS[i] ? `${fmtTime(HOURS[i][0])} to ${fmtTime(HOURS[i][1])}` : 'Closed']));

    function build() {
      W = Math.round(plot.clientWidth);
      if (!W) return;
      const x = (mins) => m.l + ((mins - START) / (END - START)) * (W - m.l - m.r);
      const { dow, mins } = malaysiaNow();
      plot.replaceChildren();
      const node = svg('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Opening hours for each day of the week. Detailed hours follow in a table.' }, plot);
      const axis = svg('g', { class: 'axis' }, node);
      for (let h = 6; h <= 21; h += 3) {
        const xx = x(h * 60);
        svg('line', { x1: xx, x2: xx, y1: m.t - 6, y2: H - m.b + 4 }, axis);
        const t = svg('text', { x: xx, y: H - 8, 'text-anchor': 'middle' }, axis);
        t.textContent = fmtTime(h * 60);
      }
      const bars = [];
      HOURS.forEach((span, i) => {
        const yy = m.t + i * rowH + (rowH - barH) / 2;
        const lab = svg('text', { class: 'day-label', x: 0, y: yy + barH / 2 + 5 }, node);
        lab.textContent = SHORT[i];
        svg('rect', { class: 'slot', x: m.l, y: yy, width: W - m.l - m.r, height: barH, rx: barH / 2 }, node);
        if (span) {
          const bar = svg('rect', {
            class: 'open' + (i === dow ? ' is-today' : ''), x: x(span[0]), y: yy, height: barH, rx: barH / 2,
            width: entered || reduce ? x(span[1]) - x(span[0]) : 0,
          }, node);
          bars.push({ bar, w: x(span[1]) - x(span[0]), i });
        } else {
          const t = svg('text', { class: 'closed-label', x: m.l + 14, y: yy + barH / 2 + 5 }, node);
          t.textContent = 'Closed';
        }
        const hit = svg('rect', { class: 'row-hit', x: 0, y: m.t + i * rowH, width: W, height: rowH }, node);
        const show = (cx, cy) => {
          const hrs = span ? (span[1] - span[0]) / 60 : 0;
          showTip(tipContent(DAY_NAMES[i] + (i === dow ? ' (today)' : ''), [{ label: span ? `${fmtTime(span[0])} to ${fmtTime(span[1])}` : 'Closed', value: span ? `${hrs} h` : '' }]), cx, cy);
        };
        hit.addEventListener('pointermove', (e) => show(e.clientX, e.clientY));
        hit.addEventListener('pointerleave', hideTip);
      });

      // Live "now" marker
      nowG = svg('g', {}, node);
      if (mins >= START && mins <= END) {
        const nx = x(mins);
        const rowY = m.t + dow * rowH;
        svg('line', { class: 'now', x1: nx, x2: nx, y1: m.t - 8, y2: rowY + rowH - 6 }, nowG);
        svg('circle', { class: 'now-dot', cx: nx, cy: rowY + rowH / 2, r: 5 }, nowG);
        const label = `Now ${fmtTime(mins)}`;
        const pw = label.length * 7 + 16;
        const px = Math.min(Math.max(nx - pw / 2, m.l), W - m.r - pw);
        svg('rect', { class: 'now-pill', x: px, y: m.t - 30, width: pw, height: 22, rx: 11 }, nowG);
        const t = svg('text', { class: 'now-label', x: px + pw / 2, y: m.t - 15, 'text-anchor': 'middle' }, nowG);
        t.textContent = label;
      }
      return bars;
    }

    let bars = build() || [];
    onEnter(fig, (animate) => {
      entered = true;
      if (!animate) { bars = build() || []; return; }
      bars.forEach(({ bar, w, i }) => window.gsap.to(bar, { attr: { width: w }, duration: 1.3, ease: 'expo.out', delay: i * 0.08 }));
      window.gsap.from(nowG, { opacity: 0, duration: 0.6, delay: 1 });
    });
    let lastW = W;
    new ResizeObserver(() => { const w = Math.round(plot.clientWidth); if (w && w !== lastW) { lastW = w; bars = build() || []; } }).observe(plot);
    setInterval(() => { if (entered) bars = build() || []; }, 60_000);
  }

  window.PACCharts = { years, themes, week, THEMES };
})();
