import { GridColDef } from "@mui/x-data-grid";

function CustomersPage() {
  const colDef = { flex: 1 };

  const columns: GridColDef[] = [
    { ...colDef, field: "firstName", headerName: "First Name" },
    { ...colDef, field: "lastName", headerName: "Last Name" },
    { ...colDef, field: "email", headerName: "Email" },
    { ...colDef, field: "phoneNumber", headerName: "Phone Number" },
  ];

  return (
    <div>
      CUSTOMERS
      {/* <DataGridWrapper
        columns={columns}
        createEntityRoute={ROUTES.CUSTOMER_CREATE}
        editEntityRoute={ROUTES.CUSTOMERS}
        rowContextMenu={{ show: true, showDelete: true, showEdit: true }}
        slice={customersSlice}
        useDeleteEntityMutation={apiCustomers.useDeleteCustomerMutation}
        useGetEntitiesQuery={apiCustomers.useGetCustomersQuery}
      ></DataGridWrapper> */}
    </div>
  );
}

export default CustomersPage;
