import p5 from 'p5';

export class Actor {
  protected pos: p5.Vector;
  protected vel: p5.Vector;

  public constructor(pos: p5.Vector, vel: p5.Vector) {
    this.pos = pos;
    this.vel = vel;
  }

  public update(_p: p5) {
    this.pos.add(this.vel);
  }

  public get x(): number {
    return this.pos.x;
  }

  public get y(): number {
    return this.pos.y;
  }
}
