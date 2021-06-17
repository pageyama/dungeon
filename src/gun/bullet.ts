import p5 from 'p5';
import { Game } from '../game';
import { Actor } from '../actor';

export class Bullet extends Actor {

  private l: p5.Vector;

  public isAlive: boolean;

  public constructor(x: number, y: number, angle: number) {
    const pos = Game.P5.createVector(x, y);
    const vel = Game.P5.createVector(1, 0).setMag(8).rotate(angle);

    super(pos, vel);

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
}
