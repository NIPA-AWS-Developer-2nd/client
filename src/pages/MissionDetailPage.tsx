import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, MapPin, Clock, Users, BarChart3, CheckCircle, User } from 'lucide-react';
import { deviceDetection } from '../utils/deviceDetection';

interface Participant {
    id: string;
    name: string;
    profileImage?: string;
    joinDate: string;
}

const MissionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(deviceDetection.isMobile());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    // Mock data - 실제로는 API에서 가져올 데이터
    const missions = [
        {
            id: 1,
            title: "송파구 맛집 3곳 방문하기",
            description: "송파구 내 인기 맛집 3곳을 방문하고 인증 사진을 업로드하세요.",
            category: "food",
            points: 500,
            duration: "2시간",
            difficulty: "쉬움",
            participants: "4-6명",
        },
        {
            id: 2,
            title: "한강공원 러닝 5km 완주",
            description: "한강공원에서 5km 러닝을 완주하고 기록을 인증하세요.",
            category: "sports",
            points: 800,
            duration: "1시간",
            difficulty: "보통",
            participants: "3-8명",
        },
        {
            id: 3,
            title: "롯데월드 어트랙션 체험",
            description: "롯데월드에서 5개 이상의 어트랙션을 체험하고 사진을 공유하세요.",
            category: "culture",
            points: 1200,
            duration: "4시간",
            difficulty: "어려움",
            participants: "4-10명",
        },
    ];

    const currentMission = missions.find(mission => mission.id === Number(id));

    if (!currentMission) {
        return <div>미션을 찾을 수 없습니다.</div>;
    }

    const missionData = {
        title: currentMission.title,
        location: '송파구 일대',
        reward: `+${currentMission.points}P`,
        category: currentMission.category,
        description: currentMission.description,
        duration: currentMission.duration,
        maxParticipants: 8,
        currentParticipants: 3,
        participants: [
            { id: '1', name: '김민수', joinDate: '2024-01-15' },
            { id: '2', name: '이영희', joinDate: '2024-01-16' },
            { id: '3', name: '박철수', joinDate: '2024-01-17' }
        ] as Participant[],
        requirements: [
            '송파구 거주자/직장인 우선 모집',
            '사진 2장 이상',
            '최소 2시간 이상 참여'
        ],
        mapLocation: {
            lat: 37.5145,
            lng: 127.1059,
            address: '서울특별시 송파구'
        }
    };

    // API 호출 함수들 (주석처리)
    /*
    const fetchMissionDetail = async (id: string) => {
      try {
        const response = await fetch(`/api/missions/${id}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('미션 상세 정보 조회 실패:', error);
      }
    };
  
    const fetchMapData = async (lat: number, lng: number) => {
      try {
        // 지도 API 호출 (예: 카카오맵, 네이버맵 등)
        const response = await fetch(`/api/map?lat=${lat}&lng=${lng}`);
        const mapData = await response.json();
        return mapData;
      } catch (error) {
        console.error('지도 데이터 조회 실패:', error);
      }
    };
    */

    const handleJoinMission = () => {
        // 미션 참여 로직
        console.log('미션 시작하기');
    };

    const handleShare = () => {
        // 공유 기능
        console.log('미션 공유하기');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const getCategoryLabel = (category: string) => {
        const categoryMap: { [key: string]: string } = {
            food: '음식',
            sports: '운동',
            culture: '문화',
            social: '사교'
        };
        return categoryMap[category] || category;
    };

    return (
        <Container $isMobile={isMobile}>
            <Header $isMobile={isMobile}>
                <Title $isMobile={isMobile}>{currentMission.title}</Title>
            </Header>

            <MissionImage $isMobile={isMobile}>
                <CategoryBadge $isMobile={isMobile}>{getCategoryLabel(missionData.category)}</CategoryBadge>
            </MissionImage>

            <ContentSection $isMobile={isMobile}>
                <MissionHeader>
                    <MissionTitle $isMobile={isMobile}>{missionData.title}</MissionTitle>
                    <RewardBadge $isMobile={isMobile}>{missionData.reward}</RewardBadge>
                </MissionHeader>

                <LocationInfo $isMobile={isMobile}>
                    <MapPin size={14} />
                    {missionData.location}
                </LocationInfo>

                <DescriptionSection $isMobile={isMobile}>
                    <SectionTitle $isMobile={isMobile}>미션 설명</SectionTitle>
                    <Description $isMobile={isMobile}>{missionData.description}</Description>
                </DescriptionSection>

                <InfoGrid $isMobile={isMobile}>
                    <InfoItem $isMobile={isMobile}>
                        <InfoIcon>
                            <Clock size={isMobile ? 14 : 16} />
                        </InfoIcon>
                        <InfoContent>
                            <InfoValue $isMobile={isMobile}>{missionData.duration}</InfoValue>
                            <InfoLabel $isMobile={isMobile}>예상 시간</InfoLabel>
                        </InfoContent>
                    </InfoItem>
                    <InfoItem $isMobile={isMobile}>
                        <InfoIcon>
                            <Users size={isMobile ? 14 : 16} />
                        </InfoIcon>
                        <InfoContent>
                            <InfoValue $isMobile={isMobile}>{missionData.maxParticipants}명</InfoValue>
                            <InfoLabel $isMobile={isMobile}>최대 인원</InfoLabel>
                        </InfoContent>
                    </InfoItem>
                    <InfoItem $isMobile={isMobile}>
                        <InfoIcon>
                            <BarChart3 size={isMobile ? 14 : 16} />
                        </InfoIcon>
                        <InfoContent>
                            <InfoValue $isMobile={isMobile}>{currentMission.difficulty}</InfoValue>
                            <InfoLabel $isMobile={isMobile}>난이도</InfoLabel>
                        </InfoContent>
                    </InfoItem>
                </InfoGrid>

                <MapSection $isMobile={isMobile}>
                    <SectionTitle $isMobile={isMobile}>수행 장소</SectionTitle>
                    <MapContainer $isMobile={isMobile}>
                        <MapPlaceholder $isMobile={isMobile}>
                            <MapPin size={isMobile ? 32 : 40} />
                            <MapPlaceholderText $isMobile={isMobile}>지도 영역</MapPlaceholderText>
                        </MapPlaceholder>
                    </MapContainer>
                    <LocationDetails $isMobile={isMobile}>
                        <LocationItem $isMobile={isMobile}>
                            <LocationIcon>
                                <MapPin size={16} />
                            </LocationIcon>
                            <LocationText>
                                <LocationName $isMobile={isMobile}>미션 진행 장소</LocationName>
                                <LocationAddress $isMobile={isMobile}>{missionData.mapLocation.address}</LocationAddress>
                            </LocationText>
                        </LocationItem>
                    </LocationDetails>
                </MapSection>

                <RequirementsSection $isMobile={isMobile}>
                    <SectionTitle $isMobile={isMobile}>참여 조건</SectionTitle>
                    <RequirementsList>
                        {missionData.requirements.map((requirement, index) => (
                            <RequirementItem key={index} $isMobile={isMobile}>
                                <CheckCircle size={14} />
                                {requirement}
                            </RequirementItem>
                        ))}
                    </RequirementsList>
                </RequirementsSection>

                <ActionSection $isMobile={isMobile}>
                    <JoinButton $isMobile={isMobile} onClick={handleJoinMission}>
                        미션 참여하기
                    </JoinButton>
                </ActionSection>
            </ContentSection>
        </Container>
    );
};

const Container = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.gray50};
  min-height: 100vh;
`;

const Header = styled.header<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "16px 20px")};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 12px;
`;

const BackButton = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
  }
`;

const Title = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  flex: 1;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ShareButton = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
  }
`;

const MissionImage = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  height: ${({ $isMobile }) => ($isMobile ? "180px" : "200px")};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gray600}, ${({ theme }) => theme.colors.gray500});
  display: flex;
  align-items: flex-end;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const CategoryBadge = styled.span<{ $isMobile?: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ $isMobile }) => ($isMobile ? "6px 12px" : "8px 16px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
`;

const ContentSection = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  background-color: ${({ theme }) => theme.colors.white};
  margin-top: -10px;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  position: relative;
  z-index: 1;
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
`;

const MissionTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  line-height: 1.3;
`;

const RewardBadge = styled.div<{ $isMobile?: boolean }>`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.success}, ${({ theme }) => theme.colors.success}E6);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  white-space: nowrap;
`;

const LocationInfo = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 20px;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
`;

const DescriptionSection = styled.section<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "16px")};
  font-weight: 600;
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
`;

const InfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const InfoItem = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "16px 12px")};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const InfoValue = styled.div<{ $isMobile?: boolean }>`
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoLabel = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 500;
`;

const ParticipantsSection = styled.section<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const ParticipantCount = styled.p<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  margin: 0 0 12px 0;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ParticipantItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ParticipantAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  height: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 0;
`;

const ParticipantInfo = styled.div`
  flex: 1;
`;

const ParticipantName = styled.div<{ $isMobile?: boolean }>`
  font-weight: 500;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const JoinDate = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
`;

const MapSection = styled.section<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const MapContainer = styled.div<{ $isMobile?: boolean }>`
  height: ${({ $isMobile }) => ($isMobile ? "180px" : "200px")};
  background-color: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 12px;
  overflow: hidden;
`;

const MapPlaceholder = styled.div<{ $isMobile?: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  gap: 8px;
`;

const MapPlaceholderText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
`;

const LocationDetails = styled.div<{ $isMobile?: boolean }>`
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const LocationItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LocationIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LocationText = styled.div`
  flex: 1;
`;

const LocationName = styled.div<{ $isMobile?: boolean }>`
  font-weight: 500;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const LocationAddress = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
`;

const RequirementsSection = styled.section<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RequirementItem = styled.li<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ActionSection = styled.section<{ $isMobile?: boolean }>`
  margin-top: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  padding-top: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const JoinButton = styled.button<{ $isMobile?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "16px")};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray700};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default MissionDetailPage;