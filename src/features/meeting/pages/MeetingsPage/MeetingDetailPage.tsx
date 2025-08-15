import React from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  DollarSign,
  User as UserIcon,
  Crown,
  CheckCircle,
  Camera,
  Timer,
  MessageCircle,
  Award,
  Target,
  Heart,
  Zap,
  Coffee,
  Music,
  Gamepad2,
  Book,
  Star,
  Smile,
  Tag,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { Button, Modal, SectionTitle } from "../../../../shared/components/ui";
import {
  ContentSection,
  Description,
  InfoSection,
  InfoGrid,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoValue,
  InfoLabel,
  LocationItem,
  LocationIcon,
  LocationText,
  LocationLabel,
  LocationAddress,
  RewardInfo,
  RewardText,
  MapSection,
  MapContainer,
  MapPlaceholder,
  MapText,
  MapSubText,
  MapButton,
  CrownIcon,
  ParticipantsSection,
  ParticipantsList,
  ParticipantItem,
  ParticipantAvatar,
  ParticipantName,
  HostLabel,
  RequirementsSection,
  RequirementsList,
  RequirementItem,
  ActionSection,
  TraitsSection,
  TraitsList,
  TraitItem,
  TraitIcon,
  TraitLabel,
  MissionInfo,
  MissionInfoTitle,
  MissionInfoDescription,
  RewardHighlight,
  RewardIcon,
  RewardContent,
  RewardTitle,
  RewardAmount,
  MissionConditionsSection,
  ConditionsTitle,
  ConditionItem,
  RequiredPhotosSection,
  PhotosTitle,
  PhotoRequirement,
  RequiredActivitiesSection,
  ActivitiesTitle,
  ActivityRequirement,
} from "./index";

interface MeetingDetailData {
  id: number;
  title: string;
  description: string;
  hostName: string;
  currentParticipants: number;
  participants: number;
  minParticipants: number;
  meetingDate: string;
  meetingTime: string;
  location: string;
  mapUrl?: string;
  status: "recruiting" | "full" | "completed" | "cancelled";
  missionTitle: string;
  missionDescription: string;
  points: number;
  // 원하는 참여자 성향
  preferredTraits?: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  // 미션 클리어 조건
  missionClearConditions: {
    minParticipationHours: number;
    minPhotos: number;
    requiredPhotos: string[];
    requiredActivities: string[];
    reviewRequired: boolean;
  };
  // 모임 참여 조건
  participationConditions: {
    ageRange?: string;
    gender?: "all" | "male" | "female";
    residenceArea?: string;
    otherConditions?: string[];
  };
  participantList: Array<{
    id: number;
    name: string;
    isHost: boolean;
  }>;
}

// 성향 아이콘 매핑 함수
const getTraitIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ size?: number }> } = {
    heart: Heart,
    zap: Zap,
    coffee: Coffee,
    music: Music,
    gamepad: Gamepad2,
    book: Book,
    star: Star,
    smile: Smile,
    users: Users,
    camera: Camera,
  };

  return iconMap[iconName] || Tag;
};

// 번개 모임용 시간 표시 함수
const getFlashMeetingTimeInfo = (
  dateStr: string,
  timeStr: string,
  status: string
) => {
  const meetingDateTime = new Date(`${dateStr} ${timeStr}`);
  const now = new Date();
  const diffInMs = meetingDateTime.getTime() - now.getTime();
  const today = new Date().toDateString();
  const meetingDay = meetingDateTime.toDateString();

  // 완료된 모임의 경우 날짜 표시
  if (status === "completed" || status === "cancelled") {
    return {
      type: "completed",
      display: meetingDateTime.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }),
      isToday: false,
    };
  }

  // 시작된 모임
  if (diffInMs <= 0) {
    return {
      type: "started",
      display: "진행 중",
      isToday: today === meetingDay,
    };
  }

  // 당일 모임인지 확인
  const isToday = today === meetingDay;

  if (isToday) {
    // 당일 모임 - 시간까지 얼마나 남았는지 표시
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (diffInHours > 0) {
      return {
        type: "today",
        display: `${diffInHours}시간 ${diffInMinutes}분 후`,
        isToday: true,
      };
    } else {
      return {
        type: "today",
        display: `${diffInMinutes}분 후`,
        isToday: true,
      };
    }
  } else {
    // 다른 날 모임 (번개 모임이므로 드물어야 함)
    return {
      type: "future",
      display: meetingDateTime.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }),
      isToday: false,
    };
  }
};

export const MeetingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMissionModal, setShowMissionModal] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock data - 실제로는 API에서 가져올 데이터
  const meetingData: MeetingDetailData = {
    id: Number(id),
    title: "송파구 맛집 탐방 모임",
    description:
      "송파구 유명 맛집 3곳을 함께 방문하며 미션을 수행해요. 새로운 사람들과 맛있는 음식을 즐기며 좋은 추억을 만들어보세요!",
    hostName: "김모임",
    currentParticipants: 3,
    participants: 6,
    minParticipants: 2,
    meetingDate: "2024-12-01",
    meetingTime: "14:00",
    location: "송파구 잠실역 1번 출구",
    mapUrl: "https://map.kakao.com/link/map/잠실역,37.5134,127.1001",
    status: "recruiting",
    missionTitle: "송파구 맛집 3곳 방문하기",
    missionDescription:
      "송파구의 유명한 맛집 3곳을 방문하여 각 장소에서 지정된 인증 사진을 촬영하고, 음식과 함께하는 추억을 만들어보세요!",
    points: 500,
    // 원하는 참여자 성향
    preferredTraits: [
      { id: "friendly", label: "친화적인", icon: "heart" },
      { id: "foodie", label: "음식 탐험가", icon: "coffee" },
      { id: "active", label: "활발한", icon: "zap" },
    ],
    // 미션 클리어 조건
    missionClearConditions: {
      minParticipationHours: 3,
      minPhotos: 6,
      requiredPhotos: [
        "각 맛집 앞에서 전신이 나오는 단체 사진",
        "주문한 음식과 함께 찍은 인증 사진",
        "맛집 간판이 보이는 인증 사진",
      ],
      requiredActivities: [
        "3곳의 맛집에서 각각 음식 주문 및 식사",
        "각 장소에서 지정된 포즈로 단체 사진 촬영",
        "음식 사진과 간단한 후기 작성",
      ],
      reviewRequired: true,
    },
    // 모임 참여 조건
    participationConditions: {
      ageRange: "20-35세",
      gender: "all",
      residenceArea: "송파구, 강남구, 서초구",
      otherConditions: [
        "시간 활동에 적극적인 분",
        "미식 탐험가에게 적극적인 분",
        "음식을 가리지 않는 분",
        "사진 촬영에 적극적인 분",
      ],
    },
    participantList: [
      { id: 1, name: "김모임", isHost: true },
      { id: 2, name: "이참여", isHost: false },
      { id: 3, name: "박함께", isHost: false },
    ],
  };

  const handleJoinMeeting = () => {
    setIsLoading(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      console.log("모임 참여 완료");
      // 참여 완료 후 처리
    }, 1500);
  };

  const handleCloseMissionModal = () => {
    setShowMissionModal(false);
  };

  // 번개 모임 시간 정보 계산
  const timeInfo = getFlashMeetingTimeInfo(
    meetingData.meetingDate,
    meetingData.meetingTime,
    meetingData.status
  );

  return (
    <>
      <ContentSection $isMobile={isMobile}>
        <Description $isMobile={isMobile}>
          {meetingData.description}
        </Description>

        <InfoSection $isMobile={isMobile}>
          <InfoGrid $isMobile={isMobile}>
            <InfoItem $isMobile={isMobile}>
              <InfoIcon>
                <Clock size={isMobile ? 14 : 16} />
              </InfoIcon>
              <InfoContent>
                <InfoValue
                  $isMobile={isMobile}
                  $isToday={timeInfo.isToday}
                  $type={timeInfo.type}
                >
                  {timeInfo.display}
                </InfoValue>
                <InfoLabel $isMobile={isMobile}>
                  {timeInfo.type === "completed"
                    ? "모임 날짜"
                    : timeInfo.type === "today"
                    ? "번개 모임"
                    : timeInfo.type === "started"
                    ? "현재 상태"
                    : "모임 시간"}
                </InfoLabel>
              </InfoContent>
            </InfoItem>
            {timeInfo.isToday && (
              <InfoItem $isMobile={isMobile}>
                <InfoIcon>
                  <Calendar size={isMobile ? 14 : 16} />
                </InfoIcon>
                <InfoContent>
                  <InfoValue $isMobile={isMobile}>
                    {meetingData.meetingTime}
                  </InfoValue>
                  <InfoLabel $isMobile={isMobile}>정확한 시간</InfoLabel>
                </InfoContent>
              </InfoItem>
            )}
            <InfoItem $isMobile={isMobile}>
              <InfoIcon>
                <Users size={isMobile ? 14 : 16} />
              </InfoIcon>
              <InfoContent>
                <InfoValue $isMobile={isMobile}>
                  {meetingData.currentParticipants}/
                  {meetingData.participants}명
                </InfoValue>
                <InfoLabel $isMobile={isMobile}>참여 인원</InfoLabel>
              </InfoContent>
            </InfoItem>
          </InfoGrid>

          <LocationItem $isMobile={isMobile}>
            <LocationIcon>
              <MapPin size={16} />
            </LocationIcon>
            <LocationText>
              <LocationLabel $isMobile={isMobile}>모임 장소</LocationLabel>
              <LocationAddress $isMobile={isMobile}>
                {meetingData.location}
              </LocationAddress>
            </LocationText>
          </LocationItem>

          {/* 지도 영역 */}
          <MapSection $isMobile={isMobile}>
            <MapContainer $isMobile={isMobile}>
              <MapPlaceholder $isMobile={isMobile}>
                <MapPin size={isMobile ? 24 : 32} color="#6366f1" />
                <MapText $isMobile={isMobile}>지도에서 위치 확인</MapText>
                <MapSubText $isMobile={isMobile}>
                  {meetingData.location}
                </MapSubText>
              </MapPlaceholder>
              {meetingData.mapUrl && (
                <MapButton
                  $isMobile={isMobile}
                  onClick={() => window.open(meetingData.mapUrl, "_blank")}
                >
                  길찾기
                </MapButton>
              )}
            </MapContainer>
          </MapSection>

          <RewardInfo $isMobile={isMobile}>
            <DollarSign size={16} />
            <RewardText $isMobile={isMobile}>
              모임 완료 시 <strong>+{meetingData.points}P</strong> 획득
            </RewardText>
          </RewardInfo>
        </InfoSection>

        {/* 원하는 참여자 성향 섹션 */}
        {meetingData.preferredTraits &&
          meetingData.preferredTraits.length > 0 && (
            <TraitsSection $isMobile={isMobile}>
              <SectionTitle
                isMobile={isMobile}
                icon={<Users size={isMobile ? 16 : 18} />}
              >
                원하는 참여자 성향
              </SectionTitle>
              <TraitsList $isMobile={isMobile}>
                {meetingData.preferredTraits.map((trait) => {
                  const IconComponent = getTraitIcon(trait.icon);
                  return (
                    <TraitItem key={trait.id} $isMobile={isMobile}>
                      <TraitIcon>
                        <IconComponent size={14} />
                      </TraitIcon>
                      <TraitLabel $isMobile={isMobile}>
                        {trait.label}
                      </TraitLabel>
                    </TraitItem>
                  );
                })}
              </TraitsList>
            </TraitsSection>
          )}

        <ParticipantsSection $isMobile={isMobile}>
          <SectionTitle isMobile={isMobile}>
            참여자 ({meetingData.currentParticipants}/
            {meetingData.participants}명)
          </SectionTitle>
          <ParticipantsList>
            {meetingData.participantList.map((participant) => (
              <ParticipantItem key={participant.id} $isMobile={isMobile}>
                <ParticipantAvatar $isMobile={isMobile}>
                  <UserIcon size={isMobile ? 12 : 14} />
                  {participant.isHost && (
                    <CrownIcon $isMobile={isMobile}>
                      <Crown size={isMobile ? 6 : 7} />
                    </CrownIcon>
                  )}
                </ParticipantAvatar>
                <ParticipantName $isMobile={isMobile}>
                  {participant.name}
                  {participant.isHost && <HostLabel> (호스트)</HostLabel>}
                </ParticipantName>
              </ParticipantItem>
            ))}
          </ParticipantsList>
        </ParticipantsSection>

        <RequirementsSection $isMobile={isMobile}>
          <SectionTitle isMobile={isMobile}>참여 조건</SectionTitle>
          <RequirementsList>
            {meetingData.participationConditions.ageRange && (
              <RequirementItem $isMobile={isMobile}>
                <CheckCircle size={14} color="#10B981" />
                연령대: {meetingData.participationConditions.ageRange}
              </RequirementItem>
            )}
            {meetingData.participationConditions.gender &&
              meetingData.participationConditions.gender !== "all" && (
                <RequirementItem $isMobile={isMobile}>
                  <CheckCircle size={14} color="#10B981" />
                  성별:{" "}
                  {meetingData.participationConditions.gender === "male"
                    ? "남성만"
                    : "여성만"}
                </RequirementItem>
              )}
            {meetingData.participationConditions.residenceArea && (
              <RequirementItem $isMobile={isMobile}>
                <CheckCircle size={14} color="#10B981" />
                거주지역: {meetingData.participationConditions.residenceArea}
              </RequirementItem>
            )}
            <RequirementItem $isMobile={isMobile}>
              <CheckCircle size={14} color="#10B981" />
              최소 모집 인원: {meetingData.minParticipants}명
            </RequirementItem>
            {meetingData.participationConditions.otherConditions?.map(
              (condition, index) => (
                <RequirementItem key={index} $isMobile={isMobile}>
                  <CheckCircle size={14} color="#10B981" />
                  {condition}
                </RequirementItem>
              )
            )}
          </RequirementsList>
        </RequirementsSection>

        {meetingData.status === "recruiting" && (
          <ActionSection $isMobile={isMobile}>
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleJoinMeeting}
              disabled={isLoading}
            >
              {isLoading
                ? "처리 중"
                : meetingData.currentParticipants >= meetingData.participants
                ? "대기자로 참여하기"
                : "모임 참여하기"}
            </Button>
          </ActionSection>
        )}
      </ContentSection>

      {/* 미션 요약 모달 */}
      <Modal
        isOpen={showMissionModal}
        onClose={handleCloseMissionModal}
        title="미션 요약"
      >
        <MissionInfo>
          <MissionInfoTitle $isMobile={isMobile}>
            <Target size={isMobile ? 16 : 18} />
            {meetingData.missionTitle}
          </MissionInfoTitle>
          <MissionInfoDescription $isMobile={isMobile}>
            {meetingData.missionDescription}
          </MissionInfoDescription>

          {/* 포인트 보상 강조 */}
          <RewardHighlight $isMobile={isMobile}>
            <RewardIcon>
              <Award size={isMobile ? 20 : 24} />
            </RewardIcon>
            <RewardContent>
              <RewardTitle $isMobile={isMobile}>미션 완료 보상</RewardTitle>
              <RewardAmount $isMobile={isMobile}>
                +{meetingData.points} 포인트
              </RewardAmount>
            </RewardContent>
          </RewardHighlight>

          {/* 미션 클리어 조건 */}
          <MissionConditionsSection>
            <ConditionsTitle $isMobile={isMobile}>
              <CheckCircle size={16} />
              미션 클리어 조건
            </ConditionsTitle>

            <ConditionItem $isMobile={isMobile}>
              <Timer size={14} />
              최소 {meetingData.missionClearConditions.minParticipationHours}
              시간 참여
            </ConditionItem>

            <ConditionItem $isMobile={isMobile}>
              <Camera size={14} />
              {meetingData.missionClearConditions.minPhotos}장 이상 사진 촬영
            </ConditionItem>

            {meetingData.missionClearConditions.reviewRequired && (
              <ConditionItem $isMobile={isMobile}>
                <MessageCircle size={14} />
                미션 완료 후 후기 작성 필수
              </ConditionItem>
            )}
          </MissionConditionsSection>

          {/* 필수 인증 사진 */}
          <RequiredPhotosSection>
            <PhotosTitle $isMobile={isMobile}>필수 인증 사진</PhotosTitle>
            {meetingData.missionClearConditions.requiredPhotos.map(
              (photo, index) => (
                <PhotoRequirement key={index} $isMobile={isMobile}>
                  <Camera size={12} />
                  {photo}
                </PhotoRequirement>
              )
            )}
          </RequiredPhotosSection>

          {/* 필수 활동 */}
          <RequiredActivitiesSection>
            <ActivitiesTitle $isMobile={isMobile}>필수 활동</ActivitiesTitle>
            {meetingData.missionClearConditions.requiredActivities.map(
              (activity, index) => (
                <ActivityRequirement key={index} $isMobile={isMobile}>
                  <CheckCircle size={12} />
                  {activity}
                </ActivityRequirement>
              )
            )}
          </RequiredActivitiesSection>
        </MissionInfo>
      </Modal>
    </>
  );
};
