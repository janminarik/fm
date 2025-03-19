import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";

export const buildSort = <T>(sortModel: GridSortModel) => {
  return sortModel.map((model) => ({
    direction: model.sort as "asc" | "desc",
    field: model.field as keyof T,
  }));
};

export const buildFilter = (filterModel: GridFilterModel) => {
  return filterModel.items.reduce(
    (acc, item) => {
      if (item.value !== undefined && item.field && item.operator) {
        const { field, operator, value } = item;
        if (value)
          switch (operator) {
            case "contains":
              acc[field] = { contains: value };
              break;
            case "doesNotContain":
              acc[field] = { doesNotContain: value };
              break;
            case "doesNotEqual":
              acc[field] = { doesNotEqual: value };
              break;
            case "endsWith":
              acc[field] = { endsWith: value };
              break;
            case "equals":
              acc[field] = { equals: value };
              break;
            case "is":
              acc[field] = { is: value };
              break;
            case "isEmpty":
              acc[field] = { equals: null };
              break;
            case "notEmpty":
              acc[field] = { not: null };
              break;
            case "startsWith":
              acc[field] = { startsWith: value };
              break;
            default:
              break;
          }
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};
