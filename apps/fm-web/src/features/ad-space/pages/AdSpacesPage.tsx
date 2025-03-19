import { GridColDef } from "@mui/x-data-grid";

import DataGridWrapper, {
  createEnumFilter,
  dataGridWrapperStringOperators,
} from "../../../shared/components/DataGridWrapper";
import {
  useDeleteAdSpaceMutation,
  useGetAdSpacesQuery,
} from "../api/apiAdSpace";
import { ROUTES } from "../config/routes";
import { adSpacesSlice } from "../slices/ad-spacesSlice";
import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "../types/common";

function AdSpacesPage() {
  const colDef = { flex: 1 };

  const columns: GridColDef[] = [
    {
      ...colDef,
      field: "name",
      filterOperators: dataGridWrapperStringOperators,
      headerName: "Name",
    },
    {
      ...colDef,
      field: "type",
      filterOperators: createEnumFilter(AdSpaceType),
      headerName: "Type",
    },
    {
      ...colDef,
      field: "status",
      filterOperators: createEnumFilter(AdSpaceStatus),
      headerName: "Status",
    },
    {
      ...colDef,
      field: "visibility",
      filterOperators: createEnumFilter(AdSpaceVisibility),
      headerName: "Visibility",
    },
    { ...colDef, field: "createdAt", filterable: false, headerName: "Created" },
  ];

  return (
    <DataGridWrapper
      columns={columns}
      createEntityRoute={ROUTES.AD_SPACE_CREATE}
      editEntityRoute={ROUTES.AD_SPACE_EDIT}
      initialState={{
        sorting: {
          sortModel: [{ field: "createdAt", sort: "desc" }],
        },
      }}
      rowContextMenu={{ show: true, showDelete: true, showEdit: true }}
      slice={adSpacesSlice}
      useDeleteEntityMutation={useDeleteAdSpaceMutation}
      useGetEntitiesQuery={useGetAdSpacesQuery}
    ></DataGridWrapper>
  );
}

export default AdSpacesPage;
