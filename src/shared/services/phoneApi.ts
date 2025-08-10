import { authFetch, apiUrl } from "../utils/api";

export interface PhoneVerificationResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phoneNumber: string;
    status: string;
    onboardingCompleted: boolean;
    socialAccounts?: Array<{
      provider: string;
      email?: string;
      profileImageUrl?: string;
    }>;
  };
  merged?: boolean; // 계정 통합 여부
}

class PhoneApiService {
  async sendCode(phoneNumber: string): Promise<void> {
    const response = await authFetch(apiUrl("auth/phone/send-code"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<PhoneVerificationResult> {
    const response = await authFetch(apiUrl("auth/phone/verify"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, code }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data || result;
  }
}

export const phoneApiService = new PhoneApiService();
