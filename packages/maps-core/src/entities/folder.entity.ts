import { BaseEntity } from "./base.entity";
import { Route } from "./route.entity";

export class Folder extends BaseEntity {
  public name: string;
  public routes: Route[] = [];

  constructor(name: string, routes: Route[] = []) {
    super();
    this.name = name;
    this.routes = routes;
  }

  public addRoute(route: Route): void {
    this.routes.push(route);
  }

  public addRoutes(routes: Route[]): void {
    this.routes.push(...routes);
  }

  public removeRoute(index: number): void {
    if (index >= 0 && index < this.routes.length) {
      this.routes.splice(index, 1);
    }
  }
}
