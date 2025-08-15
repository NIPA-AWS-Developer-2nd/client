import React from "react";
import styled from "styled-components";
import { useOnboardingStore } from "../../../shared/store";
import { Skeleton } from "../../../shared/components/ui";
import { useAlert } from "../../../shared/components/common";

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


export const Step3Interests: React.FC = () => {
  const { formData, isLoading, updateFormData, categories, hashtags, loadStaticData } = useOnboardingStore();
  const { warning } = useAlert();

  // 데이터 로드
  React.useEffect(() => {
    if (categories.length === 0 || hashtags.length === 0) {
      loadStaticData();
    }
  }, [categories.length, hashtags.length, loadStaticData]);

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests;
    let newInterests: string[];

    if (currentInterests.includes(interest)) {
      newInterests = currentInterests.filter((i) => i !== interest);
    } else {
      if (currentInterests.length >= 6) {
        warning("최대 6개까지 선택할 수 있습니다.");
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

  const handleMoodToggle = (_hashtagId: number, hashtagName: string) => {
    const currentMoods = formData.moods || [];
    let newMoods: string[];

    if (currentMoods.includes(hashtagName)) {
      newMoods = currentMoods.filter((m) => m !== hashtagName);
    } else {
      if (currentMoods.length >= 6) {
        warning("최대 6개까지 선택할 수 있습니다.");
        return;
      }
      newMoods = [...currentMoods, hashtagName];
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
        <SectionSubtitle>최대 6개까지 선택할 수 있어요</SectionSubtitle>

        <InterestsGrid>
          {categories.map((category) => (
            <InterestButton
              key={category.id}
              $selected={formData.interests.includes(category.name)}
              onClick={() => handleInterestToggle(category.name)}
            >
              {category.icon} {category.name}
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
          자신을 잘 나타내는 해시태그를 최대 6개 선택해주세요.
        </SectionSubtitle>

        <InterestsGrid>
          {hashtags.map((hashtag) => (
            <InterestButton
              key={hashtag.id}
              $selected={(formData.moods || []).includes(hashtag.name)}
              onClick={() => handleMoodToggle(hashtag.id, hashtag.name)}
            >
              {hashtag.name}
            </InterestButton>
          ))}
        </InterestsGrid>
      </Section>
    </Container>
  );
};
