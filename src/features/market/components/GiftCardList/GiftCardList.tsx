import React from "react";
import styled from "styled-components";
import { GiftCardItem } from "../GiftCardItem";

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

interface GiftCardListProps {
  giftCards: GiftCard[];
  isLoading: boolean;
  isMobile: boolean;
}

const ListContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const LoadingContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const SkeletonCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  height: ${({ $isMobile }) => ($isMobile ? "120px" : "140px")};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const EmptyContainer = styled.div<{ $isMobile?: boolean }>`
  text-align: center;
  padding: ${({ $isMobile }) => ($isMobile ? "40px 20px" : "60px 20px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  margin: 0;
`;

export const GiftCardList: React.FC<GiftCardListProps> = ({
  giftCards,
  isLoading,
  isMobile,
}) => {
  if (isLoading) {
    return (
      <LoadingContainer $isMobile={isMobile}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} $isMobile={isMobile} />
        ))}
      </LoadingContainer>
    );
  }

  if (giftCards.length === 0) {
    return (
      <ListContainer $isMobile={isMobile}>
        <EmptyContainer $isMobile={isMobile}>
          <EmptyText $isMobile={isMobile}>
            선택한 카테고리에 상품이 없습니다.
          </EmptyText>
        </EmptyContainer>
      </ListContainer>
    );
  }

  return (
    <ListContainer $isMobile={isMobile}>
      {giftCards.map((giftCard) => (
        <GiftCardItem
          key={giftCard.id}
          giftCard={giftCard}
          isMobile={isMobile}
        />
      ))}
    </ListContainer>
  );
};
