import { createDataGridSlice } from "../../../shared/slices/datagridSlice";

export const customersSlice = createDataGridSlice("customersList");
export const customersReducer = customersSlice.reducer;
