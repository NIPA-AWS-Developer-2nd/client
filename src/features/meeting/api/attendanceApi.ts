import { apiClient } from '../../../shared/api';

export interface QRCodeGenerateResponse {
  qrCodeToken: string;
  expiresAt: string;
}

export interface CheckInResponse {
  attendanceId: string;
  checkedInAt: string;
}

export interface AttendanceStatusResponse {
  attendances: Array<{
    userId: string;
    nickname: string;
    status: string;
    checkedInAt?: string;
  }>;
  summary: {
    total: number;
    checkedIn: number;
    noShow: number;
    pending: number;
  };
}

export interface MyAttendanceResponse {
  status: string;
  checkedInAt?: string;
  canCheckIn: boolean;
}

export const attendanceApi = {
  // QR 코드 생성 (호스트 전용)
  async generateQRCode(meetingId: string): Promise<{ data: QRCodeGenerateResponse }> {
    const response = await apiClient.post(`/attendance/meetings/${meetingId}/generate-qr`);
    return response;
  },

  // QR 코드로 출석체크 (참가자)
  async checkIn(meetingId: string, qrCodeToken: string): Promise<{ data: CheckInResponse }> {
    const response = await apiClient.post(`/attendance/meetings/${meetingId}/check-in`, {
      qrCodeToken,
    });
    return response;
  },

  // 모임 출석 현황 조회
  async getAttendanceStatus(meetingId: string): Promise<{ data: AttendanceStatusResponse }> {
    const response = await apiClient.get(`/attendance/meetings/${meetingId}/status`);
    return response;
  },

  // 내 출석 상태 조회
  async getMyAttendance(meetingId: string): Promise<{ data: MyAttendanceResponse }> {
    const response = await apiClient.get(`/attendance/my-attendance/${meetingId}`);
    return response;
  },

  // 출석한 사용자 목록 조회 (UI용)
  async getAttendanceList(meetingId: string): Promise<{ data: { attendedUserIds: string[] } }> {
    const response = await apiClient.get(`/attendance/meetings/${meetingId}/status`);
    // 기존 API 응답에서 출석한 사용자 ID만 추출
    interface AttendanceRecord {
      status: string;
      userId: string;
    }
    const attendedUserIds = response.data.attendances
      ?.filter((attendance: AttendanceRecord) => attendance.status === 'checked_in')
      ?.map((attendance: AttendanceRecord) => attendance.userId) || [];
    
    return { data: { attendedUserIds } };
  },

  // 노쇼 처리 (호스트 전용)
  async markNoShow(meetingId: string): Promise<{ data: unknown }> {
    const response = await apiClient.post(`/attendance/meetings/${meetingId}/mark-no-show`);
    return response;
  },
};