import { Toaster } from "sonner";
import { useAppSelector } from "../../store/hook";

export const AppToaster = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <Toaster position="top-right" theme={theme} richColors closeButton expand />
  );
};
