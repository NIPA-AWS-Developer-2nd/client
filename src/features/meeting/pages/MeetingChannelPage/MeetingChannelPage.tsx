import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  // Settings,
  Info,
  MessageCircle,
  Camera,
  Calendar,
  MapPin,
  Users,
  Crown,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils";
import { useHomeStore } from "../../../../shared/store/homeStore";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAlert } from "../../../../shared/components/common";
import { useTheme } from "../../../../shared/hooks/useTheme";
import * as S from "./MeetingChannelPage.styles";

type ChannelTab = "info" | "chat" | "verification";

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: object) => object;
        LatLng: new (lat: number, lng: number) => object;
        Marker: new (options: object) => object;
        Position: { TOP_RIGHT: string };
      };
    };
  }
}

export const MeetingChannelPage: React.FC = () => {
  const { id: meetingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [activeTab, setActiveTab] = useState<ChannelTab>("info");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const { getMeetingDetail } = useHomeStore();
  const { user } = useAuth();
  const { warning } = useAlert();
  const { isDark } = useTheme();
  const meetingDetail = getMeetingDetail(meetingId || "");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Naver Map initialization
  useEffect(() => {
    // 네이버 지도 API가 이미 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    // 새로운 Maps API 사용 (NCP)
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
      import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "YOUR_CLIENT_ID"
    }`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      console.error("네이버 지도 API 로드 실패");
      // API 로드 실패 시에도 페이지는 정상 작동하도록
      setMapLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // 지역 정보가 있을 때만 지도 초기화
    if (
      mapLoaded && 
      mapRef.current && 
      window.naver && 
      window.naver.maps &&
      meetingDetail &&
      meetingDetail.mission?.location
    ) {
      try {
        // 송파구 중심 좌표 (기본값)
        const songpaLat = 37.5145;
        const songpaLng = 127.1056;

        const mapOptions = {
          center: new window.naver.maps.LatLng(songpaLat, songpaLng),
          zoom: 16,
          minZoom: 7,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
          // 커스텀 스타일 적용 (다크모드일 때)
          ...(isDark
            ? {
                styleMapTypeId: "e82da828-0643-428f-9402-06cb9fc04b8f",
                styleMapTypeOptions: {
                  styleVersion: "20250814193747",
                },
              }
            : {}),
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);

        // 마커 추가
        const markerTitle = meetingDetail.mission?.location || "모임 장소";
        
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(songpaLat, songpaLng),
          map: map,
          title: markerTitle,
        });
      } catch (error) {
        console.error("네이버 지도 초기화 실패:", error);
      }
    }
  }, [mapLoaded, meetingDetail, isDark]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;

    if (minutes === 0) {
      return `${month}월 ${day}일 (${weekday}) ${period} ${displayHours}시`;
    }
    return `${month}월 ${day}일 (${weekday}) ${period} ${displayHours}시 ${minutes}분`;
  };

  const handleMapClick = () => {
    if (meetingDetail?.mission?.location) {
      const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
        meetingDetail.mission.location
      )}`;
      window.open(naverMapUrl, "_blank");
    }
  };

  // 현재 사용자 ID
  const currentUserId = user?.id;
  const _isHost = meetingDetail?.host?.id === currentUserId;

  // 모집 마감 시간 확인 (모집 마감 이후 = 활동 중)
  const isMeetingActive = () => {
    if (!meetingDetail?.recruitUntil) return false;
    const recruitUntilTime = new Date(meetingDetail.recruitUntil);
    const now = new Date();
    return now >= recruitUntilTime;
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab: ChannelTab) => {
    if ((tab === "chat" || tab === "verification") && !isMeetingActive()) {
      warning(
        "채팅과 인증 기능은 모집 마감 이후에 이용할 수 있습니다.",
        "접근 제한"
      );
      return;
    }
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    if (!meetingDetail) {
      return (
        <S.LoadingContainer>모임 정보를 불러오는 중...</S.LoadingContainer>
      );
    }

    switch (activeTab) {
      case "info":
        return (
          <S.InfoContent $isMobile={isMobile}>
            {/* 모임 기본 정보 */}
            <S.Section>
              <S.MeetingTitle $isMobile={isMobile}>
                {meetingDetail.title}
              </S.MeetingTitle>
              {meetingDetail.description && (
                <S.MeetingDescription $isMobile={isMobile}>
                  {meetingDetail.description}
                </S.MeetingDescription>
              )}

              <S.InfoGrid $isMobile={isMobile}>
                <S.InfoItem $isMobile={isMobile}>
                  <Calendar size={isMobile ? 16 : 18} />
                  <span>{formatDateTime(meetingDetail.scheduledAt)}</span>
                </S.InfoItem>

                <S.InfoItem $isMobile={isMobile}>
                  <MapPin size={isMobile ? 16 : 18} />
                  <span>
                    {meetingDetail.region?.districtName}{" "}
                    {meetingDetail.region?.city}
                  </span>
                </S.InfoItem>

                <S.InfoItem $isMobile={isMobile}>
                  <Users size={isMobile ? 16 : 18} />
                  <span>
                    {meetingDetail.currentParticipants}/
                    {meetingDetail.maxParticipants}명
                  </span>
                </S.InfoItem>
              </S.InfoGrid>
            </S.Section>

            {/* 주의사항 */}
            {meetingDetail.mission?.precautions &&
              meetingDetail.mission.precautions.length > 0 && (
                <S.Section>
                  <S.SectionTitle $isMobile={isMobile}>
                    <AlertTriangle size={isMobile ? 14 : 16} />
                    주의사항
                  </S.SectionTitle>
                  <S.PrecautionsList $isMobile={isMobile}>
                    {meetingDetail.mission.precautions.map(
                      (precaution: string, index: number) => (
                        <S.PrecautionItem key={index} $isMobile={isMobile}>
                          • {precaution}
                        </S.PrecautionItem>
                      )
                    )}
                  </S.PrecautionsList>
                </S.Section>
              )}

            {/* 모임 시간 및 장소 카드 */}
            <S.Section>
              <S.SectionTitle $isMobile={isMobile}>
                모임 시간 및 장소
              </S.SectionTitle>

              {/* 시간 정보 */}
              <S.LocationCard
                $isMobile={isMobile}
                style={{ marginBottom: "16px" }}
              >
                <S.LocationCardMain>
                  <S.LocationCardTitle>모임 시작 일시</S.LocationCardTitle>
                  <S.LocationCardContent>
                    {formatDateTime(meetingDetail.scheduledAt)}
                  </S.LocationCardContent>
                  <S.LocationCardSubtext>
                    예상 소요시간: 60분
                  </S.LocationCardSubtext>
                </S.LocationCardMain>
              </S.LocationCard>

              {/* 장소 정보 */}
              {meetingDetail.mission?.location && (
                <S.LocationCard $isMobile={isMobile}>
                  <S.LocationCardMain>
                    <S.LocationCardTitle>모임 장소</S.LocationCardTitle>
                    <S.LocationCardContent>
                      {meetingDetail.mission.location}
                    </S.LocationCardContent>
                    <S.LocationCardSubtext>
                      {meetingDetail.region?.districtName}{" "}
                      {meetingDetail.region?.city}
                    </S.LocationCardSubtext>
                  </S.LocationCardMain>
                </S.LocationCard>
              )}

              {/* 네이버 지도 */}
              {meetingDetail.mission?.location && (
                <>
                  <S.MapFrame ref={mapRef} $isMobile={isMobile} />
                  <S.MapButton onClick={handleMapClick} $isMobile={isMobile}>
                    네이버 지도에서 보기 <ChevronRight size={16} />
                  </S.MapButton>
                </>
              )}
            </S.Section>

            {/* 참가자 정보 */}
            <S.Section>
              <S.SectionTitle $isMobile={isMobile}>
                참가자 ({meetingDetail.currentParticipants}명)
              </S.SectionTitle>
              <S.ParticipantList $isMobile={isMobile}>
                {meetingDetail.participants.map((participant, index) => (
                  <S.ParticipantItem
                    key={`${participant.nickname}-${index}`}
                    $isMobile={isMobile}
                  >
                    <S.ParticipantAvatar
                      src={
                        participant.profileImageUrl ||
                        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
                      }
                      alt={participant.nickname}
                      $isMobile={isMobile}
                      onClick={() => navigate(`/user/${participant.nickname}`)}
                      style={{ cursor: "pointer" }}
                    />
                    <S.ParticipantInfo>
                      <S.ParticipantName
                        $isMobile={isMobile}
                        onClick={() => navigate(`/user/${participant.nickname}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {participant.nickname}
                        {participant.isHost && <Crown size={12} />}
                        {participant.nickname === user?.nickname && (
                          <S.CurrentUserBadge $isMobile={isMobile}>
                            나
                          </S.CurrentUserBadge>
                        )}
                      </S.ParticipantName>
                      <S.ParticipantMeta $isMobile={isMobile}>
                        Lv.{participant.level}
                        {participant.mbti && ` · ${participant.mbti}`}
                      </S.ParticipantMeta>
                    </S.ParticipantInfo>
                  </S.ParticipantItem>
                ))}
              </S.ParticipantList>
            </S.Section>
          </S.InfoContent>
        );

      case "chat":
        return (
          <S.ChatContent $isMobile={isMobile}>
            <S.ComingSoon $isMobile={isMobile}>
              채팅 기능을 준비 중입니다...
            </S.ComingSoon>
          </S.ChatContent>
        );

      case "verification":
        return (
          <S.VerificationContent $isMobile={isMobile}>
            <S.ComingSoon $isMobile={isMobile}>
              인증 기능을 준비 중입니다...
            </S.ComingSoon>
          </S.VerificationContent>
        );

      default:
        return null;
    }
  };

  return (
    <S.PageContainer $isMobile={isMobile}>
      {/* 컨텐츠 영역 */}
      <S.ContentContainer $isMobile={isMobile}>
        {renderTabContent()}
      </S.ContentContainer>

      {/* 하단 탭바 */}
      <S.BottomTabBar $isMobile={isMobile}>
        <S.TabButton
          $active={activeTab === "info"}
          $isMobile={isMobile}
          onClick={() => handleTabClick("info")}
        >
          <Info size={isMobile ? 20 : 24} />
          <S.TabLabel $isMobile={isMobile}>Info</S.TabLabel>
        </S.TabButton>

        <S.TabButton
          $active={activeTab === "chat"}
          $isMobile={isMobile}
          onClick={() => handleTabClick("chat")}
        >
          <MessageCircle size={isMobile ? 20 : 24} />
          <S.TabLabel $isMobile={isMobile}>채팅</S.TabLabel>
        </S.TabButton>

        <S.TabButton
          $active={activeTab === "verification"}
          $isMobile={isMobile}
          onClick={() => handleTabClick("verification")}
        >
          <Camera size={isMobile ? 20 : 24} />
          <S.TabLabel $isMobile={isMobile}>인증</S.TabLabel>
        </S.TabButton>
      </S.BottomTabBar>
    </S.PageContainer>
  );
};
