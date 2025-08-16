import React from "react";
import { OnboardingFlow } from "./OnboardingFlow";
import { useAuth } from "../auth/hooks/useAuth";

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();

  // 임시 유저 객체 생성
  const tempUser = user || {
    id: "",
    status: "ACTIVE",
    name: "",
    email: "",
    profileImageUrl: "",
    interests: [],
    mbti: "",
    birthYear: 0,
    gender: "" as "male" | "female",
    bio: "",
    phoneNumber: "",
    phone: "",
  };

  return <OnboardingFlow user={tempUser} />;
};
