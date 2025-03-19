import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ReactNode } from "react";

import Loader from "./Loader";

interface FormProps {
  cancel?: () => void;
  cancelLabel?: string;
  children: ReactNode;
  error?: any;
  isError?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  save?: (e: React.FormEvent) => void;
  saveLabel?: string;
  title: string;
}

function Form({
  cancel,
  cancelLabel,
  children,
  error,
  isError,
  isLoading,
  isSaving,
  save,
  saveLabel,
  title,
}: FormProps) {
  return (
    <Grid
      component="form"
      container
      sx={{ justifyContent: { lg: "flex-start", xs: "center" } }}
    >
      <Grid size={{ lg: 6, md: 8, sm: 10, xl: 4, xs: 12 }}>
        <Card sx={{ position: "relative" }}>
          <CardHeader title={title}></CardHeader>
          {(isLoading || isSaving) && (
            <Loader
              isOverlay={true}
              message={isSaving ? "Saving data..." : undefined}
            />
          )}
          {!isLoading && (
            <CardContent sx={{ margin: 0, paddingTop: 0 }}>
              {children}
            </CardContent>
          )}
          <CardActions sx={{ justifyContent: "flex-end" }}>
            {save && (
              <Button
                color="primary"
                disabled={isSaving}
                onClick={save}
                type="submit"
              >
                {saveLabel ? saveLabel : "Save"}
              </Button>
            )}
            {cancel && (
              <Button color="secondary" disabled={isSaving} onClick={cancel}>
                {cancelLabel ? cancelLabel : "Cancel"}
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Form;
