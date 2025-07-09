import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { aiService } from "@/services/aiServicce";
import type { Message, Preference, AllFilterOptions } from "../../types";
import type { SkincareAdvisorRequestBody } from "../../types";

export const useSkincareAI = () => {
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [preference, setPreference] = useState<Preference>("AM/PM");
  const [budget, setBudget] = useState(50);
  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedUserSkinType, setSelectedUserSkinType] = useState<string | undefined>(undefined);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedUses, setSelectedUses] = useState<string[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const {
    data: allFilterOptions,
    isLoading: isFilterOptionsLoading,
    error: filterOptionsError,
  } = useQuery<AllFilterOptions, Error>({
    queryKey: ["filterOptions"],
    queryFn: aiService.getFilterOptions,
    staleTime: Infinity,
  });

  const { mutate: getAdvice, isPending: isAnalyzing } = useMutation({
    mutationFn: (payload: SkincareAdvisorRequestBody) => aiService.getSkincareAdvice(payload),
    onSuccess: (recommendationData) => {
      if (recommendationData && (recommendationData.routineRecommendation || recommendationData.error || recommendationData.info)) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            recommendation: recommendationData,
            isUser: false,
          },
        ]);
      } else {
        const unexpectedMsg = "Received an unexpected response format from the server.";
        toast.error(unexpectedMsg);
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: unexpectedMsg, isUser: false }]);
      }
    },
    onError: (error) => {
      const errorMessage = error.message || "An unexpected error occurred.";
      toast.error(`Failed to connect: ${errorMessage}`);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: `Error: ${errorMessage}`, isUser: false }]);
    },
  });

  const handleImageUpload = useCallback((base64DataUrl: string) => setUploadedImageBase64(base64DataUrl), []);
  const handleImageRemove = useCallback(() => setUploadedImageBase64(null), []);

  const handleSubmit = useCallback(() => {
    if (!uploadedImageBase64) {
      toast.error("Please upload a photo of your face first");
      return;
    }

    const userMessageSummary = `Looking for a ${preference} routine, budget around $${budget}.`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMessageSummary, isUser: true, imageUrl: uploadedImageBase64 },
    ]);

    const payload: SkincareAdvisorRequestBody = {
      base64Image: uploadedImageBase64,
      userBudgetUSD: budget,
      userSchedulePreference: preference,
      userPreferredSkinType: selectedUserSkinType,
      preferredBrands: selectedBrands,
      preferredIngredients: selectedIngredients,
      preferredProductTypes: selectedProductTypes,
      preferredUses: selectedUses,
      preferredCharacteristics: selectedCharacteristics,
      preferredSizes: selectedSizes,
    };

    getAdvice(payload);
  }, [
    uploadedImageBase64,
    preference,
    budget,
    selectedUserSkinType,
    selectedBrands,
    selectedIngredients,
    selectedProductTypes,
    selectedUses,
    selectedCharacteristics,
    selectedSizes,
    getAdvice,
  ]);

  const handleClearAllFilters = () => {
    setSelectedUserSkinType(undefined);
    setSelectedBrands([]);
    setSelectedIngredients([]);
    setSelectedProductTypes([]);
    setSelectedUses([]);
    setSelectedCharacteristics([]);
    setSelectedSizes([]);
    toast.info("All filters cleared!");
  };

  return {
    uploadedImageBase64,
    preference,
    budget,
    messages,
    isAnalyzing,
    allFilterOptions,
    isFilterOptionsLoading,
    filterOptionsError,
    selectedUserSkinType,
    selectedBrands,
    selectedIngredients,
    selectedProductTypes,
    selectedUses,
    selectedCharacteristics,
    selectedSizes,
    setPreference,
    setBudget,
    setSelectedUserSkinType,
    setSelectedBrands,
    setSelectedIngredients,
    setSelectedProductTypes,
    setSelectedUses,
    setSelectedCharacteristics,
    setSelectedSizes,
    handleImageUpload,
    handleImageRemove,
    handleSubmit,
    handleClearAllFilters,
  };
};