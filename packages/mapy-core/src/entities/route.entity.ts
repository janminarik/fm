export class Route {
  dataId: string;
  name: string;
  distance?: number; // v km
  duration?: number; // v hodinách
  displayDuration?: string;
  displayDistance?: string;
  ascent?: string;
  descent?: string;

  constructor(dataId: string, name: string) {
    this.dataId = dataId;
    this.name = name;
  }
}

// export class Route {
//   dataId: string;
//   name: string;
//   distance?: number; // v km
//   duration?: number; // v hodinách
//   formattedDuration?: string;

//   detail_duration?: string;
//   detail_distance?: string;
//   detail_total_ascent?: string;
//   detail_total_descent?: string;

//   constructor(
//     dataId: string,
//     name: string,
//     distance?: number,
//     duration?: number,
//     formattedDuration?: string,
//   ) {
//     this.dataId = dataId;
//     this.name = name;
//     this.distance = distance;
//     this.duration = duration;
//     this.formattedDuration = formattedDuration;
//   }
// }
