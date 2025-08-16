import { authFetch, apiUrl } from "../utils/api";

// 출석 상태 타입
export type AttendanceStatus = 'pending' | 'checked_in' | 'no_show' | 'excused';

// 출석체크 응답 타입
export interface AttendanceRecord {
  userId: string;
  nickname: string;
  profileImageUrl?: string;
  isHost: boolean;
  status: AttendanceStatus;
  checkedInAt?: string;
  noShowMarkedAt?: string;
}

export interface AttendanceSummary {
  total: number;
  checkedIn: number;
  noShow: number;
  pending: number;
}

export interface AttendanceStatusResponse {
  attendances: AttendanceRecord[];
  summary: AttendanceSummary;
  canGenerateQR: boolean;
  qrCodeActive: boolean;
}

export interface QRCodeResponse {
  qrCodeToken: string;
  expiresAt: string;
}

export interface CheckInResponse {
  attendanceId: string;
  checkedInAt: string;
}

export interface MyAttendanceResponse {
  status: AttendanceStatus;
  checkedInAt?: string;
  noShowMarkedAt?: string;
  canCheckIn: boolean;
  qrCodeActive: boolean;
}

export interface NoShowResponse {
  noShowCount: number;
  processedUsers: string[];
}

class AttendanceApiService {
  /**
   * QR 코드 생성 (호스트 전용)
   */
  async generateQRCode(meetingId: string): Promise<QRCodeResponse> {
    const response = await authFetch(apiUrl(`/attendance/meetings/${meetingId}/generate-qr`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ QR 코드 생성 성공:', result.data);
    
    return result.data;
  }

  /**
   * QR 코드로 출석체크
   */
  async checkIn(meetingId: string, qrCodeToken: string): Promise<CheckInResponse> {
    const response = await authFetch(apiUrl(`/attendance/meetings/${meetingId}/check-in`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qrCodeToken }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 출석체크 성공:', result.data);
    
    return result.data;
  }

  /**
   * 모임 출석 현황 조회
   */
  async getAttendanceStatus(meetingId: string): Promise<AttendanceStatusResponse> {
    const response = await authFetch(apiUrl(`/attendance/meetings/${meetingId}/status`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 출석 현황 조회 성공:', result.data);
    
    return result.data;
  }

  /**
   * 노쇼 처리 (호스트 전용)
   */
  async markNoShow(meetingId: string): Promise<NoShowResponse> {
    const response = await authFetch(apiUrl(`/attendance/meetings/${meetingId}/mark-no-show`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 노쇼 처리 성공:', result.data);
    
    return result.data;
  }

  /**
   * 내 출석 상태 조회
   */
  async getMyAttendance(meetingId: string): Promise<MyAttendanceResponse> {
    const response = await authFetch(apiUrl(`/attendance/my-attendance/${meetingId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 내 출석 상태 조회 성공:', result.data);
    
    return result.data;
  }
}

export const attendanceApiService = new AttendanceApiService();