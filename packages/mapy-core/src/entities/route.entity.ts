export class Route {
  name: string;
  distance?: number; // v km
  duration?: number; // v hodinách

  constructor(name: string, distance?: number, duration?: number) {
    this.name = name;
    this.distance = distance;
    this.duration = duration;
  }
}
