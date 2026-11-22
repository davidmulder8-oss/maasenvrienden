/* Maas en Vrienden - zachte sneeuwval voor het winterthema */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.className = "winter-snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var flakes = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(90, w / 14));
    while (flakes.length < count) flakes.push(makeFlake(true));
    flakes.length = count;
  }
  function makeFlake(anywhere) {
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: 1 + Math.random() * 2.6,
      vy: 0.35 + Math.random() * 0.9,
      sway: Math.random() * Math.PI * 2,
      o: 0.45 + Math.random() * 0.45
    };
  }

  var running = true;
  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy; f.sway += 0.012; f.x += Math.sin(f.sway) * 0.4;
      if (f.y > h + 10) flakes[i] = f = makeFlake(false);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + f.o + ")";
      ctx.shadowColor = "rgba(50,85,95,0.7)";
      ctx.shadowBlur = 3;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();
