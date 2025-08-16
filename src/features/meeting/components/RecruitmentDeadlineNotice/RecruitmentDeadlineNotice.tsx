import React from "react";
import { Clock, Info } from "lucide-react";
import {
  calculateRecruitmentDeadline,
  formatRecruitmentDeadline,
  getTimeUntilDeadline,
} from "../../utils/recruitmentUtils";
import * as S from "./RecruitmentDeadlineNotice.styles";

interface RecruitmentDeadlineNoticeProps {
  isMobile?: boolean;
}

export const RecruitmentDeadlineNotice: React.FC<
  RecruitmentDeadlineNoticeProps
> = ({ isMobile = false }) => {
  const deadline = calculateRecruitmentDeadline();
  const formattedDeadline = formatRecruitmentDeadline(deadline);
  const timeUntil = getTimeUntilDeadline();

  return (
    <S.Container $isMobile={isMobile}>
      <S.Header>
        <S.IconWrapper $urgent={timeUntil.isUrgent}>
          <Info size={isMobile ? 16 : 18} />
        </S.IconWrapper>
        <S.Title $isMobile={isMobile}>모집 마감 안내</S.Title>
      </S.Header>

      <S.Content>
        <S.DeadlineText $isMobile={isMobile}>
          <strong>{formattedDeadline}</strong>까지 모집
        </S.DeadlineText>

        <S.TimeRemaining $urgent={timeUntil.isUrgent} $isMobile={isMobile}>
          <Clock size={isMobile ? 12 : 14} />
          {timeUntil.hours > 0 ? (
            <span>
              {timeUntil.hours}시간 {timeUntil.minutes}분 남음
            </span>
          ) : (
            <span>{timeUntil.minutes}분 남음</span>
          )}
        </S.TimeRemaining>
      </S.Content>

      <S.GuideText $isMobile={isMobile}>
        💡 모임 활동은 모집 마감 이후 날짜에만 설정할 수 있어요
      </S.GuideText>
    </S.Container>
  );
};
