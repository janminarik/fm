import { Box, MenuItem, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "../../../shared/components/Form";
import { aggregateApiRequestState } from "../../../shared/utils/reduxUtils";
import {
  useCreateAdSpaceMutation,
  useGetAdSpaceByIdQuery,
  useUpdateAdSpaceMutation,
} from "../api/apiAdSpace";
import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "../types/common";
import { CreateAdSpaceDto } from "../types/create-ad-space.dto";
import { UpdateAdSpaceDto } from "../types/update-ad-space.dto";

interface AddSpaceForm {
  name: null | string;
  status: AdSpaceStatus | null;
  type: AdSpaceType | null;
  visibility: AdSpaceVisibility | null;
}

function AdSpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddSpaceForm>({
    name: "",
    status: null,
    type: null,
    visibility: null,
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    status: false,
    type: false,
    visibility: false,
  });

  const adSpaceQuery = useGetAdSpaceByIdQuery(id!, { skip: !id });
  const { data: adSpace, isLoading } = adSpaceQuery;
  const [update, updateResult] = useUpdateAdSpaceMutation();
  const [create, createResult] = useCreateAdSpaceMutation();
  const { errors, isError } = aggregateApiRequestState([
    adSpaceQuery,
    updateResult,
    createResult,
  ]);

  useEffect(() => {
    setFormData({
      name: adSpace?.name ?? "",
      status: adSpace?.status ?? null,
      type: adSpace?.type ?? null,
      visibility: adSpace?.visibility ?? null,
    });
  }, [adSpace]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: false }));
  };

  const isFormValid = (): boolean => {
    const isNameEmpty = formData.name?.trim() === "";

    const newErrors = {
      name: isNameEmpty,
      status: formData.status === null,
      type: formData.type === null,
      visibility: formData.visibility === null,
    };

    setFormErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      if (isEditMode && id) {
        const payload: UpdateAdSpaceDto = { ...formData } as UpdateAdSpaceDto;

        const updatedAdSpace = await update({
          body: payload,
          id: id,
        });

        if (!updatedAdSpace.error) {
          navigate(-1);
        }
      } else {
        const payload: CreateAdSpaceDto = {
          ...(formData as CreateAdSpaceDto),
          address: {
            city: "Trencin",
            country: "Slovakia",
            postalcode: "91108",
            street: "Mateja Bela",
          },
        };
        const createdAdSpace = await create(payload);
        if (!createdAdSpace.error && createdAdSpace.data?.id) {
          navigate(-1);
        }
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formContent = (
    <Stack spacing={3}>
      <TextField
        error={formErrors.name}
        helperText={formErrors.name ? "Name is required" : ""}
        label="Name"
        name="name"
        onChange={handleChange}
        size="small"
        value={formData.name ?? ""}
      ></TextField>
      <TextField
        error={formErrors.type}
        helperText={formErrors.type ? "Type is required" : ""}
        label="Type"
        name="type"
        onChange={handleChange}
        select
        size="small"
        value={formData.type ?? ""}
      >
        {Object.values(AdSpaceType).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        error={formErrors.status}
        helperText={formErrors.status ? "Status is required" : ""}
        label="Status"
        name="status"
        onChange={handleChange}
        select
        size="small"
        value={formData.status ?? ""}
      >
        {Object.values(AdSpaceStatus).map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        error={formErrors.visibility}
        helperText={formErrors.visibility ? "Visibility is required" : ""}
        label="Visibility"
        name="visibility"
        onChange={handleChange}
        select
        size="small"
        value={formData.visibility ?? ""}
      >
        {Object.values(AdSpaceVisibility).map((visibility) => (
          <MenuItem key={visibility} value={visibility}>
            {visibility}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );

  return (
    <Box m={4}>
      <Form
        cancel={handleBack}
        cancelLabel="BACK"
        error={errors?.[0] || undefined}
        isError={isError}
        isLoading={isLoading}
        isSaving={createResult.isLoading || updateResult.isLoading}
        save={handleSubmit}
        title="Ad space"
      >
        {formContent}
      </Form>
    </Box>
  );
}

export default AdSpaceDetailPage;
