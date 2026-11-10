"use strict";
(() => {
 const links=[...document.querySelectorAll('[data-shot]')]; if(!links.length)return;
 const shots=links.map(a=>({src:a.getAttribute('href'),alt:a.querySelector('img').alt,caption:a.dataset.caption||a.querySelector('img').alt,detail:a.dataset.detail||''}));
 const image=document.getElementById('gallery-image'),open=document.getElementById('gallery-open'),dialog=document.getElementById('screenshot-dialog'),enlarged=document.getElementById('dialog-image'),close=document.getElementById('dialog-close');
 let index=0,returnFocus=open,suppressUntil=0;
 function show(next){index=(next+shots.length)%shots.length;const s=shots[index];image.src=s.src;image.alt=s.alt;open.href=s.src;enlarged.src=s.src;enlarged.alt=s.alt;const caption=`${index+1} / ${shots.length} — ${s.caption}`;document.getElementById('gallery-caption').textContent=caption;document.getElementById('dialog-caption').textContent=caption;const detail=document.getElementById('shot-detail');if(detail)detail.textContent=s.detail;links.forEach((a,i)=>{if(i===index)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
 function enlarge(trigger){if(typeof dialog.showModal!=='function')return false;returnFocus=trigger;if(!dialog.open){dialog.showModal();close.focus();}return true;}
 links.forEach((a,i)=>{a.setAttribute('aria-label',`Enlarge screenshot ${i+1}: ${shots[i].caption}`);a.addEventListener('click',e=>{show(i);if(enlarge(a))e.preventDefault();});});
 open.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();return;}if(enlarge(open))e.preventDefault();});
 for(const [id,direction] of [['gallery-prev',-1],['gallery-next',1],['dialog-prev',-1],['dialog-next',1]]){const b=document.getElementById(id);b.hidden=shots.length<2;b.addEventListener('click',()=>show(index+direction));}
 close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>returnFocus.focus({preventScroll:true}));
 function keys(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowLeft'?-1:1));}}
 document.getElementById('gallery').addEventListener('keydown',keys);dialog.addEventListener('keydown',keys);
 function swipe(surface){let start=null;surface.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;start=[e.clientX,e.clientY,e.pointerId];surface.setPointerCapture(e.pointerId);});surface.addEventListener('pointerup',e=>{if(!start||start[2]!==e.pointerId)return;const dx=e.clientX-start[0],dy=e.clientY-start[1];start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){e.preventDefault();show(index+(dx<0?1:-1));suppressUntil=performance.now()+450;}});surface.addEventListener('pointercancel',()=>{start=null;});surface.addEventListener('dragstart',e=>e.preventDefault());}
 // Enlarged-image taps deliberately have no resize, toggle, close or navigation action.
 swipe(open);swipe(enlarged);show(0);
})();
