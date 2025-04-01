export const parseFilterQuery = <T>(filter: string): T => {
  const parsedFilter = filter
    ? (JSON.parse(filter) as Record<string, Record<string, unknown>>)
    : undefined;
  const query: Record<string, unknown> = {};

  if (parsedFilter) {
    Object.entries(parsedFilter).forEach(([field, conditions]) => {
      if (conditions && typeof conditions === "object") {
        Object.entries(conditions).forEach(([operator, value]) => {
          switch (operator) {
            case "is":
            case "equals":
              query[field] = value;
              break;
            case "doesNotEqual":
              query[field] = { not: value };
              break;
            case "contains":
              query[field] = { contains: value, mode: "insensitive" };
              break;
            case "doesNotContain":
              query[field] = {
                not: { contains: value, mode: "insensitive" },
              };
              break;
            case "startsWith":
              query[field] = { startsWith: value, mode: "insensitive" };
              break;
            case "endsWith":
              query[field] = { endsWith: value, mode: "insensitive" };
              break;
          }
        });
      }
    });
  }

  return query as T;
};
