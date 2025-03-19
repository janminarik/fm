import { BaseMapper } from "@repo/fm-shared";
import { ClassTransformOptions } from "class-transformer";

export class BaseDtoMapper extends BaseMapper {
  private options: ClassTransformOptions = { excludeExtraneousValues: true };

  public override to<TTarget, TSource>(
    target: new () => TTarget,
    source: TSource,
  ): TTarget {
    return super.to(target, source, this.options);
  }

  public override toList<TTarget, TSource>(
    target: new () => TTarget,
    sourceList: TSource[],
  ): TTarget[] {
    return super.toList(target, sourceList, this.options);
  }
}
