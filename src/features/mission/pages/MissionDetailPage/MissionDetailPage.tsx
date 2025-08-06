import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { Loading } from "../../../../shared/components/ui/Loading";
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
    </PageContainer>
  );
};