import { Result, err, ok } from "neverthrow";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { BackendErrorPayload, User } from "@/types/auth";
import { ApiError } from "@/utils/axios/error";
import { clearTokens, setTokens } from "@/utils/tokenManager";

interface AuthActionHandlerDependencies {
  fetchUserProfile: () => Promise<Result<User, ApiError>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useAuthActionHandlers({
  fetchUserProfile,
  setUser,
  setIsAuthenticated,
  setIsLoading,
}: AuthActionHandlerDependencies) {
  const navigate = useNavigate();

  const resetAuthStatesOnError = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  }, [setUser, setIsAuthenticated, setIsLoading]);

  const handleSuccessfulInitialAuth = useCallback(
    async (
      tokens: { access_token: string; refresh_token: string },
      uiMessages: { successTitle: string; successDescription: string; profileFetchErrorDefault: string },
      getNavigationPath: (role: string) => string
    ): Promise<Result<User, ApiError>> => {
      setTokens(tokens.access_token, tokens.refresh_token);
      const profileResult = await fetchUserProfile();
      if (profileResult.isOk()) {
        toast.success(uiMessages.successTitle, { description: uiMessages.successDescription });
        navigate(getNavigationPath(profileResult.value.role));
        setIsLoading(false);
        return ok(profileResult.value);
      } else {
        toast.error(`${uiMessages.successTitle} Succeeded, But Profile Fetch Failed.`, {
          description: profileResult.error.message || uiMessages.profileFetchErrorDefault,
        });
        resetAuthStatesOnError();
        return err(profileResult.error);
      }
    },
    [fetchUserProfile, navigate, resetAuthStatesOnError, setIsLoading]
  );

  const handleInitialAuthFailure = useCallback(
    (error: ApiError, uiMessages: { errorTitle: string; errorDescriptionDefault: string }): Result<User, ApiError> => {
      const errorData = error.data as Partial<BackendErrorPayload>;
      const errorDescription = errorData?.message || error.message || uiMessages.errorDescriptionDefault;
      toast.error(uiMessages.errorTitle, { description: errorDescription });
      resetAuthStatesOnError();
      return err(error);
    },
    [resetAuthStatesOnError]
  );

  return {
    resetAuthStatesOnError,
    handleSuccessfulInitialAuth,
    handleInitialAuthFailure,
  };
}
