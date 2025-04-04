import { Route } from "./route.entity";

export class Folder {
  public name: string;
  public routes: Route[];
  public totalDistance: number;
  public totalDuration: number;

  constructor(name: string = "", routes: Route[] = []) {
    this.name = name;
    this.routes = routes;
    this.calculateStatistics();
  }

  public addRoute(route: Route): void {
    this.routes.push(route);
    this.calculateStatistics();
  }

  public removeRoute(index: number): void {
    if (index >= 0 && index < this.routes.length) {
      this.routes.splice(index, 1);
      this.calculateStatistics();
    }
  }

  private calculateStatistics(): void {
    this.totalDistance = this.routes.reduce(
      (sum, route) => sum + (route.distance || 0),
      0,
    );
    this.totalDuration = this.routes.reduce(
      (sum, route) => sum + (route.duration || 0),
      0,
    );
  }
}
