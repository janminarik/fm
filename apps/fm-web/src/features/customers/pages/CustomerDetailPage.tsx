import {
  Box,
  FormControl,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "../../../shared/components/Form";
import {
  useCreateCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "../api/customersApi";
import { CreateCustomer } from "../types/customer";

const textFieldSx: SxProps<TextFieldProps & Theme> = { mt: 3 };

interface CustomerForm {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [formValue, setFormValues] = useState<CustomerForm>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  //TODO refacktoring

  const skipQuery = id === undefined;

  //GET
  const {
    data: customer,
    error: errorGetCustomer,
    isError: isErrorGetCustomer,
    isFetching: isLoadingGetCustomer,
  } = useGetCustomerByIdQuery(id!, { skip: skipQuery });

  //PUT
  const [updateCustomer, updateResult] = useUpdateCustomerMutation();
  const {
    data: updateCustomerData,
    error: errorUpdateCustomer,
    isError: isErrorUpdateCustomer,
    isLoading: isUpdatingCustomer,
    isSuccess: isSucessUpdateCustomer,
  } = updateResult;

  //POST
  const [createCustomer, createResult] = useCreateCustomerMutation();
  const {
    data: createCustomerData,
    error: errorCreateCustomer,
    isError: isErrorCreateCustomer,
    isLoading: isCreateCustomer,
    isSuccess: isSucessCreateCustomer,
  } = updateResult;

  //merge
  const isLoading =
    isLoadingGetCustomer || isUpdatingCustomer || isCreateCustomer;
  const isError =
    isErrorGetCustomer || isErrorUpdateCustomer || isErrorCreateCustomer;
  const error = errorGetCustomer || errorUpdateCustomer || errorCreateCustomer;

  useEffect(() => {
    if (isEditMode) {
      setFormValues({
        email: customer?.email || "",
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        phoneNumber: customer?.phoneNumber || "",
      });
    }
  }, [customer, isEditMode]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (isEditMode) {
      const customerToUpdate = {
        id: id!,
        ...customer,
        ...formValue,
        updatedAt: new Date(),
      };
      const updatedCustomer = await updateCustomer({
        body: customerToUpdate,
        id: id!,
      });
      if (updatedCustomer) {
        navigate(-1);
      }
    } else {
      const newCustomer: CreateCustomer = { ...formValue, isVerified: false };
      const createdCustomer = await createCustomer(newCustomer).unwrap();
      if (createdCustomer) {
        navigate(-1);
      }
    }
  };

  const handleInputChange = (
    field: keyof CustomerForm,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormValues((prev) => {
      return { ...prev, [field]: event.target.value };
    });
  };

  const formContent = (
    <FormControl>
      <TextField
        label="First name"
        onChange={(event) => handleInputChange("firstName", event)}
        size="small"
        sx={textFieldSx}
        value={formValue.firstName}
      ></TextField>
      <TextField
        label="Last name"
        onChange={(event) => handleInputChange("lastName", event)}
        size="small"
        sx={textFieldSx}
        value={formValue.lastName}
      ></TextField>
      <TextField
        label="email"
        onChange={(event) => handleInputChange("email", event)}
        size="small"
        sx={textFieldSx}
        type="email"
        value={formValue.email}
      ></TextField>
      <TextField
        label="phone"
        onChange={(event) => handleInputChange("phoneNumber", event)}
        size="small"
        sx={textFieldSx}
        value={formValue.phoneNumber}
      ></TextField>
    </FormControl>
  );

  return (
    <Box m={2}>
      <Form
        cancel={handleBack}
        cancelLabel="BACK"
        error={error}
        isError={isError}
        isLoading={isLoading}
        isSaving={isUpdatingCustomer}
        save={handleSave}
        title="Customer detail"
      >
        {formContent}
      </Form>
    </Box>
  );
}

export default CustomerDetailPage;
