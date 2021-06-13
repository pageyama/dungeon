import p5 from 'p5';
import { Game } from './game';
import { Dungeon } from './dungeon/index';

export class Player {

  private pos: p5.Vector;
  private vel: p5.Vector;
  private size: number;
  private sizeHalf: number;

  private directions: Map<string, p5.Vector>;

  public constructor(x: number, y: number, size: number, speed: number) {
    this.pos = Game.P5.createVector(x, y);
    this.size = size;
    this.sizeHalf = size / 2;
    this.directions = newDirectionMap(speed);
    this.vel = this.directions['IDLE'];
  }

  public draw(p: p5) {
    p.push();

    p.noStroke();
    p.translate(this.pos.x, this.pos.y);
    p.rectMode(p.CENTER);
    p.fill('blue');
    p.rect(0, 0, this.size, this.size);

    p.pop();
  }

  public update(_p: p5) {
    this.pos.add(this.vel);
  }

  public keyPressed(keyCode: number) {
    if(DIRECTION_KEYS.includes(keyCode)) {
      let x = this.vel.x;
      let y = this.vel.y;

      switch(keyCode) {
        case 87:
          //w
          y = -1;
          break;
        case 83:
          //s
          y = 1;
          break;
        case 65:
          //a
          x = -1;
          break;
        case 68:
          //d
          x = 1;
          break;
      }

      this.vel = this.selectDirection(x, y);
    }
  }

  public keyReleased(keyCode: number) {
    if(DIRECTION_KEYS.includes(keyCode)) {
      let x = this.vel.x;
      let y = this.vel.y;

      if(keyCode == 87 || keyCode == 83) {

        if(Game.P5.keyIsDown(83)) {
          y = 1;
        } else if(Game.P5.keyIsDown(87)){
          y = -1;
        } else {
          y = 0;
        }

      } else if(keyCode == 65 || keyCode == 68) {

        if(Game.P5.keyIsDown(68)) {
          x = 1;
        } else if(Game.P5.keyIsDown(65)){
          x = -1;
        } else {
          x = 0;
        }

      }

      this.vel = this.selectDirection(x, y);
    }

  }

  public selectDirection(x: number, y: number) {
    if(y < 0) {
      if(x == 0) {
        return this.directions['UP'];
      } else if(x < 0) {
        return this.directions['UP_LEFT'];
      } else if(x > 0) {
        return this.directions['UP_RIGHT'];
      }
    } else if (y > 0) {
      if(x == 0) {
        return this.directions['DOWN'];
      } else if(x < 0) {
        return this.directions['DOWN_LEFT'];
      } else if(x > 0) {
        return this.directions['DOWN_RIGHT'];
      }
    } else {
      if(x == 0) {
        return this.directions['IDLE'];
      } else if(x < 0) {
        return this.directions['LEFT'];
      } else if(x > 0) {
        return this.directions['RIGHT'];
      }
    }
  }

  public checkCollisionWithWall(dungeon: Dungeon) {

    if(this.vel.x != 0) {
      const x = this.pos.x;
      const y = this.pos.y - this.vel.y;

      if(this.vel.x < 0) {
        const left = x - this.sizeHalf;
        const topLeft = dungeon.isWall(left, y - this.sizeHalf);
        const bottomLeft = dungeon.isWall(left, y + this.sizeHalf);

        if(topLeft || bottomLeft) {
          this.pos.x += dungeon.tileSize - left % dungeon.tileSize;
        }

      } else if(this.vel.x > 0) {
        const right = x + this.sizeHalf;
        const topRight = dungeon.isWall(right, y - this.sizeHalf);
        const bottomRight = dungeon.isWall(right, y + this.sizeHalf);

        if(topRight || bottomRight) {
          this.pos.x -= right % dungeon.tileSize + 1;
        }
      }

    }

    if(this.vel.y != 0) {
      const x = this.pos.x - this.vel.x;
      const y = this.pos.y;

      if(this.vel.y < 0) {
        const top = y - this.sizeHalf;
        const topLeft = dungeon.isWall(x - this.sizeHalf, top);
        const topRight = dungeon.isWall(x + this.sizeHalf, top);

        if(topLeft || topRight) {
          this.pos.y += dungeon.tileSize - top % dungeon.tileSize;
        }

      } else if(this.vel.y > 0) {
        const bottom = y + this.sizeHalf;
        const bottomLeft = dungeon.isWall(x - this.sizeHalf, bottom);
        const bottomRight = dungeon.isWall(x + this.sizeHalf, bottom);

        if(bottomLeft || bottomRight) {
          this.pos.y -= bottom % dungeon.tileSize + 1;
        }
      }

    }
  }

  public get x(): number {
    return this.pos.x;
  }

  public get y(): number {
    return this.pos.y;
  }
}

const DIRECTION_KEYS = [87, 83, 65, 68];

const newDirectionMap = (speed: number): Map<string, p5.Vector> => {
    const directions = new Map<string, p5.Vector>();
    directions['IDLE'] = Game.P5.createVector(0, 0);

    directions['UP'] = Game.P5.createVector(0, -speed);
    directions['DOWN'] = Game.P5.createVector(0, speed);
    directions['LEFT'] = Game.P5.createVector(-speed, 0);
    directions['RIGHT'] = Game.P5.createVector(speed, 0);

    directions['UP_LEFT'] = Game.P5.createVector(-1, -1).setMag(speed);
    directions['UP_RIGHT'] = Game.P5.createVector(1, -1).setMag(speed);
    directions['DOWN_LEFT'] = Game.P5.createVector(-1, 1).setMag(speed);
    directions['DOWN_RIGHT'] = Game.P5.createVector(1, 1).setMag(speed);

    return directions;
}
