/** Particle pool for game effects. Used for smoke, sparks, dust. */

export type ParticleKind = "smoke" | "spark" | "dust";

export type Particle = {
  alive: boolean;
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export class ParticlePool {
  private pool: Particle[] = [];
  private cap: number;

  constructor(cap: number) {
    this.cap = cap;
  }

  setCap(cap: number) {
    this.cap = cap;
    if (this.pool.length > cap) this.pool.length = cap;
  }

  spawn(kind: ParticleKind, x: number, y: number, count = 1) {
    for (let n = 0; n < count; n++) {
      const p = this.acquire();
      if (!p) return;
      p.alive = true;
      p.kind = kind;
      p.x = x;
      p.y = y;
      if (kind === "smoke") {
        p.vx = (Math.random() - 0.5) * 30;
        p.vy = -40 - Math.random() * 30;
        p.maxLife = 1.0 + Math.random() * 0.4;
        p.size = 4 + Math.random() * 3;
        p.color = "#9ca3af";
      } else if (kind === "spark") {
        const a = Math.random() * Math.PI * 2;
        const s = 120 + Math.random() * 80;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.maxLife = 0.35 + Math.random() * 0.15;
        p.size = 2;
        p.color = Math.random() > 0.5 ? "#fb923c" : "#fde047";
      } else {
        p.vx = (Math.random() - 0.5) * 60;
        p.vy = -20 - Math.random() * 40;
        p.maxLife = 0.6 + Math.random() * 0.3;
        p.size = 3;
        p.color = "#d6c4a3";
      }
      p.life = p.maxLife;
    }
  }

  private acquire(): Particle | null {
    for (const p of this.pool) if (!p.alive) return p;
    if (this.pool.length >= this.cap) return null;
    const fresh: Particle = {
      alive: false, kind: "smoke", x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, color: "",
    };
    this.pool.push(fresh);
    return fresh;
  }

  update(dt: number) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt;
      p.life -= dt;
      if (p.life <= 0) p.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}
