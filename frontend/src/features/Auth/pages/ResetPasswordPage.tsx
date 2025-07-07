import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

const ResetPasswordFeatures: FeatureProps[] = [
  {
    icon: "🔒",
    title: "Secure Reset",
    description: "Your password will be encrypted and secure.",
  },
  {
    icon: "✨",
    title: "Instant Access",
    description: "Get back to your skincare journey immediately.",
  },
];

export default function ResetPasswordPage() {
  return (
    <LeftPanel
      title="Reset Your Password"
      subtitle="Create a new secure password for your Skindora account to continue your skincare journey."
      features={ResetPasswordFeatures}
    />
  );
}
