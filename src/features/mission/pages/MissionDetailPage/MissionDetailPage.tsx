import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { ShareModal } from "../../../../shared/components/common/ShareModal";
import { useMissionStore } from "../../../../shared/store";
import {
  MissionHeader,
  MissionContent,
  MissionLocation,
  MissionInfo,
  MissionActions,
} from "./components";
import { MissionDetailSkeleton } from "./components/MissionDetailSkeleton";
import { PageContainer, ContentSection } from "./styles";


export const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  
  const { 
    currentMission, 
    isLoading, 
    fetchMissionDetails 
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
      setIsInitialLoad(true);
      fetchMissionDetails(id).finally(() => {
        setTimeout(() => setIsInitialLoad(false), 100);
      });
    }
  }, [id, fetchMissionDetails]);

  const handleCreateMeeting = () => {
    navigate(`/meetings/new?missionId=${id}`);
  };
  
  const handleSearchMeetings = () => {
    // 미션 컨텍스트와 함께 모임 리스트로 이동
    const tags = currentMission?.category?.join(',') || '';
    navigate(`/meetings?missionId=${id}&tags=${tags}`);
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

  // Show skeleton during initial load or when mission ID changes
  if (isInitialLoad || (isLoading && (!currentMission || currentMission.id !== id))) {
    return (
      <PageContainer $isMobile={isMobile}>
        <MissionDetailSkeleton isMobile={isMobile} />
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
        <MissionLocation mission={currentMission} isMobile={isMobile} />
        <MissionInfo mission={currentMission} isMobile={isMobile} />
        <MissionActions
          mission={currentMission}
          isMobile={isMobile}
          onCreateMeeting={handleCreateMeeting}
          onSearchMeetings={handleSearchMeetings}
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