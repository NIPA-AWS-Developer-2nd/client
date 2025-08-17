import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { Hash } from "lucide-react";
import { userApiService, type Hashtag } from "../../../../shared/services/userApi";
import { Skeleton } from "../../../../shared/components/ui";

export interface SelectedHashtagWithPreference {
  name: string;
  preference: 'preferred' | 'void';
}

interface HashtagSelectorProps {
  selectedHashtags: SelectedHashtagWithPreference[];
  onHashtagsChange: (hashtags: SelectedHashtagWithPreference[]) => void;
  isMobile?: boolean;
  maxSelection?: number;
}

const Container = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;



const SectionTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const PreferenceSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HashtagsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $isMobile }) => ($isMobile ? '2' : '3')}, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
`;

const HashtagButton = styled.button<{ 
  $selected: boolean; 
  $preference?: 'preferred' | 'void';
  $isMobile?: boolean; 
}>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 8px" : "12px 10px")};
  border: ${({ theme, $selected, $preference }) => {
    if (!$selected) return `1.5px solid ${theme.colors.border.light}`;
    if ($preference === 'preferred') return `1.5px solid ${theme.colors.primary}`;
    return `1.5px solid ${theme.colors.gray400}`;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $selected, $preference }) => {
    if (!$selected) return theme.colors.white;
    if ($preference === 'preferred') return theme.colors.primary + '15';
    return theme.colors.gray100;
  }};
  color: ${({ theme, $selected, $preference }) => {
    if (!$selected) return theme.colors.text.primary;
    if ($preference === 'preferred') return theme.colors.primary;
    return theme.colors.gray600;
  }};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme, $selected, $preference }) => {
      if (!$selected) return theme.colors.primary;
      return $preference === 'preferred' ? theme.colors.primary : theme.colors.gray500;
    }};
    background: ${({ theme, $selected, $preference }) => {
      if (!$selected) {
        return theme.colors.primary + '08';
      }
      return $preference === 'preferred' ? theme.colors.primary + '25' : theme.colors.gray200;
    }};
  }

  &:active {
    transform: translateY(0);
  }
`;


const SkeletonGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $isMobile }) => ($isMobile ? '2' : '3')}, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
`;

const HashtagSelector: React.FC<HashtagSelectorProps> = ({
  selectedHashtags,
  onHashtagsChange,
  isMobile = false,
  maxSelection = 6,
}) => {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userApiService.getUserHashtags();
        setHashtags(data);
      } catch (err) {
        console.error('Failed to fetch hashtags:', err);
        setError(err instanceof Error ? err.message : '서버 측에서 예상치 못한 문제가 발생하여 해시태그를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  const handleHashtagToggle = (hashtagName: string, preference: 'preferred' | 'void') => {
    const existingIndex = selectedHashtags.findIndex(h => h.name === hashtagName);
    const newHashtags = [...selectedHashtags];

    if (existingIndex >= 0) {
      const existing = selectedHashtags[existingIndex];
      if (existing.preference === preference) {
        // 같은 선호도로 다시 클릭하면 제거
        newHashtags.splice(existingIndex, 1);
      } else {
        // 다른 선호도로 클릭하면 변경
        newHashtags[existingIndex] = { name: hashtagName, preference };
      }
    } else {
      // 새로 선택 - 전체 최대 6개, 각 preference별로 3개 제한
      if (selectedHashtags.length >= maxSelection) {
        alert(`최대 ${maxSelection}개까지 선택할 수 있습니다.`);
        return;
      }
      
      const currentPreferenceCount = selectedHashtags.filter(h => h.preference === preference).length;
      if (currentPreferenceCount >= 3) {
        const sectionName = preference === 'preferred' ? '함께하고 싶어요' : '상관없어요';
        alert(`${sectionName} 섹션에서는 최대 3개까지 선택할 수 있습니다.`);
        return;
      }
      newHashtags.push({ name: hashtagName, preference });
    }

    onHashtagsChange(newHashtags);
  };

  const getHashtagState = (hashtagName: string) => {
    const found = selectedHashtags.find(h => h.name === hashtagName);
    return found ? { selected: true, preference: found.preference } : { selected: false, preference: undefined };
  };

  if (isLoading) {
    return (
      <Container $isMobile={isMobile}>        
        <SkeletonGrid $isMobile={isMobile}>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height="42px"
                borderRadius="8px"
              />
            ))}
        </SkeletonGrid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container $isMobile={isMobile}>
        <div style={{ 
          textAlign: 'center', 
          color: '#EF4444', 
          fontSize: isMobile ? '13px' : '14px',
          padding: '20px 0'
        }}>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container $isMobile={isMobile}>
      <PreferenceSection>
        <SectionTitle $isMobile={isMobile}>함께하고 싶어요 (최대 3개)</SectionTitle>
        <HashtagsGrid $isMobile={isMobile}>
          {hashtags.map((hashtag) => {
            const state = getHashtagState(hashtag.name);
            const isPreferredSelected = state.selected && state.preference === 'preferred';
            return (
              <HashtagButton
                key={`${hashtag.id}-preferred`}
                $selected={isPreferredSelected}
                $preference="preferred"
                $isMobile={isMobile}
                onClick={() => handleHashtagToggle(hashtag.name, 'preferred')}
              >
                {hashtag.name}
              </HashtagButton>
            );
          })}
        </HashtagsGrid>
      </PreferenceSection>
      
      <PreferenceSection>
        <SectionTitle $isMobile={isMobile}>상관없어요 (최대 3개)</SectionTitle>
        <HashtagsGrid $isMobile={isMobile}>
          {hashtags.map((hashtag) => {
            const state = getHashtagState(hashtag.name);
            const isVoidSelected = state.selected && state.preference === 'void';
            return (
              <HashtagButton
                key={`${hashtag.id}-void`}
                $selected={isVoidSelected}
                $preference="void"
                $isMobile={isMobile}
                onClick={() => handleHashtagToggle(hashtag.name, 'void')}
              >
                {hashtag.name}
              </HashtagButton>
            );
          })}
        </HashtagsGrid>
      </PreferenceSection>
    </Container>
  );
};

export default HashtagSelector;