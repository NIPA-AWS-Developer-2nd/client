import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useMissionStore } from "../../../shared/store";

const Container = styled.div<{ $isMobile?: boolean }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div<{ $isMobile?: boolean }>`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ $isMobile }) => $isMobile ? "12px 16px" : "16px 24px"};
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const HeaderTitle = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? "18px" : "20px"};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Content = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => $isMobile ? "20px 16px 120px" : "24px 20px 80px"};
  max-width: 600px;
  margin: 0 auto;
`;

const MissionContext = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.primary}10;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => $isMobile ? "16px" : "20px"};
  margin-bottom: 24px;
`;

const MissionTitle = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => $isMobile ? "14px" : "16px"};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const MissionDescription = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? "13px" : "14px"};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  display: block;
  font-size: ${({ $isMobile }) => $isMobile ? "14px" : "16px"};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Input = styled.input<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => $isMobile ? "12px" : "14px"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => $isMobile ? "14px" : "16px"};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const TextArea = styled.textarea<{ $isMobile?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: ${({ $isMobile }) => $isMobile ? "12px" : "14px"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => $isMobile ? "14px" : "16px"};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const DateTimeRow = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => $isMobile ? "1fr" : "1fr 1fr"};
  gap: 16px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const IconInput = styled(Input)`
  padding-left: 40px;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const Tag = styled.span<{ $removable?: boolean }>`
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  ${({ $removable }) => $removable && `
    cursor: pointer;
    &:hover {
      background: rgba(255, 0, 0, 0.1);
      color: #dc2626;
    }
  `}
`;

const BottomBar = styled.div<{ $isMobile?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ $isMobile }) => $isMobile ? "16px" : "20px"};
  z-index: 100;
`;

const CreateButton = styled.button<{ $isMobile?: boolean; $disabled?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => $isMobile ? "14px" : "16px"};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => $isMobile ? "16px" : "18px"};
  font-weight: 600;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  ${({ $disabled, theme }) => {
    if ($disabled) {
      return `
        background: ${theme.colors.gray200};
        color: ${theme.colors.gray400};
      `;
    }
    
    return `
      background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}dd);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, ${theme.colors.primary}dd, ${theme.colors.primary}bb);
      }
      
      &:active {
        transform: scale(0.98);
      }
    `;
  }}
`;

interface FormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  location: string;
  maxParticipants: number;
  customTags: string[];
}

export const MeetingCreatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const { currentMission, fetchMissionDetails } = useMissionStore();
  
  const missionId = searchParams.get('missionId');
  const [newTag, setNewTag] = React.useState('');
  const [formData, setFormData] = React.useState<FormData>({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    location: '',
    maxParticipants: 6,
    customTags: []
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // 미션 정보 가져오기
    if (missionId && (!currentMission || currentMission.id !== missionId)) {
      fetchMissionDetails(missionId);
    }
  }, [missionId, currentMission, fetchMissionDetails]);

  // 미션 정보를 기반으로 폼 데이터 초기화
  React.useEffect(() => {
    if (currentMission && missionId === currentMission.id) {
      setFormData(prev => ({
        ...prev,
        title: prev.title || `${currentMission.title} 모임`,
        location: prev.location || '',
        customTags: prev.customTags.length === 0 ? [...currentMission.category] : prev.customTags
      }));
    }
  }, [currentMission, missionId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.customTags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          customTags: [...prev.customTags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      customTags: prev.customTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.startDate || !formData.startTime || !formData.location.trim()) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      // 실제 API 호출
      const meetingData = {
        ...formData,
        missionId,
        startDateTime: `${formData.startDate}T${formData.startTime}:00`,
        host: {
          id: 'current-user', // 실제로는 현재 사용자 ID
          name: '나' // 실제로는 현재 사용자 이름
        }
      };

      console.log('Creating meeting:', meetingData);
      
      // 성공 시 모임 리스트로 이동
      const redirectUrl = missionId 
        ? `/meetings?missionId=${missionId}`
        : '/meetings';
      
      alert('모임이 생성되었습니다!');
      navigate(redirectUrl);
      
    } catch (error) {
      console.error('모임 생성 실패:', error);
      alert('모임 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const isFormValid = formData.title.trim() && 
                    formData.startDate && 
                    formData.startTime && 
                    formData.location.trim() &&
                    formData.maxParticipants > 0;

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
        </BackButton>
        <HeaderTitle $isMobile={isMobile}>모임 만들기</HeaderTitle>
      </Header>

      <Content $isMobile={isMobile}>
        {/* 미션 컨텍스트 */}
        {currentMission && missionId && (
          <MissionContext $isMobile={isMobile}>
            <MissionTitle $isMobile={isMobile}>
              🎯 {currentMission.title}
            </MissionTitle>
            <MissionDescription $isMobile={isMobile}>
              {currentMission.description}
            </MissionDescription>
          </MissionContext>
        )}

        <form onSubmit={handleSubmit}>
          {/* 모임 제목 */}
          <FormSection>
            <Label $isMobile={isMobile}>모임 제목 *</Label>
            <Input
              $isMobile={isMobile}
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="어떤 모임인지 알려주세요"
            />
          </FormSection>

          {/* 모임 설명 */}
          <FormSection>
            <Label $isMobile={isMobile}>모임 설명</Label>
            <TextArea
              $isMobile={isMobile}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="모임에 대해 자세히 설명해주세요"
            />
          </FormSection>

          {/* 일시 */}
          <FormSection>
            <Label $isMobile={isMobile}>모임 일시 *</Label>
            <DateTimeRow $isMobile={isMobile}>
              <InputGroup>
                <InputIcon>
                  <Calendar size={16} />
                </InputIcon>
                <IconInput
                  $isMobile={isMobile}
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputIcon>
                  <Clock size={16} />
                </InputIcon>
                <IconInput
                  $isMobile={isMobile}
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </InputGroup>
            </DateTimeRow>
          </FormSection>

          {/* 장소 */}
          <FormSection>
            <Label $isMobile={isMobile}>만날 장소 *</Label>
            <InputGroup>
              <InputIcon>
                <MapPin size={16} />
              </InputIcon>
              <IconInput
                $isMobile={isMobile}
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="구체적인 만날 장소를 입력해주세요"
              />
            </InputGroup>
          </FormSection>

          {/* 모집 인원 */}
          <FormSection>
            <Label $isMobile={isMobile}>모집 인원 *</Label>
            <InputGroup>
              <InputIcon>
                <Users size={16} />
              </InputIcon>
              <IconInput
                $isMobile={isMobile}
                type="number"
                min="2"
                max="20"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 2)}
              />
            </InputGroup>
          </FormSection>

          {/* 태그 */}
          <FormSection>
            <Label $isMobile={isMobile}>태그</Label>
            <Input
              $isMobile={isMobile}
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그를 입력하고 엔터를 눌러주세요"
            />
            <TagsContainer>
              {formData.customTags.map((tag, index) => (
                <Tag key={index} $removable onClick={() => handleRemoveTag(tag)}>
                  {tag} ×
                </Tag>
              ))}
            </TagsContainer>
          </FormSection>
        </form>
      </Content>

      <BottomBar $isMobile={isMobile}>
        <CreateButton 
          $isMobile={isMobile} 
          $disabled={!isFormValid}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          모임 만들기
        </CreateButton>
      </BottomBar>
    </Container>
  );
};