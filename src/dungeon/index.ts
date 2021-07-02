import p5 from 'p5';
import { Game } from '../game';
import { DungeonMap } from './map';

export class Dungeon {
  public readonly map: DungeonMap;
  public readonly tileSize: number;

  public constructor(map: DungeonMap, tileSize: number) {
    this.map = map;
    this.tileSize = tileSize;
  }

  public draw(p: p5) {
    const left = Math.max(Math.floor(Game.screen.x / this.tileSize), 0);
    const top = Math.max(Math.floor(Game.screen.y / this.tileSize), 0);

    const tileMap = this.map.map;

    const right = Math.min(Math.floor((Game.screen.x + screen.width) / this.tileSize), tileMap[0].length - 1);
    const bottom = Math.min(Math.floor((Game.screen.y + screen.height) / this.tileSize), tileMap.length - 1);

    p.push();
    p.strokeWeight(2);
    p.stroke(64);

    for(let row = top; row <= bottom; row++) {
      for(let col = left; col <= right; col++) {

        const cell = tileMap[row][col];

        if(cell == 'floor') {
          p.fill(220);
        } else if(cell == 'wall') {
          p.fill(80);
        } else if(cell == 'area_wall') {
          p.fill(40);
        } else if(cell == 'path') {
          p.fill(180);
        }

        p.rect(this.tileSize * col, this.tileSize * row, this.tileSize, this.tileSize);

        /*
        p.fill(255)
        p.textSize(8)
        p.text(col + ", " + row , col * this.tileSize, row * this.tileSize + this.tileSize / 2);
        */
      }
    }

    p.pop();
  }
}
