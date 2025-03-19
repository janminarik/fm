export type EnumLike = { [key: string]: string | number };

export function mapEnumValue<TargetEnum extends EnumLike>(
  value: any,
  targetEnum: TargetEnum,
) {
  return targetEnum[value as keyof TargetEnum];
}

// function mapEnum<SourceEnum, TargetEnum>(
//   sourceEnum: SourceEnum,
//   targetEnum: TargetEnum,
//   value: SourceEnum[keyof SourceEnum]
// ): TargetEnum[keyof TargetEnum] {
//   const key = Object.keys(sourceEnum).find(
//     k => sourceEnum[k as keyof SourceEnum] === value
//   );
//   if (!key) {
//     throw new Error(`Kľúč pre hodnotu ${value} nebol nájdený v zdrojovom enum`);
//   }
//   return targetEnum[key as keyof TargetEnum];
// }
