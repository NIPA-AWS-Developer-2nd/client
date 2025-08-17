import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Coffee,
  ShoppingCart,
  Pizza,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { useGiftCards } from "../hooks/useGiftCards";

enum GiftCardCategory {
  COFFEE_BEVERAGE = "coffee_beverage",
  CHICKEN = "chicken",
  FAST_FOOD = "fast_food",
  CONVENIENCE = "convenience",
}
import { GiftCardList } from "../components/GiftCardList";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
`;

const BannerContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
`;

const BannerImage = styled.img<{ $isMobile?: boolean }>`
  width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: block;
`;


const CategoriesCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
`;

const CategoriesTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
`;

const CategoriesGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const CategoryItem = styled.button<{
  $isMobile?: boolean;
  $isSelected?: boolean;
}>`
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : theme.colors.gray50};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  outline: none;
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.gray100};
  }

  &:focus {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.gray100};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CategoryIcon = styled.div<{ $isMobile?: boolean; $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};
`;

const CategoryLabel = styled.span<{
  $isMobile?: boolean;
  $isSelected?: boolean;
}>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};
  text-align: center;
`;

const EmptyState = styled.div<{ $isMobile?: boolean }>`
  text-align: center;
  padding: ${({ $isMobile }) => ($isMobile ? "40px 20px" : "60px 20px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  margin: 0;
`;

export const MarketPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [selectedCategory, setSelectedCategory] = useState<GiftCardCategory>(
    GiftCardCategory.COFFEE_BEVERAGE
  );

  // 기프티콘 데이터 가져오기
  const {
    giftCards,
    isLoading: isLoadingGiftCards,
    error,
  } = useGiftCards({
    category: selectedCategory,
    limit: 20,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const categories = [
    {
      icon: Coffee,
      label: "커피/음료",
      value: GiftCardCategory.COFFEE_BEVERAGE,
    },
    { icon: Pizza, label: "치킨", value: GiftCardCategory.CHICKEN },
    { icon: Zap, label: "패스트푸드", value: GiftCardCategory.FAST_FOOD },
    {
      icon: ShoppingCart,
      label: "편의점",
      value: GiftCardCategory.CONVENIENCE,
    },
  ];

  const handleCategoryClick = (category: GiftCardCategory) => {
    setSelectedCategory(category);
  };

  return (
    <PageContainer $isMobile={isMobile}>
      <BannerContainer $isMobile={isMobile}>
        <BannerImage 
          src="/src/assets/images/banner_860x480.jpg" 
          alt="포인트마켓 배너"
          $isMobile={isMobile}
        />
      </BannerContainer>
      
      <CategoriesCard $isMobile={isMobile}>
        <CategoriesTitle $isMobile={isMobile}>카테고리</CategoriesTitle>
        <CategoriesGrid $isMobile={isMobile}>
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.value;
            return (
              <CategoryItem
                key={index}
                $isMobile={isMobile}
                $isSelected={isSelected}
                onClick={() => handleCategoryClick(category.value)}
              >
                <CategoryIcon $isMobile={isMobile} $isSelected={isSelected}>
                  <IconComponent size={isMobile ? 20 : 24} />
                </CategoryIcon>
                <CategoryLabel $isMobile={isMobile} $isSelected={isSelected}>
                  {category.label}
                </CategoryLabel>
              </CategoryItem>
            );
          })}
        </CategoriesGrid>
      </CategoriesCard>

      {/* 기프티콘 목록 */}
      <GiftCardList
        giftCards={giftCards}
        isLoading={isLoadingGiftCards}
        isMobile={isMobile}
      />

      {error && (
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon $isMobile={isMobile}>
            <ShoppingBag size={isMobile ? 48 : 64} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>{error}</EmptyText>
        </EmptyState>
      )}
    </PageContainer>
  );
};
