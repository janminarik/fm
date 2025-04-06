import { RouteDetail } from "./route-detail.entity";

export class Route {
  dataId: string;
  name: string;
  // distance?: number; // v km
  // duration?: number; // v hodinách
  // displayDuration?: string;
  // displayDistance?: string;
  detail?: RouteDetail;

  constructor(dataId: string, name: string) {
    this.dataId = dataId;
    this.name = name;
  }
}
