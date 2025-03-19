import {
  GridColumnVisibilityModel,
  GridFilterModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DataGridState {
  columnsVisbility?: GridColumnVisibilityModel;
  filters?: GridFilterModel;
  pagination: GridPaginationModel;
  selectedItems?: GridRowSelectionModel;
  sortOptions?: GridSortModel;
}

const initialState: DataGridState = {
  pagination: { page: 0, pageSize: 10 },
};

export const createDataGridSlice = (name: string) => {
  return createSlice({
    extraReducers: (builder) => {},
    initialState,
    name: name,
    reducers: {
      setColumnsVisibility(
        state: DataGridState,
        action: PayloadAction<GridColumnVisibilityModel>,
      ) {
        state.columnsVisbility = {
          ...state.columnsVisbility,
          ...action.payload,
        };
      },
      setFilters(state: DataGridState, action: PayloadAction<GridFilterModel>) {
        state.filters = action.payload;
      },
      setPage(
        state: DataGridState,
        action: PayloadAction<GridPaginationModel>,
      ) {
        state.pagination = action.payload;
      },
      setSelectedItems(
        state: DataGridState,
        action: PayloadAction<GridRowSelectionModel>,
      ) {
        state.selectedItems = action.payload;
      },
      setSortOptions(
        state: DataGridState,
        action: PayloadAction<GridSortModel>,
      ) {
        state.sortOptions = action.payload;
      },
      showAllColumns(state: DataGridState, action: PayloadAction<boolean>) {
        for (const field in state.columnsVisbility) {
          state.columnsVisbility[field] = action.payload;
        }
      },
    },
  });
};

export const dataGridActions = (
  slice: ReturnType<typeof createDataGridSlice>,
) => slice.actions;

export interface DataGridSlice {
  actions: ReturnType<typeof dataGridActions>;
  name: string;
}
