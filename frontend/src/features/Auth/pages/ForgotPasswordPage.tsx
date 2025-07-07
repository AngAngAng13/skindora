import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

const ForgotPasswordFeatures: FeatureProps[] = [
  {
    icon: "🔑",
    title: "Secure & Simple",
    description: "Enter your email to receive a secure link to reset your password.",
  },
  {
    icon: "⚡",
    title: "Quick Recovery",
    description: "Get back to your skincare journey in just a few moments.",
  },
];

export default function ForgotPasswordPage() {
  return (
    <LeftPanel
      title="Forgot Your Password?"
      subtitle="No worries, we'll help you get back into your account."
      features={ForgotPasswordFeatures}
    />
  );
}
