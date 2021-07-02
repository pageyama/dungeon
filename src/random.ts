export function random (min : number, max : number) : number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function sample<T>(array: T[]): T {
  return array[random(0, array.length)];
}
