import { toast } from "sonner";
import { AppToast, type ToastVariant } from "@/components/shared/app-toast";

const DEFAULT_DURATION = 5000;

type NotifyOptions = {
  /** Same id = the toast is replaced instead of stacked (also avoids duplicates in dev). */
  id?: string | number;
  duration?: number;
};

function show(
  variant: ToastVariant,
  title: string,
  message?: string,
  options: NotifyOptions = {}
) {
  const duration = options.duration ?? DEFAULT_DURATION;
  return toast.custom(
    (id) => (
      <AppToast
        id={id}
        variant={variant}
        title={title}
        message={message}
        duration={duration}
      />
    ),
    { id: options.id, duration }
  );
}

/** Use this everywhere instead of alert(). */
export const notify = {
  success: (title: string, message?: string, options?: NotifyOptions) =>
    show("success", title, message, options),
  error: (title: string, message?: string, options?: NotifyOptions) =>
    show("error", title, message, options),
  info: (title: string, message?: string, options?: NotifyOptions) =>
    show("info", title, message, options),
  warning: (title: string, message?: string, options?: NotifyOptions) =>
    show("warning", title, message, options),
};
