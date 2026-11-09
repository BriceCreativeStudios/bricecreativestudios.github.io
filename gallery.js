"use strict";
(() => {
  const links = [...document.querySelectorAll('[data-shot]')];
  if (!links.length) return;
  const shots = links.map(a => ({src: a.getAttribute('href'), alt: a.querySelector('img').alt}));
  const image = document.getElementById('gallery-image');
  const open = document.getElementById('gallery-open');
  const dialog = document.getElementById('screenshot-dialog');
  const enlarged = document.getElementById('dialog-image');
  let index = 0;
  function show(next) {
    index = (next + shots.length) % shots.length;
    const shot = shots[index];
    image.src = shot.src; image.alt = shot.alt; open.href = shot.src;
    enlarged.src = shot.src; enlarged.alt = shot.alt;
    const caption = `${index + 1} / ${shots.length} — ${shot.alt}`;
    document.getElementById('gallery-caption').textContent = caption;
    document.getElementById('dialog-caption').textContent = caption;
    links.forEach((a, i) => { if (i === index) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
  }
  function wire(id, direction) {
    const b = document.getElementById(id); b.hidden = false;
    b.addEventListener('click', () => show(index + direction));
  }
  wire('gallery-prev', -1); wire('gallery-next', 1);
  wire('dialog-prev', -1); wire('dialog-next', 1);
  links.forEach((a,i) => a.addEventListener('click', e => { e.preventDefault(); show(i); }));
  let suppressClick = false;
  open.addEventListener('click', e => {
    if (suppressClick) { e.preventDefault(); return; }
    if (typeof dialog.showModal === 'function') { e.preventDefault(); show(index); dialog.showModal(); document.getElementById('dialog-close').focus(); }
  });
  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => open.focus());
  function keyboard(e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  }
  document.getElementById('gallery').addEventListener('keydown', keyboard);
  dialog.addEventListener('keydown', keyboard);
  function swipe(surface) {
    let start = null;
    surface.addEventListener('pointerdown', e => { start = [e.clientX,e.clientY]; surface.setPointerCapture(e.pointerId); });
    surface.addEventListener('pointerup', e => {
      if (!start) return;
      const dx = e.clientX-start[0], dy=e.clientY-start[1]; start=null;
      if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3) {
        e.preventDefault(); show(index + (dx<0 ? 1 : -1)); suppressClick=true;
        setTimeout(() => { suppressClick=false; },400);
      }
    });
    surface.addEventListener('pointercancel', () => { start=null; });
    surface.addEventListener('dragstart', e => e.preventDefault());
  }
  swipe(open); swipe(enlarged); show(0);
})();
