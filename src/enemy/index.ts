import p5 from 'p5';
import { SqureCollider } from '../collider/squre';
import { DungeonMap } from '../dungeon/map';

const MAX_SPAN = 60;

export class Enemy extends SqureCollider{

  private span: number;
  public isAlive: boolean;

  public constructor(pos: p5.Vector, vel: p5.Vector, size: number) {
    super(pos, vel, size);
    this.span = MAX_SPAN;
    this.isAlive = true;
  }

  public update(p : p5) {

    if(this.span < MAX_SPAN) {
      this.span++;
      super.update(p);
      return;
    }

    const r = Math.floor(Math.random() * 4);
    switch(r) {
      case 0:
        this.vel.x = 1;
        this.vel.y = 0;
        break;
      case 1:
        this.vel.x = 0;
        this.vel.y = 1;
        break;
      case 2:
        this.vel.x = -1;
        this.vel.y = 0;
        break;
      case 3:
        this.vel.x = 1;
        this.vel.y = 0;
        break;
    }

    this.span = 0;
    super.update(p);
  }

  public draw(p: p5) {

    p.push();

    p.noStroke();
    p.translate(this.pos.x, this.pos.y);
    p.rectMode(p.CENTER);
    p.fill('red');
    p.rect(0, 0, this.size, this.size);

    p.pop();
  }

  public checkCollisionWithWall(map: DungeonMap, tileSize: number) : [boolean, boolean] {
    const r = super.checkCollisionWithWall(map, tileSize);

    if(r[0]) {

      this.vel.x *= -1;

    } else if(r[1]) {

      this.vel.y *= -1;

    }

    return r;
  }
}
