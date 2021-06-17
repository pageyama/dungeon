import p5 from 'p5';
import { Actor } from '../actor';
import { Dungeon } from '../dungeon';

export class SqureCollider extends Actor{

  protected size: number;
  protected sizeHalf: number;

  public constructor(pos: p5.Vector, vel: p5.Vector, size: number) {
    super(pos, vel);

    this.size = size;
    this.sizeHalf = size / 2;
  }

  public checkCollisionWithWall(dungeon: Dungeon) : [boolean, boolean] {

    let r : [boolean, boolean] = [false, false];

    if(this.vel.x != 0) {
      const y = this.pos.y - this.vel.y;

      if(this.vel.x < 0) {
        const topLeft = dungeon.map.isWall(this.left, y - this.sizeHalf, dungeon.tileSize);
        const bottomLeft = dungeon.map.isWall(this.left, y + this.sizeHalf, dungeon.tileSize);

        if(topLeft || bottomLeft) {
          this.pos.x += dungeon.tileSize - this.left % dungeon.tileSize;
          r[0] = true;
        }

      } else if(this.vel.x > 0) {
        const topRight = dungeon.map.isWall(this.right, y - this.sizeHalf, dungeon.tileSize);
        const bottomRight = dungeon.map.isWall(this.right, y + this.sizeHalf, dungeon.tileSize);

        if(topRight || bottomRight) {
          this.pos.x -= this.right % dungeon.tileSize + 1;
          r[0] = true;
        }
      }

    }

    if(this.vel.y != 0) {
      const x = this.pos.x - this.vel.x;

      if(this.vel.y < 0) {
        const topLeft = dungeon.map.isWall(x - this.sizeHalf, this.top, dungeon.tileSize);
        const topRight = dungeon.map.isWall(x + this.sizeHalf, this.top, dungeon.tileSize);

        if(topLeft || topRight) {
          this.pos.y += dungeon.tileSize - this.top % dungeon.tileSize;
          r[1] = true;
        }

      } else if(this.vel.y > 0) {
        const bottomLeft = dungeon.map.isWall(x - this.sizeHalf, this.bottom, dungeon.tileSize);
        const bottomRight = dungeon.map.isWall(x + this.sizeHalf, this.bottom, dungeon.tileSize);

        if(bottomLeft || bottomRight) {
          this.pos.y -= this.bottom % dungeon.tileSize + 1;
          r[1] = true;
        }
      }

    }

    return r;
  }

  public isCollidedWithPoint(x: number, y: number): boolean {
    return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
  }

  public get top(): number {
    return this.pos.y - this.sizeHalf;
  }

  public get bottom(): number {
    return this.pos.y + this.sizeHalf;
  }

  public get left(): number {
    return this.pos.x - this.sizeHalf;
  }

  public get right(): number {
    return this.pos.x + this.sizeHalf;
  }
}
