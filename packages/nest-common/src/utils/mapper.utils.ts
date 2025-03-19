import { plainToInstance } from "class-transformer";

export class MapperUtils {
  static to<Target, Source>(target: new () => Target, source: Source): Target {
    return plainToInstance(target, source);
  }

  static toArray<Target, Source>(
    target: new () => Target,
    source: Source[],
  ): Target[] {
    return source.map((source) => plainToInstance(target, source));
  }
}
