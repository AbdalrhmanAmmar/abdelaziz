import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const ConfirmDelete = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone. The data will be permanently removed.",
}: ConfirmDeleteProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
          <AlertDialogCancel disabled={isLoading} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
