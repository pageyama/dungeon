import { random } from '../random'
export type TileType = 'floor' | 'wall' | 'path' | 'area_wall';

export type Config = {
  col: number;
  row: number;
  minRoomCol: number;
  minRoomRow: number;
  roomPadding: number;
  maxArea: number;
};

export type TilePosition = {
  col: number,
  row: number,
}

export class DungeonMap {
  public tileSize: number;
  public readonly map: TileType[][];
  private areas: Area[];

  public constructor(map: TileType[][], areas: Area[]) {
    this.map = map;
    this.areas = areas;
  }

  public isWall(x: number, y: number, tileSize: number): boolean {

    try {
      var {col, row} = this.findRowColByPos(x, y, tileSize);
    } catch(e) {
      throw e;
    }

    const cell = this.map[row][col];
    return cell == 'wall' || cell == 'area_wall';
  }

  public choiceRandomFloor(areaID: number) : TilePosition {
    const room = this.areas.find(a => a.id == areaID).room;
    const row = random(room.top, room.bottom + 1);
    const col = random(room.left, room.right + 1);

    return {
      col : col,
      row : row,
    };
  }

  public get areaIDs(): number[] {
    return this.areas.map(a => a.id);
  }

  public findAreaIDByPosition(x: number, y: number, tileSize: number): number {

    try {
      var {col, row} = this.findRowColByPos(x, y, tileSize);
    } catch(e) {
      throw e;
    }

    const area = this.areas.find(a => {
      return a.room.top <= row && row <= a.room.bottom && a.room.left <= col && col <= a.room.right;
    });

    if(area == null) {
      return -1;
    }

    return area.id;
  }

  public findRowColByPos(x: number, y: number, tileSize: number): TilePosition {
    const row = Math.floor(y / tileSize);
    const col = Math.floor(x / tileSize);

    const rowSize = this.map.length;
    const colSize = this.map[0].length;

    if(row < 0 || rowSize - 1 < row || col < 0 || colSize - 1 < col) {
      throw new Error('not found');
    }

    return {
      col : col,
      row: row,
    };
  }
};

export class DungeonMapGenerator {

  private col: number;
  private row: number;
  private minRoomCol: number;
  private minRoomRow: number;
  private roomPadding: number;
  private minAreaCol: number;
  private minAreaRow: number;
  private maxArea: number;

  public constructor(config: Config) {
    this.col = config.col;
    this.row = config.row;
    this.minRoomCol = config.minRoomCol;
    this.minRoomRow = config.minRoomRow
    this.roomPadding = config.roomPadding;
    this.minAreaCol = this.minRoomCol + this.roomPadding * 2;
    this.minAreaRow = this.minRoomRow + this.roomPadding * 2;
    this.maxArea = config.maxArea;
  }

  public generate(): DungeonMap {

    const map = this.newMap();

    const areas = this.splitAreas(new Area(0, 0, 0, this.col, this.row));

    areas.forEach(a => a.randomizeRoom(this.minRoomCol, this.minRoomRow, this.roomPadding));

    areas.forEach(a => {
      for(let r = 0; r < a.height; r++) {
        for(let c = 0; c < a.width; c++) {
          if(r == 0 || r == a.height - 1 || c == 0 || c == a.width - 1) {
            map[r + a.top][c + a.left] = 'area_wall';
          }
        }
      }
    });

    areas.forEach(a => {
      for(let r = 0; r < a.room.height; r++) {
        for(let c = 0; c < a.room.width; c++) {
          map[r + a.room.top][c + a.room.left] = 'floor';
        }
      }
    });

    //console.log(areas);

    this.extendPath(map, areas);

    return new DungeonMap(map, areas);
  }

  private newMap() : TileType[][] {
    const map: TileType[][] = [];

    for(let i = 0; i < this.row; i++) {
      const r: TileType[] = [];
      for(let j = 0; j < this.col; j++) {
        r.push('wall');
      }
      map.push(r);
    }

    return map;
  }

  private splitAreas(root: Area) : Area[] {

    const areas: Area[] = [];
    areas.push(root);

    let area = root;
    let counter = 0;

    while(areas.length < this.maxArea && this.isSplitable(area)) {
      areas.push(this.splitArea(area, ++counter));
      area = areas.reduce((a, b) => a.area > b.area ? a : b);
    }

    return areas;
  }

  private isSplitable(area: Area) {
    return area.width > this.minAreaCol * 2 || area.height > this.minAreaRow * 2;
  }

  private splitArea(area: Area, newID: number) : Area {

    const vartically = area.width >= area.height && area.width > this.minAreaCol * 2;
    const other = new Area(newID, area.left, area.top, area.width, area.height);

    if(vartically) {
      const s = area.left + this.minAreaCol - 1;
      const e = area.right - this.minAreaCol + 1;
      const p = random(s, e);

      area.right = p;
      other.left = p;

    } else {
      const s = area.top + this.minAreaRow - 1;
      const e = area.bottom - this.minAreaRow + 1;
      const p = random(s, e);

      area.bottom = p;
      other.top = p;
    }

    return other;
  }

  private extendPath(map: TileType[][], areas: Area[]) {
    areas.forEach(a => {

      if(a.top != 0) {
        const p = random(a.room.left, a.room.right + 1);
        for(let i = a.room.top - 1; i >= a.top; i--) {
          map[i][p] = 'path';
        }
      }

      if(a.bottom != this.row - 1) {
        const p = random(a.room.left, a.room.right + 1);
        for(let i = a.room.bottom + 1; i <= a.bottom; i++) {
          map[i][p] = 'path';
        }
      }

      if(a.left != 0) {
        const p = random(a.room.top, a.room.bottom + 1);
        for(let i = a.room.left - 1; i >= a.left; i--) {
          map[p][i] = 'path';
        }
      }

      if(a.right != this.col - 1) {
        const p = random(a.room.top, a.room.bottom + 1);
        for(let i = a.room.right + 1; i <= a.right; i++) {
          map[p][i] = 'path';
        }
      }

    });

    areas.forEach(a => {

      if(a.top != 0) {
        let sx = -1;
        let ex = -1;

        for(let i = a.left; i < a.right; i++) {
          const cell = map[a.top][i];
          if(sx == -1 && cell == 'path') {
            sx = i;
          } else if(sx != -1 && cell == 'path') {
            ex = i;
          }
        }

        if(sx != -1 && ex != -1) {
          for(let i = sx; i <= ex; i++) {
            map[a.top][i] = 'path';
          }
        } else if(sx != -1 && ex == -1 && map[a.top - 1][sx] != 'path') {
          map[a.top][sx] = 'area_wall';

          for(let i = a.top + 1; i < a.room.top; i++) {
            map[i][sx] = 'wall';
          }
        }
      }

      if(a.left != 0) {

        let sy = -1;
        let ey = -1;

        for(let i = a.top; i < a.bottom; i++) {
          const cell = map[i][a.left];
          if(sy == -1 && cell == 'path') {
            sy = i;
          } else if(sy != -1 && cell == 'path') {
            ey = i;
          }
        }

        if(sy != -1 && ey != -1) {
          for(let i = sy; i <= ey; i++) {
            map[i][a.left] = 'path';
          }
        } else if(sy != -1 && ey == -1 && map[sy][a.left - 1] != 'path') {
          map[sy][a.left] = 'area_wall';

          for(let i = a.left + 1; i < a.room.left; i++) {
            map[sy][i] = 'wall';
          }
        }
      }

    });

  }

}

class Rect {
  protected sx: number;
  protected sy: number;
  protected ex: number;
  protected ey: number;

  public constructor(x: number, y: number, w: number, h: number) {
    this.sx = x;
    this.sy = y;
    this.ex = x + w - 1;
    this.ey = y + h - 1;
  }

  public get top(): number {
    return this.sy;
  }

  public set top(top: number) {
    this.sy = top;
  }

  public get bottom(): number {
    return this.ey;
  }

  public set bottom(bottom: number) {
    this.ey = bottom;
  }

  public get left(): number {
    return this.sx;
  }

  public set left(left: number) {
    this.sx = left;
  }

  public get right(): number {
    return this.ex;
  }

  public set right(right: number) {
    this.ex = right;
  }

  public get width(): number {
    return this.ex - this.sx + 1;
  }

  public get height(): number {
    return this.ey - this.sy + 1;
  }

  public get area(): number {
    return this.width * this.height;
  }
}

class Area extends Rect {
  public readonly id: number;
  public readonly room: Rect;

  public constructor(id: number, x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.id = id;
    this.room = new Rect(x + 1, y + 1, w - 2, h - 2);
  }

  public get top(): number {
    return this.sy;
  }

  public set top(top: number) {
    this.sy = top;
    this.room.top = top + 1;
  }

  public get bottom(): number {
    return this.ey;
  }

  public set bottom(bottom: number) {
    this.ey = bottom;
    this.room.bottom = bottom - 1;
  }

  public get left(): number {
    return this.sx;
  }

  public set left(left: number) {
    this.sx = left;
    this.room.left = left + 1;
  }

  public get right(): number {
    return this.ex;
  }

  public set right(right: number) {
    this.ex = right;
    this.room.right = right - 1;
  }

  public randomizeRoom(minRoomCol: number, minRoomRow: number, roomPadding: number) {

    const width = random(minRoomCol, this.width - roomPadding * 2 + 1);
    const height = random(minRoomRow, this.height - roomPadding * 2 + 1);

    this.room.left = random(this.left + roomPadding, this.right - width - roomPadding + 2);
    this.room.top = random(this.top + roomPadding, this.bottom - height - roomPadding + 2);

    this.room.right = this.room.left + width - 1;
    this.room.bottom = this.room.top + height - 1;
  }
}
