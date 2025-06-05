import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth.context";
import { setTokens } from "@/utils/tokenManager";

export function useHandleOAuthCallback(): { isProcessingOAuth: boolean; error: string | null } {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchUserProfile } = useAuth();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const { accessToken, refreshToken, newUserParam } = getOAuthParams(searchParams);

    if (accessToken && refreshToken) {
      setIsProcessingOAuth(true);
      setCallbackError(null);
      setTokens(accessToken, refreshToken);

      const newSearchParams = new URLSearchParams(searchParams);
      console.log("OAuth callback search params:", newSearchParams.toString());
      cleanOAuthParams(newSearchParams);
      setSearchParams(newSearchParams, { replace: true });
      fetchUserProfile().then((profileResult) => {
        if (profileResult.isOk()) {
          if (newUserParam === "1") {
            toast.success("Google account linked successfully!", { description: "Welcome to Skindora!" });
            navigate("/");
          } else {
            toast.success("Logged in successfully with Google!", { description: "Welcome back!" });
            navigate("/");
          }
        } else {
          const errMsg = profileResult.error.message || "Could not finalize Google login.";
          console.error("Error fetching profile after Google OAuth:", profileResult.error.data || errMsg);
          toast.error("Authentication Error", { description: errMsg });
          setCallbackError(errMsg);
        }
        setIsProcessingOAuth(false);
      });
    } else {
      setIsProcessingOAuth(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setSearchParams, fetchUserProfile]);

  return { isProcessingOAuth, error: callbackError };
}

const getOAuthParams = (searchParams: URLSearchParams) => ({
  accessToken: searchParams.get("access_token"),
  refreshToken: searchParams.get("refresh_token"),
  newUserParam: searchParams.get("new_user"),
});
const cleanOAuthParams = (searchParams: URLSearchParams) => {
  searchParams.delete("access_token");
  searchParams.delete("refresh_token");
  searchParams.delete("new_user");
  return searchParams;
};
