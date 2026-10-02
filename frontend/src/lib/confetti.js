export const fireConfetti = () => {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "200",
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const colors = ["#F5A623", "#0F5257", "#FF6F5E", "#2FBF9F", "#FFC157"];
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.4;

  const particles = Array.from({ length: 50 }, () => ({
    x: originX,
    y: originY,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 11 - 3,
    size: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0,
  }));

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((p) => {
      p.vy += 0.3;
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;

      if (p.life < 70) {
        alive = true;
        ctx.globalAlpha = 1 - p.life / 70;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });

    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  };

  tick();
};
