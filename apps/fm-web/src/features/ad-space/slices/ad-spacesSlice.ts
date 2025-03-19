import { createDataGridSlice } from "../../../shared/slices/datagridSlice";

export const adSpacesSlice = createDataGridSlice("adSpacesList");
export const adSpacesReducer = adSpacesSlice.reducer;
