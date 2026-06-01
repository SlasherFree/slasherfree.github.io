// Fondo de fluido automático: canvas con nubes rosadas que se mueven sobre negro
(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let ratio = window.devicePixelRatio || 1;
  let w = 0, h = 0;

  function resize(){
    ratio = window.devicePixelRatio || 1;
    w = Math.max(1, Math.floor(window.innerWidth));
    h = Math.max(1, Math.floor(window.innerHeight));
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,w,h);
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [];

  function addBlob(){
    const size = 35 + Math.random()*45;
    blobs.push({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5) * 0.3,
      vy: (Math.random()-0.5) * 0.2,
      r: size,
      phase: Math.random()*Math.PI*2,
      alpha: 0.12 + Math.random()*0.12
    });
    if(blobs.length > 20) blobs.shift();
  }

  for(let i=0;i<20;i++) addBlob();

  function drawBlob(blob){
    const gradient = ctx.createRadialGradient(blob.x, blob.y, blob.r * 0.08, blob.x, blob.y, blob.r);
    gradient.addColorStop(0, `rgba(251,205,235,${Math.min(0.5, blob.alpha + 0.14)})`);
    gradient.addColorStop(0.24, `rgba(251,205,235,${Math.min(0.34, blob.alpha)})`);
    gradient.addColorStop(1, 'rgba(251,205,235,0)');

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function loop(){
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(0,0,w,h);

    ctx.globalCompositeOperation = 'lighter';
    for(const blob of blobs){
      drawBlob(blob);
      blob.x += blob.vx + Math.sin(blob.phase) * 0.15;
      blob.y += blob.vy + Math.cos(blob.phase) * 0.1;
      blob.phase += 0.0025;
      if(blob.x < -blob.r) blob.x = w + blob.r;
      if(blob.x > w + blob.r) blob.x = -blob.r;
      if(blob.y < -blob.r) blob.y = h + blob.r;
      if(blob.y > h + blob.r) blob.y = -blob.r;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
