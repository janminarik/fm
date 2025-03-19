import { ReactNode, Suspense } from "react";
import { useTranslation } from "react-i18next";

import { TRANSLATIONS_NAMESPACES } from "../../i18n/config";
import Loader from "./Loader";

interface SuspenseWrapperProps {
  children: ReactNode;
  message?: string;
}

function SuspenseWrapper({ children, message }: SuspenseWrapperProps) {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.SHARED);
  return (
    <Suspense
      fallback={<Loader message={message ?? t("loader.messages.default")} />}
    >
      {children}
    </Suspense>
  );
}

export default SuspenseWrapper;
