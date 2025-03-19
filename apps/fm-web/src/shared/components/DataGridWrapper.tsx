import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Button,
  debounce,
  IconButton,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  getGridStringOperators,
  GridCellParams,
  GridColDef,
  GridColumnVisibilityModel,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterModel,
  GridPaginationModel,
  GridRowModel,
  GridRowSelectionModel,
  GridSortModel,
  DataGrid as MuiDataGrid,
} from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AppDispatch, RootState } from "../../app/store";
import { TRANSLATIONS_NAMESPACES } from "../../i18n/config";
import { DataGridSlice, DataGridState } from "../slices/datagridSlice";
import { buildFilter, buildSort } from "../utils/muiUtils";
import { aggregateApiRequestState, QueryParams } from "../utils/reduxUtils";

export const dataGridWrapperStringOperators = getGridStringOperators().filter(
  (operator) =>
    operator.value === "equals" ||
    operator.value === "doesNotEqual" ||
    operator.value === "contains" ||
    operator.value === "doesNotContain" ||
    operator.value === "startsWith" ||
    operator.value === "endsWith",
);

export const createEnumFilter = (enumObj: object) => {
  const EnumFilterComponent = (props: GridFilterInputValueProps) => {
    const { applyValue, item } = props;

    return (
      <Box display="flex" flexDirection="column" height="100%">
        <Box flexGrow={1}></Box>
        <Select
          fullWidth
          onChange={(event) =>
            applyValue({ ...item, value: event.target.value })
          }
          value={item.value || ""}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(enumObj).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  };

  return [
    {
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        if (!filterItem.value) return null;
        return (params: GridCellParams) => params.value === filterItem.value;
      },
      InputComponent: EnumFilterComponent,
      label: "Is",
      value: "is",
    },
  ];
};

export interface DataGridWrapperProps {
  columns: GridColDef[];
  createEntityRoute: string;
  editEntityRoute: string;
  initialState?: GridInitialStateCommunity;
  loadingMessage?: string;
  rowContextMenu: DataGridRowContextMenuConfig;
  slice: DataGridSlice;
  useDeleteEntityMutation?: any;
  useGetEntitiesQuery?: any;
}

type DataGridRowContextMenuConfig = {
  show?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
};

function DataGridWrapper<TEntity extends { id: string }>({
  columns,
  createEntityRoute,
  editEntityRoute,
  initialState,
  loadingMessage,
  rowContextMenu,
  slice,
  useDeleteEntityMutation,
  useGetEntitiesQuery,
}: DataGridWrapperProps) {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.SHARED);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const [contextMenu, setContextMenu] = useState<HTMLButtonElement | null>(
    null,
  );

  const openContexMenu = Boolean(contextMenu);

  const [selectedItem, setSelectedItem] = useState<GridRowModel | null>(null);

  const { columnsVisbility, filters, pagination, selectedItems, sortOptions } =
    useSelector(
      (state: RootState) =>
        state[slice.name as keyof RootState] as DataGridState,
    );

  const {
    setColumnsVisibility,
    setFilters,
    setPage,
    setSelectedItems,
    setSortOptions,
    showAllColumns,
  } = slice.actions;

  const initialSort =
    initialState && initialState.sorting && initialState.sorting.sortModel
      ? buildSort(initialState.sorting.sortModel)
      : undefined;

  const queryParams: QueryParams<TEntity> = useMemo(
    () => ({
      filters: filters
        ? { ...(buildFilter(filters) as Partial<Record<keyof TEntity, any>>) }
        : undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortOptions: sortOptions ? { ...buildSort(sortOptions) } : initialSort,
    }),
    [pagination, sortOptions, filters, initialSort],
  );

  const entitiesQuery = useGetEntitiesQuery(queryParams);

  const { data: result } = entitiesQuery;

  const [deleteEntity, deleteEntityResult] = useDeleteEntityMutation();

  const { errors, isError, isLoading } = aggregateApiRequestState([
    entitiesQuery,
    deleteEntityResult,
  ]);

  const handlePaginationChange = (newModel: GridPaginationModel) =>
    dispatch(setPage(newModel));

  const handleSortChange = (newModel: GridSortModel) =>
    dispatch(setSortOptions(newModel));

  const handleRowSelectionChange = (newModel: GridRowSelectionModel) =>
    dispatch(setSelectedItems(newModel));

  const handleContexMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: GridRowModel<TEntity>,
  ) => {
    setContextMenu(event.currentTarget);
    setSelectedItem(row);
  };
  const handleVisibilityModelChange = (newModel: GridColumnVisibilityModel) => {
    if (Object.keys(newModel).length === 0) {
      dispatch(showAllColumns(true));
    } else {
      dispatch(setColumnsVisibility(newModel));
    }
  };

  const debounceDispatch = useMemo(
    () =>
      debounce((filters: GridFilterModel) => {
        dispatch(setFilters(filters));
      }, 500),
    [dispatch, setFilters],
  );

  const handleFilterChange = useCallback(
    (newModel: GridFilterModel) => {
      debounceDispatch(newModel);
    },
    [debounceDispatch],
  );

  const handleEntityEdit = () =>
    navigate(editEntityRoute.replace(":id", selectedItem?.id ?? ""));

  const handleEntityCreate = () => navigate(createEntityRoute);

  const handleEntityDelete = () => {
    deleteEntity(selectedItem?.id as unknown as { id: string });
    setContextMenu(null);
  };

  const contextColumn = {
    field: "action",
    filterable: false,
    headerName: "",
    renderCell: (params: any) => (
      <>
        <IconButton
          onClick={(event) => {
            handleContexMenuOpen(event, params.row);
          }}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={contextMenu}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          onClose={() => setContextMenu(null)}
          open={openContexMenu}
          slotProps={{
            paper: {
              elevation: 1,
              sx: {
                minWidth: 120,
              },
            },
          }}
          transformOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
        >
          {rowContextMenu.showEdit && (
            <MenuItem onClick={handleEntityEdit}>Edit</MenuItem>
          )}
          {rowContextMenu.showDelete && (
            <MenuItem onClick={handleEntityDelete}>Delete</MenuItem>
          )}
        </Menu>
      </>
    ),
    sortable: false,
  };

  // if (!isError && !isLoading && data) {
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="stretch"
      size={{ xs: 12 }}
    >
      <Grid
        container
        flexDirection="row"
        justifyContent="stretch"
        pt={3}
        size={{ xs: 12 }}
      >
        <Grid container justifyContent="flex-end" mx={4} size={{ xs: 12 }}>
          <Button onClick={handleEntityCreate}>Create</Button>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MuiDataGrid
          columns={rowContextMenu ? [...columns, contextColumn] : columns}
          columnVisibilityModel={columnsVisbility}
          disableColumnSelector
          disableMultipleRowSelection
          disableRowSelectionOnClick
          filterMode="server"
          filterModel={filters}
          initialState={initialState}
          loading={isLoading}
          onColumnVisibilityModelChange={handleVisibilityModelChange}
          onFilterModelChange={handleFilterChange}
          onPaginationModelChange={handlePaginationChange}
          onRowSelectionModelChange={handleRowSelectionChange}
          onSortModelChange={handleSortChange}
          pageSizeOptions={[5, 10, 20, 100]}
          paginationMode="server"
          paginationModel={pagination}
          rowCount={result ? result.meta.total : 0}
          rows={result?.data || []}
          rowSelectionModel={selectedItems}
          sortingMode="server"
          sx={{ m: 4 }}
        ></MuiDataGrid>
      </Grid>
    </Grid>
  );
  // } else if (!isError && isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         alignItems: "center",
  //         display: "flex",
  //         // height: "100vh",
  //         justifyContent: "center",
  //         // width: "100vw",
  //       }}
  //     >
  //       <Loader message={loadingMessage ?? t("loader.messages.default")} />
  //     </Box>
  //   );
  // }
}

export default DataGridWrapper;
