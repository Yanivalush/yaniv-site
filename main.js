// Shared behaviour: gentle reveal, the shrinking header, the phone menu and the copy-email button.
(function(){
  // reveal only what starts below the first screen, so the page is complete at rest
  var els = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function(el){ if(el.getBoundingClientRect().top > innerHeight){ el.classList.add('pre'); io.observe(el); } });
  }

  var hdr = document.querySelector('.hdr');
  if(hdr) addEventListener('scroll', function(){ hdr.classList.toggle('small', scrollY > 300); }, { passive: true });

  var btn = document.querySelector('.menu-btn'), drawer = document.getElementById('drawer');
  if(btn && drawer){
    var setOpen = function(open){
      drawer.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'סגירת התפריט' : 'פתיחת התפריט');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', function(){ setOpen(drawer.hidden); });
    drawer.addEventListener('click', function(e){ if(e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', function(e){ if(e.key === 'Escape' && !drawer.hidden){ setOpen(false); btn.focus(); } });
  }

  var copy = document.getElementById('copyMail');
  if(copy){
    copy.addEventListener('click', function(){
      var lbl = copy.querySelector('.lbl'), addr = copy.querySelector('.mail');
      var done = function(t){ lbl.textContent = t; setTimeout(function(){ lbl.textContent = 'העתקה'; }, 2200); };
      if(navigator.clipboard){
        navigator.clipboard.writeText(addr.textContent.trim()).then(function(){ done('הועתק ✓'); }, select);
      } else select();
      function select(){ var r = document.createRange(); r.selectNodeContents(addr); var s = getSelection(); s.removeAllRanges(); s.addRange(r); done('מסומן להעתקה'); }
    });
  }
})();
