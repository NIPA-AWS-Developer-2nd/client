export interface NavigationGuardOptions {
  isLocationVerified: boolean;
  isLocationLoading: boolean;
  showWarning: (message: string, title?: string) => void;
  navigate: (to: string) => void;
}

/**
 * 지역 인증이 필요한 경로로 이동할 때 체크하는 가드 함수
 */
export const createLocationGuard = ({
  isLocationVerified,
  isLocationLoading,
  showWarning,
  navigate,
}: NavigationGuardOptions) => {
  const checkAndNavigate = (path: string, actionName: string = '이동') => {
    // 로딩 중이면 잠시 대기
    if (isLocationLoading) {
      // 로딩 중일 때는 아무 작업도 하지 않음
      return false;
    }
    
    if (!isLocationVerified) {
      showWarning('지역 인증이 필요합니다.', actionName);
      return false;
    }
    navigate(path);
    return true;
  };

  return {
    // 미션 관련 페이지
    toMissions: () => checkAndNavigate('/missions', '미션 찾기'),
    toMissionDetail: (missionId: string) => 
      checkAndNavigate(`/missions/${missionId}`, '미션 상세'),
    
    // 모임 관련 페이지
    toMeetings: () => checkAndNavigate('/meetings', '모임 참여'),
    toMeetingDetail: (meetingId: string) => 
      checkAndNavigate(`/meetings/${meetingId}`, '모임 상세'),
    toMeetingChannel: (meetingId: string) => 
      checkAndNavigate(`/meetings/${meetingId}/channel`, '모임 채널'),
    
    // 일반적인 체크 함수
    checkLocationAndNavigate: checkAndNavigate,
  };
};

/**
 * 모임 링크를 안전하게 처리하는 헬퍼 함수
 */
export const createSafeMeetingNavigator = (guardOptions: NavigationGuardOptions) => {
  const guard = createLocationGuard(guardOptions);
  
  return {
    /**
     * 모임 ID를 받아서 적절한 페이지로 이동
     * @param meetingId 모임 ID
     * @param type 'detail' | 'channel' - 이동할 페이지 타입
     */
    navigateToMeeting: (meetingId: string, type: 'detail' | 'channel' = 'detail') => {
      if (type === 'channel') {
        return guard.toMeetingChannel(meetingId);
      } else {
        return guard.toMeetingDetail(meetingId);
      }
    },
    
    /**
     * 미션 ID를 받아서 미션 상세로 이동
     */
    navigateToMission: (missionId: string) => {
      return guard.toMissionDetail(missionId);
    },
  };
};