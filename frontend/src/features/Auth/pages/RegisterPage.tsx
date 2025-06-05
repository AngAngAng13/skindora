import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

export default function RegisterPage() {
  return (
    <>
      <LeftPanel
        title="Skindora"
        subtitle="Welcome back to your skincare journey. Sign in to access your account and discover products tailored to your skin's needs."
        features={RegisterFeatures}
      />
    </>
  );
}
const RegisterFeatures: FeatureProps[] = [
  {
    icon: "✨",
    title: "Premium Skincare",
    description: "Access to high-quality skincare products",
  },
  {
    icon: "🔍",
    title: "AI Skin Analysis",
    description: "Get personalized skin recommendations",
  },
];
