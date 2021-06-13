import p5 from 'p5';
import { Game } from './game';

export class Bullet {

  private pos: p5.Vector;
  private vel: p5.Vector;
  private l: p5.Vector;

  public isAlive: boolean;

  public constructor(x: number, y: number, angle: number) {
    this.pos = Game.P5.createVector(x, y);
    this.vel = Game.P5.createVector(1, 0).setMag(8).rotate(angle);
    this.l = this.vel.copy().setMag(4);
    this.isAlive = true;
  }

  public draw(p: p5) {
    p.push();
    p.strokeWeight(4);
    p.stroke(255, 255, 0);
    p.line(this.pos.x, this.pos.y, this.pos.x - this.l.x, this.pos.y - this.l.y);
    p.pop();
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
