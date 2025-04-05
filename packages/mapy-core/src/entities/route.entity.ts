export class Route {
  dataId: string;
  name: string;
  distance?: number; // v km
  duration?: number; // v hodinách
  formattedDuration?: string;

  constructor(
    dataId: string,
    name: string,
    distance?: number,
    duration?: number,
    formattedDuration?: string,
  ) {
    this.name = name;
    this.distance = distance;
    this.duration = duration;
    this.formattedDuration = formattedDuration;
  }
}
