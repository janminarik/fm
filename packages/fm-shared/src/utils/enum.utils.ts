export type EnumLike = { [key: string]: string | number };

export function mapEnumValue<TargetEnum extends EnumLike>(
  value: unknown,
  targetEnum: TargetEnum,
) {
  return targetEnum[value as keyof TargetEnum];
}
