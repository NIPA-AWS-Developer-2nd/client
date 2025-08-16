import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  userApiService,
  phoneApiService,
  type OnboardingRequest,
  type UserProfile,
  type District,
  type Category,
  type Hashtag,
} from "../services";
import { cachedApiCall } from "../utils/apiCache";
import type { LocationData, AccountStatus } from "../../types";
import type { User } from "../../features/auth/hooks/useAuth";

interface OnboardingState {
  // 온보딩 단계
  currentStep: number;

  // 폼 데이터
  formData: {
    phoneNumber: string;
    phoneVerified: boolean;
    verificationCode: string;
    nickname: string;
    birthYear: string;
    gender: "male" | "female" | "";
    bio: string;
    profileImageUrl: string;
    interests: string[];
    moods: string[]; // 분위기 선택
    mbti: string;
    districtId: string;
    locationData?: LocationData;
  };

  // API 데이터
  districts: District[];
  categories: Category[];
  hashtags: Hashtag[];

  // 로딩 상태
  isLoading: boolean;
  isSubmitting: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;

  // 에러 상태
  error: string | null;

  // 상태
  isVerificationCodeSent: boolean;
  accountMerged: boolean; // 계정 통합 여부
  _onboardingCompleted?: boolean; // 내부 상태: 통합된 계정의 온보딩 완료 여부
  existingUserInfo: User | null; // 계정 통합 시 기존 사용자 정보

  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<OnboardingState["formData"]>) => void;
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyCode: (phoneNumber: string, code: string) => Promise<void>;

  // API Actions
  loadStaticData: () => Promise<void>;
  loadHashtags: () => Promise<void>;
  submitOnboarding: () => Promise<UserProfile>;

  // 리셋
  reset: () => void;
}

const initialFormData = {
  phoneNumber: "",
  phoneVerified: false,
  verificationCode: "",
  nickname: "",
  birthYear: "",
  gender: "" as "male" | "female" | "",
  bio: "",
  profileImageUrl: "",
  interests: [],
  moods: [],
  mbti: "",
  districtId: "",
  locationData: undefined,
};

export const useOnboardingStore = create<OnboardingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      formData: initialFormData,
      districts: [],
      categories: [],
      hashtags: [],
      isLoading: false,
      isSubmitting: false,
      isSendingCode: false,
      isVerifyingCode: false,
      error: null,
      isVerificationCodeSent: false,
      accountMerged: false,
      _onboardingCompleted: undefined,
      existingUserInfo: null,

      // Actions
      setCurrentStep: (step: number) => {
        set({ currentStep: step, error: null });
      },

      updateFormData: (data: Partial<OnboardingState["formData"]>) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
          error: null,
        }));
      },

      sendVerificationCode: async (phoneNumber: string) => {
        set({ isSendingCode: true, error: null });
        try {
          await phoneApiService.sendCode(phoneNumber);
          set({
            isSendingCode: false,
            isVerificationCodeSent: true,
            error: null,
          });
        } catch (error) {
          console.error("Failed to send verification code:", error);
          set({
            error: "인증번호 전송에 실패했습니다.",
            isSendingCode: false,
          });
          throw error;
        }
      },

      verifyCode: async (phoneNumber: string, code: string) => {
        set({ isVerifyingCode: true, error: null });
        try {
          const result = await phoneApiService.verifyCode(phoneNumber, code);

          // 계정 통합이 발생한 경우
          if (result.merged) {
            console.log("Account merged successfully", result);

            // 토큰을 저장하고 로그인 상태로 전환
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            // 계정 통합 상태 업데이트 (Alert는 OnboardingFlow에서 처리)
            set((state) => ({
              formData: { ...state.formData, phoneVerified: true },
              isVerifyingCode: false,
              error: null,
              accountMerged: true,
              // 온보딩 완료 여부를 저장해두기
              _onboardingCompleted: result.user.onboardingCompleted,
              // 기존 사용자 정보 설정
              existingUserInfo: { 
                ...result.user,
                status: result.user.status as AccountStatus
              },
            }));
          } else {
            // 일반적인 전화번호 인증 완료
            set((state) => ({
              formData: { ...state.formData, phoneVerified: true },
              isVerifyingCode: false,
              error: null,
              accountMerged: false,
            }));
          }
        } catch (error) {
          console.error("Failed to verify code:", error);
          set({
            error: "인증번호가 일치하지 않습니다.",
            isVerifyingCode: false,
          });
          throw error;
        }
      },

      // 구/카테고리/해시태그 정보 로드
      loadStaticData: async () => {
        const { districts, categories, hashtags } = get();

        // 이미 로드된 경우 건너뛰기
        if (districts.length > 0 && categories.length > 0 && hashtags.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const [districtsData, categoriesData, hashtagsData] = await Promise.all([
            cachedApiCall(
              "districts",
              () => userApiService.getDistricts(),
              30 * 60 * 1000 // 30분
            ),
            cachedApiCall(
              "categories",
              () => userApiService.getCategories(),
              30 * 60 * 1000 // 30분
            ),
            cachedApiCall(
              "hashtags",
              () => userApiService.getUserHashtags(),
              30 * 60 * 1000 // 30분
            ),
          ]);

          set({
            districts: districtsData,
            categories: categoriesData,
            hashtags: hashtagsData,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to load static data:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to load data",
            isLoading: false,
          });
        }
      },

      // 해시태그 정보만 로드
      loadHashtags: async () => {
        const { hashtags } = get();

        // 이미 로드된 경우 건너뛰기
        if (hashtags.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const hashtagsData = await cachedApiCall(
            "hashtags",
            () => userApiService.getUserHashtags(),
            30 * 60 * 1000 // 30분
          );

          set({
            hashtags: hashtagsData,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to load hashtags:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to load hashtags",
            isLoading: false,
          });
        }
      },

      // 온보딩 데이터 제출
      submitOnboarding: async () => {
        const { formData } = get();

        // 필수 필드 검증
        if (!formData.phoneNumber) {
          console.error("phoneNumber is empty:", formData.phoneNumber);
          throw new Error("휴대폰 번호를 입력해주세요.");
        }
        if (!formData.nickname.trim()) {
          throw new Error("닉네임을 입력해주세요.");
        }
        if (!formData.birthYear) {
          throw new Error("출생연도를 선택해주세요.");
        }
        if (!formData.gender) {
          throw new Error("성별을 선택해주세요.");
        }
        if (!formData.districtId) {
          throw new Error("거주 지역을 선택해주세요.");
        }
        if (formData.interests.length === 0) {
          throw new Error("관심사를 하나 이상 선택해주세요.");
        }

        set({ isSubmitting: true, error: null });

        try {
          // 관심사와 해시태그를 ID로 변환 (현재는 임시로 문자열 해싱 사용)
          const interestIds = formData.interests
            .filter((interest) => interest && interest.trim() !== "")
            .map((interest) => Math.abs(interest.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)));
          
          const hashtagIds = (formData.moods || [])
            .filter((mood) => mood && mood.trim() !== "")
            .map((mood) => Math.abs(mood.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)));

          const requestData: OnboardingRequest = {
            phoneNumber: formData.phoneNumber,
            nickname: formData.nickname.trim(),
            birthYear: parseInt(formData.birthYear),
            gender: formData.gender,
            districtId: formData.districtId,
            interestIds: interestIds.length > 0 ? interestIds : undefined,
            hashtagIds: hashtagIds.length > 0 ? hashtagIds : undefined,
            profileImageUrl: formData.profileImageUrl || undefined,
            mbti: formData.mbti || undefined,
          };

          const loginResult = await userApiService.completeOnboarding(
            requestData
          );

          set({ isSubmitting: false });
          return loginResult;
        } catch (error) {
          console.error("Failed to submit onboarding:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Onboarding submission failed";
          set({
            error: errorMessage,
            isSubmitting: false,
          });
          throw error;
        }
      },

      // 스토어 리셋
      reset: () => {
        set({
          currentStep: 1,
          formData: initialFormData,
          districts: [],
          categories: [],
          isLoading: false,
          isSubmitting: false,
          isSendingCode: false,
          isVerifyingCode: false,
          error: null,
          isVerificationCodeSent: false,
          accountMerged: false,
          _onboardingCompleted: undefined,
          existingUserInfo: null,
        });
      },
    }),
    { name: "onboarding-store" }
  )
);
