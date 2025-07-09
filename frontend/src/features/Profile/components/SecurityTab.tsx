import { useAuth } from "@/contexts/auth.context";
import { toast } from "sonner";
import { type ChangePasswordFormData, ChangePasswordForm } from "./ChangePasswordForm";

export const SecurityTab = () => {
  const { actions } = useAuth();

  const handleSubmit = async (data: ChangePasswordFormData) => {
    try {
      await actions.changePassword(data.oldPassword, data.newPassword);
      
      toast.success("Password Changed Successfully!", {
        description: "You will now be logged out for security purposes. Please log in again with your new password.",
        duration: 5000,
        onAutoClose: () => actions.logout(),
      });
    } catch (error) {
        let errorMessage = "An unexpected error occurred. Please check your current password and try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast.error("Failed to Change Password", {
          description: errorMessage
        });
    }
  };

  return (
    <ChangePasswordForm
      onSubmit={handleSubmit}
      isSubmitting={actions.isChangingPassword}
    />
  );
};