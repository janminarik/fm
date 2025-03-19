export const parseFilterQuery = <T>(filter: string): T => {
  const parsedFilter = filter ? JSON.parse(filter) : undefined;
  const query: any = {};
  if (parsedFilter) {
    Object.entries(parsedFilter).forEach(([field, conditions]) => {
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
    });
  }

  return query as T;
};
