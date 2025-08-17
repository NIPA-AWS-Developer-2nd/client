import React, { useState } from "react";
import styled from "styled-components";
import { Heart } from "lucide-react";

interface GiftCard {
  id: string;
  brand: string;
  name: string;
  points: number;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GiftCardItemProps {
  giftCard: GiftCard;
  isMobile: boolean;
}

const CardContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: row;
  height: ${({ $isMobile }) => ($isMobile ? "120px" : "140px")};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ImageContainer = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "80px" : "100px")};
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const GiftCardImage = styled.img<{ $isMobile?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
`;

const ContentContainer = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  background: ${({ theme }) => theme.colors.card};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Brand = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProductName = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
`;

const Points = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const HeartButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ theme }) => theme.colors.surface}90;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    transform: scale(1.1);
  }
`;

export const GiftCardItem: React.FC<GiftCardItemProps> = ({
  giftCard,
  isMobile,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    // TODO: 상세 페이지로 이동
    console.log("상세 보기:", giftCard);
  };

  return (
    <CardContainer $isMobile={isMobile} onClick={handleCardClick}>
      <ImageContainer $isMobile={isMobile}>
        <GiftCardImage
          src={giftCard.imageUrl}
          alt={giftCard.name}
          $isMobile={isMobile}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </ImageContainer>
      <ContentContainer $isMobile={isMobile}>
        <InfoSection>
          <Brand $isMobile={isMobile}>{giftCard.brand}</Brand>
          <ProductName $isMobile={isMobile}>{giftCard.name}</ProductName>
        </InfoSection>
        <PriceSection>
          <Points $isMobile={isMobile}>
            {giftCard.points.toLocaleString()}P
          </Points>
        </PriceSection>
      </ContentContainer>
      <HeartButton onClick={handleLike}>
        <Heart 
          size={16} 
          fill={isLiked ? "#ff6b35" : "none"} 
          color={isLiked ? "#ff6b35" : "#666"} 
        />
      </HeartButton>
    </CardContainer>
  );
};
