import React from "react";
import styled from "styled-components";
import { Clock, Users, UserCheck } from "lucide-react";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { Button } from "../../../shared/components/ui";
import { TraitSelector, LocationPicker } from "../components";
import type { CreateMeetingRequest, MissionWithDetails, ParticipantTrait, PreferredGender } from "../../../types";

const Container = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const Title = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 24px 0;
  text-align: center;
`;

const FormGroup = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  display: block;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
`;

const Input = styled.input<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const DateTimeContainer = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? "1fr" : "1fr 1fr")};
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const DateTimeGroup = styled.div``;

const Select = styled.select<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const GenderAgeContainer = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? "1fr" : "1fr 1fr 1fr")};
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const ButtonGroup = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  
  ${({ $isMobile }) => $isMobile && `
    flex-direction: column;
  `}
`;

const MissionInfo = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const MissionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const MissionMeta = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  flex-wrap: wrap;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface CreateMeetingFormProps {
  mission: MissionWithDetails;
  traits: ParticipantTrait[];
  onSubmit: (data: CreateMeetingRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateMeetingForm: React.FC<CreateMeetingFormProps> = ({
  mission,
  traits,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [formData, setFormData] = React.useState({
    date: "",
    time: "",
    location: "",
    latitude: 0,
    longitude: 0,
    preferredGender: "ANY" as PreferredGender,
    minAge: 18,
    maxAge: 50,
    selectedTraitIds: [] as string[],
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.location) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const scheduledAt = new Date(`${formData.date}T${formData.time}:00Z`).toISOString();

    const requestData: CreateMeetingRequest = {
      missionId: mission.id,
      scheduledAt,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      preferredGender: formData.preferredGender,
      minAge: formData.minAge,
      maxAge: formData.maxAge,
      traits: formData.selectedTraitIds,
    };

    onSubmit(requestData);
  };

  const handleLocationChange = (location: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      location,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleTraitSelectionChange = (traitIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedTraitIds: traitIds,
    }));
  };

  // 현재 날짜 이후만 선택 가능하도록 최소 날짜 설정
  const today = new Date().toISOString().split('T')[0];

  return (
    <Container $isMobile={isMobile}>
      <Title $isMobile={isMobile}>새 모임 만들기</Title>

      {/* 미션 정보 */}
      <MissionInfo $isMobile={isMobile}>
        <MissionTitle $isMobile={isMobile}>{mission.title}</MissionTitle>
        <MissionMeta $isMobile={isMobile}>
          <MetaItem>
            <Clock size={12} />
            {mission.duration}분
          </MetaItem>
          <MetaItem>
            <Users size={12} />
            {mission.minParticipants}-{mission.maxParticipants}명
          </MetaItem>
          <MetaItem>
            <UserCheck size={12} />
            +{mission.point}P
          </MetaItem>
        </MissionMeta>
      </MissionInfo>

      <form onSubmit={handleSubmit}>
        {/* 날짜 및 시간 */}
        <FormGroup $isMobile={isMobile}>
          <Label $isMobile={isMobile}>모임 일시</Label>
          <DateTimeContainer $isMobile={isMobile}>
            <DateTimeGroup>
              <Input
                $isMobile={isMobile}
                type="date"
                value={formData.date}
                min={today}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </DateTimeGroup>
            <DateTimeGroup>
              <Input
                $isMobile={isMobile}
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </DateTimeGroup>
          </DateTimeContainer>
        </FormGroup>

        {/* 위치 선택 */}
        <LocationPicker
          location={formData.location}
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={handleLocationChange}
        />

        {/* 참여자 조건 */}
        <FormGroup $isMobile={isMobile}>
          <Label $isMobile={isMobile}>참여자 조건</Label>
          <GenderAgeContainer $isMobile={isMobile}>
            <div>
              <Label $isMobile={isMobile} style={{ fontSize: isMobile ? "12px" : "14px", marginBottom: "8px" }}>
                성별
              </Label>
              <Select
                $isMobile={isMobile}
                value={formData.preferredGender}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  preferredGender: e.target.value as PreferredGender 
                }))}
              >
                <option value="ANY">무관</option>
                <option value="MALE">남성만</option>
                <option value="FEMALE">여성만</option>
              </Select>
            </div>
            <div>
              <Label $isMobile={isMobile} style={{ fontSize: isMobile ? "12px" : "14px", marginBottom: "8px" }}>
                최소 나이
              </Label>
              <Input
                $isMobile={isMobile}
                type="number"
                min="18"
                max="100"
                value={formData.minAge}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  minAge: parseInt(e.target.value) || 18 
                }))}
              />
            </div>
            <div>
              <Label $isMobile={isMobile} style={{ fontSize: isMobile ? "12px" : "14px", marginBottom: "8px" }}>
                최대 나이
              </Label>
              <Input
                $isMobile={isMobile}
                type="number"
                min="18"
                max="100"
                value={formData.maxAge}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  maxAge: parseInt(e.target.value) || 50 
                }))}
              />
            </div>
          </GenderAgeContainer>
        </FormGroup>

        {/* 참여자 성향 선택 */}
        <TraitSelector
          traits={traits}
          selectedTraitIds={formData.selectedTraitIds}
          onSelectionChange={handleTraitSelectionChange}
          maxSelection={3}
        />

        {/* 버튼 그룹 */}
        <ButtonGroup $isMobile={isMobile}>
          <Button
            variant="secondary"
            size="large"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? "생성 중..." : "모임 만들기"}
          </Button>
        </ButtonGroup>
      </form>
    </Container>
  );
};