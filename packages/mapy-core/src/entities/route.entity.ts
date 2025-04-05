export class Route {
  dataId: string;
  name: string;
  distance?: number; // v km
  duration?: number; // v hodinách

  constructor(
    dataId: string,
    name: string,
    distance?: number,
    duration?: number,
  ) {
    this.name = name;
    this.distance = distance;
    this.duration = duration;
  }
}
