import React from "react";
import styled from "styled-components";
import {
  ShoppingCart,
  Coffee,
  Film,
  Gift,
  Plane,
  CreditCard,
  Smartphone,
  Gem,
  Target,
  Coins,
  ShoppingBag,
} from "lucide-react";
import { ServiceCard } from "../components/ui/ServiceCard";
import { deviceDetection } from "../utils/deviceDetection";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
`;

const PointsCard = styled.div<{ $isMobile?: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.gray400}
  );
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 28px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  text-align: center;
`;

const PointsIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.white};
`;

const PointsTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  margin: 0 0 20px 0;
  opacity: 0.9;
`;

const PointsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
`;

const PointsItem = styled.div`
  text-align: center;
`;

const PointsValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-weight: 700;
  margin-bottom: 4px;
`;

const PointsLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  opacity: 0.8;
  font-weight: 500;
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

const CategoryItem = styled.button<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  outline: none;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
  }

  &:focus {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
  }

  &:active {
    background: ${({ theme }) => theme.colors.gray500};
    color: ${({ theme }) => theme.colors.white};
    transform: scale(0.98);
  }
`;

const CategoryIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CategoryLabel = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const ServicesSection = styled.section<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const SectionTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
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
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userPoints = {
    current: 2850,
    earned: 3200,
    spent: 350,
  };

  const categories = [
    { icon: ShoppingCart, label: "음식" },
    { icon: Coffee, label: "카페" },
    { icon: Film, label: "영화" },
    { icon: Gift, label: "선물" },
    { icon: Plane, label: "여행" },
    { icon: CreditCard, label: "금융" },
    { icon: Smartphone, label: "디지털" },
    { icon: Gem, label: "프리미엄" },
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <PageContainer $isMobile={isMobile}>
      <PointsCard $isMobile={isMobile}>
        <PointsIcon $isMobile={isMobile}>
          <Coins size={isMobile ? 48 : 56} />
        </PointsIcon>
        <PointsTitle $isMobile={isMobile}>내 포인트 현황</PointsTitle>
        <PointsGrid $isMobile={isMobile}>
          <PointsItem>
            <PointsValue $isMobile={isMobile}>
              {userPoints.current.toLocaleString()}P
            </PointsValue>
            <PointsLabel $isMobile={isMobile}>보유 포인트</PointsLabel>
          </PointsItem>
          <PointsItem>
            <PointsValue $isMobile={isMobile}>
              {userPoints.earned.toLocaleString()}P
            </PointsValue>
            <PointsLabel $isMobile={isMobile}>총 획득</PointsLabel>
          </PointsItem>
          <PointsItem>
            <PointsValue $isMobile={isMobile}>
              {userPoints.spent.toLocaleString()}P
            </PointsValue>
            <PointsLabel $isMobile={isMobile}>총 사용</PointsLabel>
          </PointsItem>
        </PointsGrid>
      </PointsCard>

      <CategoriesCard $isMobile={isMobile}>
        <CategoriesTitle $isMobile={isMobile}>카테고리</CategoriesTitle>
        <CategoriesGrid $isMobile={isMobile}>
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <CategoryItem
                key={index}
                $isMobile={isMobile}
                onClick={() => handleCategoryClick(category.label)}
              >
                <CategoryIcon $isMobile={isMobile}>
                  <IconComponent size={isMobile ? 20 : 24} />
                </CategoryIcon>
                <CategoryLabel $isMobile={isMobile}>
                  {category.label}
                </CategoryLabel>
              </CategoryItem>
            );
          })}
        </CategoriesGrid>
      </CategoriesCard>

      {selectedCategory && (
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon $isMobile={isMobile}>
            <ShoppingBag size={isMobile ? 48 : 64} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>
            {selectedCategory} 카테고리에 상품이 없습니다.
          </EmptyText>
        </EmptyState>
      )}

      <ServicesSection $isMobile={isMobile}>
        <SectionTitle $isMobile={isMobile}>포인트 서비스</SectionTitle>

        <ServiceCard
          icon={<Target size={20} />}
          title="목표 달성 보너스"
          description="월간 목표를 달성하면 추가 포인트를 받을 수 있습니다. 꾸준한 활동으로 더 많은 혜택을 누려보세요."
          actions={[
            {
              label: "목표 설정하기",
              onClick: () => alert("목표 설정 기능을 준비 중입니다."),
              variant: "primary",
            },
          ]}
          isMobile={isMobile}
        />

        <ServiceCard
          icon={<CreditCard size={20} />}
          title="포인트 충전"
          description="추가 포인트가 필요하신가요? 다양한 방법으로 포인트를 충전할 수 있습니다."
          actions={[
            {
              label: "충전하기",
              onClick: () => alert("포인트 충전 기능을 준비 중입니다."),
              variant: "secondary",
            },
          ]}
          isMobile={isMobile}
        />
      </ServicesSection>
    </PageContainer>
  );
};
