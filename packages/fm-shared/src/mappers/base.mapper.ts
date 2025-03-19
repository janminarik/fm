import { ClassTransformOptions, plainToInstance } from "class-transformer";

export abstract class BaseMapper {
  public to<TTarget, TSource>(
    target: new () => TTarget,
    source: TSource,
    options?: ClassTransformOptions,
  ): TTarget {
    return plainToInstance(target, source, options);
  }

  public toList<TTarget, TSource>(
    target: new () => TTarget,
    sourceList: TSource[],
    options?: ClassTransformOptions,
  ): TTarget[] {
    return sourceList.map((source: TSource) =>
      this.to<TTarget, TSource>(target, source, options),
    );
  }
}
