import React from "react";
import styled from "styled-components";
import {
  Heart,
  Users,
  Target,
  // TrendingUp,
  Award,
  // ChevronRight,
  HandHeart,
  Globe,
  Sparkles,
} from "lucide-react";
import { ServiceCard } from "../../../../shared/components/ui";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "0")};
`;

const HeroCard = styled.div<{ $isMobile?: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.primary}
  );
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "32px 20px" : "48px 32px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  text-align: center;
`;

const HeroIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const HeroTitle = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  font-weight: 700;
  margin: 0 0 12px 0;
`;

const HeroDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  opacity: 0.95;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

const StatsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
  margin-top: 24px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  opacity: 0.9;
`;

const DonationCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const DonationTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DonationOptions = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-bottom: 20px;
`;

const DonationOption = styled.button<{ $isMobile?: boolean; $selected?: boolean }>`
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.gray50};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.white : theme.colors.text.primary};
  border: 1px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "16px 12px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  outline: none;

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.gray100};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CustomAmountInput = styled.input<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  margin-bottom: 20px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DonateButton = styled.button<{ $isMobile?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CampaignsSection = styled.section<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
`;

const SectionTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
`;

const CampaignCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CampaignHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CampaignInfo = styled.div`
  flex: 1;
`;

const CampaignTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "17px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const CampaignOrganization = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const CampaignBadge = styled.span<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ $isMobile }) => ($isMobile ? "4px 8px" : "6px 10px")};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => $percentage}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const CampaignStats = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ImpactSection = styled.section<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

export const DonationPage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(5000);
  const [customAmount, setCustomAmount] = React.useState<string>("");

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const donationAmounts = [5000, 10000, 20000, 50000, 100000];

  const campaigns = [
    {
      id: 1,
      title: "지역 어르신 겨울나기 지원",
      organization: "서울 노인복지협회",
      current: 3250000,
      goal: 5000000,
      participants: 156,
      daysLeft: 15,
      badge: "긴급",
    },
    {
      id: 2,
      title: "저소득층 아동 교육 지원",
      organization: "한국교육나눔재단",
      current: 8700000,
      goal: 10000000,
      participants: 423,
      daysLeft: 30,
      badge: "인기",
    },
    {
      id: 3,
      title: "유기동물 보호소 의료비 지원",
      organization: "동물사랑실천협회",
      current: 2100000,
      goal: 3000000,
      participants: 89,
      daysLeft: 7,
      badge: "마감임박",
    },
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(null);
    }
  };

  const handleDonate = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    alert(`${amount?.toLocaleString()}원 기부하기 기능을 준비 중입니다.`);
  };

  return (
    <PageContainer $isMobile={isMobile}>
      <HeroCard $isMobile={isMobile}>
        <HeroIcon $isMobile={isMobile}>
          <HandHeart size={isMobile ? 56 : 72} />
        </HeroIcon>
        <HeroTitle $isMobile={isMobile}>따뜻한 나눔의 시작</HeroTitle>
        <HeroDescription $isMobile={isMobile}>
          작은 정성이 모여 큰 변화를 만듭니다.
          <br />
          포인트로 함께 나누는 행복한 세상을 만들어가요.
        </HeroDescription>
        <StatsGrid $isMobile={isMobile}>
          <StatItem>
            <StatValue $isMobile={isMobile}>152.3M</StatValue>
            <StatLabel $isMobile={isMobile}>총 기부금액</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>3,847</StatValue>
            <StatLabel $isMobile={isMobile}>기부 참여자</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>42</StatValue>
            <StatLabel $isMobile={isMobile}>진행 캠페인</StatLabel>
          </StatItem>
        </StatsGrid>
      </HeroCard>

      <DonationCard $isMobile={isMobile}>
        <DonationTitle $isMobile={isMobile}>
          <Heart size={20} />
          포인트로 기부하기
        </DonationTitle>
        <DonationOptions $isMobile={isMobile}>
          {donationAmounts.map((amount) => (
            <DonationOption
              key={amount}
              $isMobile={isMobile}
              $selected={selectedAmount === amount}
              onClick={() => handleAmountSelect(amount)}
            >
              {amount.toLocaleString()}P
            </DonationOption>
          ))}
        </DonationOptions>
        <CustomAmountInput
          $isMobile={isMobile}
          type="text"
          placeholder="직접 입력 (포인트)"
          value={customAmount}
          onChange={handleCustomAmountChange}
        />
        <DonateButton $isMobile={isMobile} onClick={handleDonate}>
          <Heart size={20} />
          기부하기
        </DonateButton>
      </DonationCard>

      <CampaignsSection $isMobile={isMobile}>
        <SectionTitle $isMobile={isMobile}>진행중인 캠페인</SectionTitle>
        {campaigns.map((campaign) => {
          const percentage = Math.round((campaign.current / campaign.goal) * 100);
          return (
            <CampaignCard key={campaign.id} $isMobile={isMobile}>
              <CampaignHeader>
                <CampaignInfo>
                  <CampaignTitle $isMobile={isMobile}>
                    {campaign.title}
                  </CampaignTitle>
                  <CampaignOrganization $isMobile={isMobile}>
                    {campaign.organization}
                  </CampaignOrganization>
                </CampaignInfo>
                <CampaignBadge $isMobile={isMobile}>
                  {campaign.badge}
                </CampaignBadge>
              </CampaignHeader>
              <ProgressBar>
                <ProgressFill $percentage={percentage} />
              </ProgressBar>
              <CampaignStats $isMobile={isMobile}>
                <span>{percentage}% 달성</span>
                <span>{campaign.participants}명 참여</span>
                <span>D-{campaign.daysLeft}</span>
              </CampaignStats>
            </CampaignCard>
          );
        })}
      </CampaignsSection>

      <ImpactSection $isMobile={isMobile}>
        <SectionTitle $isMobile={isMobile}>나눔의 가치</SectionTitle>

        <ServiceCard
          icon={<Users size={20} />}
          title="함께하는 기부"
          description="혼자서는 어려운 일도 함께라면 가능합니다. 작은 포인트가 모여 큰 도움이 됩니다."
          actions={[
            {
              label: "기부 참여하기",
              onClick: () => alert("기부 참여 기능을 준비 중입니다."),
              variant: "primary",
            },
          ]}
          isMobile={isMobile}
        />

        <ServiceCard
          icon={<Target size={20} />}
          title="투명한 사용"
          description="모든 기부금은 투명하게 관리되며, 사용 내역을 실시간으로 확인할 수 있습니다."
          actions={[
            {
              label: "사용내역 보기",
              onClick: () => alert("사용내역 조회 기능을 준비 중입니다."),
              variant: "secondary",
            },
          ]}
          isMobile={isMobile}
        />

        <ServiceCard
          icon={<Award size={20} />}
          title="기부 리워드"
          description="기부에 참여하시면 특별한 뱃지와 리워드를 받을 수 있습니다."
          actions={[
            {
              label: "리워드 확인",
              onClick: () => alert("리워드 확인 기능을 준비 중입니다."),
              variant: "secondary",
            },
          ]}
          isMobile={isMobile}
        />

        <ServiceCard
          icon={<Globe size={20} />}
          title="정기 기부"
          description="매월 정기적으로 기부하여 지속적인 변화를 만들어보세요."
          actions={[
            {
              label: "정기기부 시작",
              onClick: () => alert("정기기부 기능을 준비 중입니다."),
              variant: "primary",
            },
          ]}
          isMobile={isMobile}
        />

        <ServiceCard
          icon={<Sparkles size={20} />}
          title="기부 증서"
          description="기부하신 내역에 대한 공식 증서를 발급받을 수 있습니다."
          actions={[
            {
              label: "증서 발급",
              onClick: () => alert("증서 발급 기능을 준비 중입니다."),
              variant: "secondary",
            },
          ]}
          isMobile={isMobile}
        />
      </ImpactSection>
    </PageContainer>
  );
};