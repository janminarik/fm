import { BaseEntity } from "./base.entity";

type Coordinate = {
  latitude: number;
  longitude: number;
  latDirection: "N" | "S";
  lonDirection: "E" | "W";
};

export class RoutePoint extends BaseEntity {
  coordinate: Coordinate | null;

  constructor(public coordinateString: string) {
    super();
    this.coordinate = this.parseCoordinates(coordinateString);
  }

  parseCoordinates(coordinateString: string): Coordinate | null {
    const [lat, lon] = coordinateString.split(", ");
    if (lat && lon) {
      const latitude = parseFloat(lat.slice(0, -1));
      const longitude = parseFloat(lon.slice(0, -1));
      const latDirection = lat.slice(-1) as "N" | "S";
      const lonDirection = lon.slice(-1) as "E" | "W";

      return { latitude, longitude, latDirection, lonDirection };
    }
    return null;
  }
}
