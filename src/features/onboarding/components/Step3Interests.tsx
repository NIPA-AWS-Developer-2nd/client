import React from "react";
import styled from "styled-components";
import { useOnboardingStore } from "../../../shared/store";
import { Skeleton } from "../../../shared/components/ui";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 16px;
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const InterestButton = styled.button<{ $selected: boolean }>`
  padding: 12px 10px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }
`;

const MbtiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const MbtiButton = styled(InterestButton)`
  font-size: 12px;
  font-weight: 600;
  padding: 12px 8px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const INTERESTS_LIST = [
  "맛집 투어",
  "액티비티",
  "여행",
  "음악",
  "패션",
  "오락",
  "전시/공연",
  "봉사활동",
  "반려동물",
  "카페",
  "사진",
  "영화",
];

const MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
];

const TAG_OPTIONS = [
  "#웃음이넘치는",
  "#열정적인",
  "#차분한",
  "#긍정적인",
  "#활동적인",
  "#자유로운",
  "#진지한",
  "#활발한",
  "#창의적인",
  "#수다를좋아하는",
  "#점잖은",
  "#현실적인",
  "#공감능력",
  "#도전적인",
  "#섬세한",
];

export const Step3Interests: React.FC = () => {
  const { formData, isLoading, updateFormData } = useOnboardingStore();

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests;
    let newInterests: string[];

    if (currentInterests.includes(interest)) {
      newInterests = currentInterests.filter((i) => i !== interest);
    } else {
      if (currentInterests.length >= 3) {
        return;
      }
      newInterests = [...currentInterests, interest];
    }

    updateFormData({ interests: newInterests });
  };

  const handleMbtiSelect = (mbtiType: string) => {
    const newMbti = formData.mbti === mbtiType ? "" : mbtiType;
    updateFormData({ mbti: newMbti });
  };

  const handleMoodToggle = (mood: string) => {
    const currentMoods = formData.moods || [];
    let newMoods: string[];

    if (currentMoods.includes(mood)) {
      newMoods = currentMoods.filter((m) => m !== mood);
    } else {
      if (currentMoods.length >= 3) {
        alert("최대 3개까지 선택할 수 있습니다.");
        return;
      }
      newMoods = [...currentMoods, mood];
    }

    updateFormData({ moods: newMoods });
  };

  if (isLoading) {
    return (
      <Container>
        <Title>관심사를 선택해주세요</Title>
        <Subtitle>관심사를 기반으로 맞춤 미션을 추천해드려요.</Subtitle>

        <SkeletonGrid>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height="48px"
                borderRadius="8px"
              />
            ))}
        </SkeletonGrid>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Title>관심사를 선택해주세요</Title>
        <Subtitle>관심사를 기반으로 맞춤 미션을 추천해드려요.</Subtitle>
        <SectionTitle>나의 관심사</SectionTitle>
        <SectionSubtitle>최대 3개까지 선택할 수 있어요</SectionSubtitle>

        <InterestsGrid>
          {INTERESTS_LIST.map((interest) => (
            <InterestButton
              key={interest}
              $selected={formData.interests.includes(interest)}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </InterestButton>
          ))}
        </InterestsGrid>
      </Section>

      <Section>
        <SectionTitle>나의 MBTI</SectionTitle>
        <SectionSubtitle>
          서로의 MBTI를 참고하여 더 잘 맞는 팀을 찾을 수 있어요.
        </SectionSubtitle>

        <MbtiGrid>
          {MBTI_TYPES.map((mbtiType) => (
            <MbtiButton
              key={mbtiType}
              $selected={formData.mbti === mbtiType}
              onClick={() => handleMbtiSelect(mbtiType)}
            >
              {mbtiType}
            </MbtiButton>
          ))}
        </MbtiGrid>
      </Section>

      <Section>
        <SectionTitle>나를 표현</SectionTitle>
        <SectionSubtitle>
          자신을 잘 나타내는 해시태그를 최대 3개 선택해주세요.
        </SectionSubtitle>

        <InterestsGrid>
          {TAG_OPTIONS.map((tag) => (
            <InterestButton
              key={tag}
              $selected={(formData.moods || []).includes(tag)}
              onClick={() => handleMoodToggle(tag)}
            >
              {tag}
            </InterestButton>
          ))}
        </InterestsGrid>
      </Section>
    </Container>
  );
};
