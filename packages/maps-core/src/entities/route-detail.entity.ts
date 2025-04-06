import { BaseEntity } from "./base.entity";
import { RoutePoint } from "./route-point.entity";

export class RouteDetail extends BaseEntity {
  distance?: string;
  duration?: string;
  ascent?: string;
  descent?: string;
  points: RoutePoint[] = [];
}
