import React from "react";
import * as S from "./MeetingCardSkeleton.styles";

const MeetingCardSkeleton: React.FC = () => {
  return (
    <S.SkeletonCard>
      {/* 썸네일 스켈레톤 */}
      <S.SkeletonThumbnail />
      
      {/* 콘텐츠 영역 */}
      <S.SkeletonContent>
        {/* 카테고리와 난이도 */}
        <S.SkeletonHeader>
          <S.SkeletonBadge />
          <S.SkeletonBadge $width="60px" />
        </S.SkeletonHeader>

        {/* 제목 */}
        <S.SkeletonTitle />
        
        {/* 설명 */}
        <S.SkeletonDescription>
          <S.SkeletonLine />
          <S.SkeletonLine $width="80%" />
        </S.SkeletonDescription>

        {/* 정보 섹션 */}
        <S.SkeletonInfo>
          <S.SkeletonInfoItem>
            <S.SkeletonIcon />
            <S.SkeletonText $width="80px" />
          </S.SkeletonInfoItem>
          <S.SkeletonInfoItem>
            <S.SkeletonIcon />
            <S.SkeletonText $width="60px" />
          </S.SkeletonInfoItem>
        </S.SkeletonInfo>

        {/* 호스트 정보 */}
        <S.SkeletonFooter>
          <S.SkeletonAvatar />
          <S.SkeletonHostInfo>
            <S.SkeletonText $width="80px" />
            <S.SkeletonText $width="40px" $height="14px" />
          </S.SkeletonHostInfo>
          <S.SkeletonButton />
        </S.SkeletonFooter>
      </S.SkeletonContent>
    </S.SkeletonCard>
  );
};

export default MeetingCardSkeleton;