import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  loading: boolean;
  idleLabel: string;
  loadingLabel: string;
};

export function SubmitButton({ loading, idleLabel, loadingLabel }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={loading} className="h-12 w-full gap-2 shadow-md">
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {loadingLabel}
        </>
      ) : (
        <>
          {idleLabel}
          <Icon name="arrow_forward" size={18} />
        </>
      )}
    </Button>
  );
}
