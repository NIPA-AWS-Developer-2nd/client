import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { Loading } from "../../../../shared/components/ui/Loading";
import { ShareModal } from "../../../../shared/components/common/ShareModal";
import { useMissionStore } from "../../../../shared/store";
import {
  MissionHeader,
  MissionContent,
  MissionInfo,
  MissionActions,
} from "./components";
import { PageContainer, ContentSection } from "./styles";


export const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  
  const { 
    currentMission, 
    meetings, 
    isLoading, 
    fetchMissionDetails, 
    fetchMeetings 
  } = useMissionStore();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (id) {
      fetchMissionDetails(id);
      fetchMeetings(id);
    }
  }, [id, fetchMissionDetails, fetchMeetings]);

  const handleCreateMeeting = () => {
    navigate(`/meetings/create?missionId=${id}`);
  };

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meetings/${meetingId}`);
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
  };

  // 헤더에서 공유 버튼 클릭 이벤트 듣기
  React.useEffect(() => {
    const handleOpenShareModal = () => {
      setIsShareModalOpen(true);
    };

    window.addEventListener('openShareModal', handleOpenShareModal);
    return () => {
      window.removeEventListener('openShareModal', handleOpenShareModal);
    };
  }, []);

  if (isLoading && !currentMission) {
    return (
      <PageContainer $isMobile={isMobile}>
        <Loading isMobile={isMobile} />
      </PageContainer>
    );
  }

  if (!currentMission) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div>미션을 찾을 수 없습니다.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer $isMobile={isMobile}>
      <MissionHeader mission={currentMission} isMobile={isMobile} />
      
      <ContentSection $isMobile={isMobile}>
        <MissionContent mission={currentMission} isMobile={isMobile} />
        <MissionInfo mission={currentMission} isMobile={isMobile} />
        <MissionActions
          meetings={meetings}
          missionId={id}
          isMobile={isMobile}
          onCreateMeeting={handleCreateMeeting}
          onMeetingClick={handleMeetingClick}
        />
      </ContentSection>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleShareModalClose}
        mission={currentMission}
        isMobile={isMobile}
      />
    </PageContainer>
  );
};