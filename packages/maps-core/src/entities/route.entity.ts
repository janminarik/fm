export class Route {
  dataId: string;
  name: string;
  distance?: number; // v km
  duration?: number; // v hodinách
  displayDuration?: string;
  displayDistance?: string;
  detail?: RouteDetail;

  constructor(dataId: string, name: string) {
    this.dataId = dataId;
    this.name = name;
  }
}

export class RouteDetail {
  distance?: string;
  duration?: string;
  ascent?: string;
  descent?: string;
  points: RoutePoint[] = [];
}

export class RoutePoint {
  coordinate: Coordinate | undefined;
  constructor(public coordinateString: string) {
    this.coordinate = this.parseCoordinates(coordinateString);
  }

  parseCoordinates(coordinateString: string): Coordinate | undefined {
    const [lat, lon] = coordinateString.split(", ");
    if (lat && lon) {
      const latitude = parseFloat(lat.slice(0, -1));
      const longitude = parseFloat(lon.slice(0, -1));
      const latDirection = lat.slice(-1) as "N" | "S";
      const lonDirection = lon.slice(-1) as "E" | "W";

      return { latitude, longitude, latDirection, lonDirection };
    }
  }
}

type Coordinate = {
  latitude: number;
  longitude: number;
  latDirection: "N" | "S";
  lonDirection: "E" | "W";
};

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
