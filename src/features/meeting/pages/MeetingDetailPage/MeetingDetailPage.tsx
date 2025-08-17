import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock,
  Users,
  MapPin,
  ChevronRight,
  DollarSign,
  Timer,
  Crown,
  User,
  Heart,
  Edit3,
} from "lucide-react";
import { meetingApiService } from "../../../../shared/services/meetingApi";
import { attendanceApiService } from "../../../../shared/services/attendanceApi";
import type { MeetingDetailDto } from "../../../../shared/services/meetingApi";
import type {
  AttendanceStatusResponse,
  MyAttendanceResponse,
} from "../../../../shared/services/attendanceApi";
import { deviceDetection, formatLevel } from "../../../../shared/utils";
import { useTheme } from "../../../../shared/hooks/useTheme";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useHomeStore } from "../../../../shared/store/homeStore";
import { AlertModal } from "../../../../shared/components/common";
import { MeetingJoinModal } from "../../components/MeetingJoinModal/MeetingJoinModal";
import {
  QRCodeScanner,
  QRCodeGenerator,
} from "../../../../shared/components/ui";
import {
  PageContainer,
  StatusBadge,
  CountdownBadge,
  HeroTitle,
  InfoChip,
  InfoIcon,
  ContentSection,
  StorySection,
  SectionTitle,
  Description,
  HostCard,
  HostAvatar,
  HostInfo,
  HostName,
  HostLevel,
  MemberItem,
  MemberInfo,
  MemberName,
  MemberLevel,
  MemberAvatar,
  MemberDetails,
  MemberMBTI,
  HostBadge,
  DetailsGrid,
  MapFrame,
  DetailCard,
  DetailHeader,
  DetailContent,
  LocationInfo,
  LocationMain,
  LocationName,
  LocationAddress,
  MissionCard,
  MissionHeader,
  MissionTitle,
  MissionBody,
  ViewMissionBtn,
  FloatingActions,
  ActionContainer,
  PriceInfo,
  SeatsInfo,
  PrimaryAction,
  BottomActionSection,
} from "./MeetingDetailPage.styles";

const getStatusInfo = (
  status: string,
  currentParticipants: number,
  participants: number
) => {
  const isFull = currentParticipants >= participants && status === "recruiting";

  if (isFull) {
    return { text: "모집완료", color: "#F59E0B", bgColor: "#FEF3C7" };
  }

  switch (status) {
    case "recruiting":
      return { text: "모집중", color: "#10B981", bgColor: "#D1FAE5" };
    case "active":
      return { text: "진행중", color: "#3B82F6", bgColor: "#DBEAFE" };
    case "completed":
      return { text: "완료", color: "#6B7280", bgColor: "#F3F4F6" };
    case "cancelled":
      return { text: "취소됨", color: "#EF4444", bgColor: "#FEE2E2" };
    default:
      return { text: "알 수 없음", color: "#6B7280", bgColor: "#F3F4F6" };
  }
};

const calculateTimeRemaining = (dateStr: string, timeStr: string) => {
  const meetingDateTime = new Date(`${dateStr} ${timeStr}`);
  const now = new Date();
  const diffInMs = meetingDateTime.getTime() - now.getTime();

  if (diffInMs <= 0) return { display: "시작됨", urgent: false };

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffInHours < 1) {
    return { display: `${diffInMinutes}분 후`, urgent: true };
  } else if (diffInHours < 24) {
    return { display: `${diffInHours}시간 후`, urgent: diffInHours < 3 };
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return { display: `${diffInDays}일 후`, urgent: false };
  }
};

export const MeetingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const {
    setMeetingDetail,
    homeData,
    setHomeData,
  } = useHomeStore();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [_showMissionModal, _setShowMissionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<MeetingDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAlreadyLikedModal, setShowAlreadyLikedModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // 커스텀 알림 상태
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // 출석체크 관련 상태
  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatusResponse | null>(null);
  const [myAttendance, setMyAttendance] = useState<MyAttendanceResponse | null>(
    null
  );
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrCodeToken, setQRCodeToken] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // 미션 상세페이지에서 온 경우 연결된 미션 섹션을 숨김
  const hideFromMissionDetail = searchParams.get("from") === "mission";

  // 현재 사용자 ID
  const currentUserId = user?.id;

  // 커스텀 알림 헬퍼 함수
  const showAlert = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
    onClose?: () => void
  ) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
      onClose,
    });
  };

  const closeAlert = () => {
    const callback = alertModal.onClose;
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
    // 모달이 닫힌 후 콜백 실행
    if (callback) {
      setTimeout(callback, 100);
    }
  };

  // MeetingDetailDto를 MyMeetingDetail 형태로 변환
  const convertToMyMeetingDetail = useCallback((data: MeetingDetailDto): MeetingDetailDto => {
    // currentUserId가 없으면 기본값 사용
    if (!currentUserId) {
      console.log("⚠️ currentUserId가 없어서 기본값으로 변환");
      return {
        id: data.id,
        title: data.mission?.title || "모임",
        description: data.mission?.description,
        scheduledAt: data.scheduledAt,
        recruitUntil: data.recruitUntil,
        status: data.status,
        maxParticipants: data.mission?.participants || 0,
        currentParticipants: data.currentParticipants || 0,
        isHost: false,
        meJoined: false,
        mission: data.mission,
        hostUserId: data.hostUserId,
        host: data.host,
        participants: data.participantList || [],
      };
    }

    const isHost = data.hostUserId === currentUserId;
    const isInParticipantList = data.participantList?.some(
      (p) => p.userId === currentUserId
    );
    const meJoined = isInParticipantList || isHost;

    console.log("🔍 convertToMyMeetingDetail 디버깅:", {
      meetingId: data.id,
      currentUserId,
      hostUserId: data.hostUserId,
      isHost,
      participantListCount: data.participantList?.length || 0,
      participantUserIds: data.participantList?.map((p) => p.userId) || [],
      isInParticipantList,
      meJoined,
      isUserInParticipantList: data.participantList?.some(
        (p) => p.userId === currentUserId
      ),
      isUserHost: data.hostUserId === currentUserId,
    });

    return {
      id: data.id,
      title: data.mission?.title || "모임",
      description: data.mission?.description,
      scheduledAt: data.scheduledAt,
      recruitUntil: data.recruitUntil,
      status: data.status,
      maxParticipants: data.maxParticipants || 0,
      currentParticipants: data.currentParticipants || 0,
      isHost,
      meJoined,
      mission: data.mission,
      hostUserId: data.hostUserId,
      host: data.host,
      participants: data.participantList || [],
    };
  }, [currentUserId]);

  // 출석 데이터 가져오기
  const fetchAttendanceData = async (meetingId: string) => {
    try {
      const [statusData, myData] = await Promise.all([
        attendanceApiService.getAttendanceStatus(meetingId),
        attendanceApiService.getMyAttendance(meetingId),
      ]);
      setAttendanceStatus(statusData);
      setMyAttendance(myData);
    } catch (error) {
      console.error("출석 데이터 가져오기 실패:", error);
    }
  };

  // 모임 데이터 가져오기 함수
  const fetchMeetingDetail = useCallback(async () => {
    if (!id) {
      setError("모임 ID가 없습니다.");
      setIsDataLoading(false);
      return;
    }

    try {
      setIsDataLoading(true);
      setError(null);
      console.log("🔍 API 호출 시작 - getMeetingDetail:", id);
      const data = await meetingApiService.getMeetingDetail(id);
      console.log("📋 API 응답 데이터:", {
        meetingId: data.id,
        participantList: data.participantList,
        currentParticipants: data.currentParticipants,
        hostUserId: data.hostUserId,
      });
      setMeetingData(data);
      // API 응답에서 현재 사용자의 좋아요 상태 설정
      setIsLiked(data.isLiked || false);

      // 홈 스토어 캐시 업데이트 (currentUserId가 있을 때만)
      let myMeetingDetail = null;
      if (currentUserId) {
        myMeetingDetail = convertToMyMeetingDetail(data);
        console.log("🔄 스토어 업데이트 - 변환된 데이터:", myMeetingDetail);
        setMeetingDetail(id, myMeetingDetail);
      } else {
        console.log("⏳ currentUserId가 없어서 스토어 업데이트 스킵");
      }

      // 홈 데이터의 myMeetings 배열도 업데이트
      if (homeData && currentUserId && myMeetingDetail) {
        console.log("🏠 홈 데이터 업데이트 시작:", {
          hasHomeData: !!homeData,
          currentUserId,
          meJoined: myMeetingDetail.meJoined,
          myMeetingsCount: Array.isArray(homeData.myMeetings)
            ? homeData.myMeetings.length
            : 0,
        });

        const updatedHomeData = { ...homeData };

        // myMeetings 배열에서 해당 모임을 찾아서 업데이트
        if (Array.isArray(updatedHomeData.myMeetings)) {
          const meetingIndex = updatedHomeData.myMeetings.findIndex(
            (m) => (m?.id || m?.meeting_id) === id
          );

          console.log("🔍 기존 모임 찾기 결과:", {
            meetingIndex,
            existingMeetingIds: updatedHomeData.myMeetings.map(
              (m) => m?.id || m?.meeting_id
            ),
            targetMeetingId: id,
          });

          if (meetingIndex >= 0) {
            // 기존 모임 데이터 업데이트
            updatedHomeData.myMeetings[meetingIndex] = {
              ...updatedHomeData.myMeetings[meetingIndex],
              ...data,
            };
            console.log("✅ 홈 데이터의 myMeetings 업데이트됨");
          } else if (myMeetingDetail.meJoined) {
            // 새로 참여한 모임이면 myMeetings에 추가
            updatedHomeData.myMeetings.push(data);
            console.log("✅ 홈 데이터의 myMeetings에 새 모임 추가됨");
          }

          // 만약 참여하지 않은 모임이 myMeetings에 있다면 제거
          if (!myMeetingDetail.meJoined && meetingIndex >= 0) {
            updatedHomeData.myMeetings.splice(meetingIndex, 1);
            console.log(
              "✅ 홈 데이터의 myMeetings에서 모임 제거됨 (인덱스:",
              meetingIndex,
              ")"
            );
          }
        } else if (myMeetingDetail.meJoined) {
          // myMeetings가 없으면 새로 생성
          updatedHomeData.myMeetings = [data];
          console.log("✅ 홈 데이터의 myMeetings 새로 생성됨");
        }

        console.log("🏠 홈 데이터 업데이트 완료:", {
          beforeCount: Array.isArray(homeData.myMeetings)
            ? homeData.myMeetings.length
            : 0,
          afterCount: Array.isArray(updatedHomeData.myMeetings)
            ? updatedHomeData.myMeetings.length
            : 0,
        });

        setHomeData(updatedHomeData);
      }

      console.log("✅ 스토어 업데이트 완료");

      // 출석 데이터 가져오기 (참가자만, currentUserId가 있을 때만)
      if (
        currentUserId &&
        (data.participantList?.some((p) => p.userId === currentUserId) ||
          data.hostUserId === currentUserId)
      ) {
        await fetchAttendanceData(id);
      }
    } catch (err) {
      console.error("모임 상세 조회 실패:", err);
      setError(
        err instanceof Error ? err.message : "모임 정보를 불러올 수 없습니다."
      );
    } finally {
      setIsDataLoading(false);
    }
  }, [id, currentUserId, convertToMyMeetingDetail, homeData, setHomeData, setMeetingDetail]);

  // API에서 모임 데이터 가져오기
  useEffect(() => {
    fetchMeetingDetail();
  }, [fetchMeetingDetail]);

  useEffect(() => {
    const onResize = () => setIsMobile(deviceDetection.isMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
      meetingData &&
      (meetingData.mission?.districtId || meetingData.mission?.location)
    ) {
      try {
        // 송파구 중심 좌표 (기본값)
        const songpaLat = 37.5145;
        const songpaLng = 127.1056;

        const mapOptions = {
          center: new window.naver.maps.LatLng(songpaLat, songpaLng),
          zoom: meetingData.mission?.location ? 16 : 14, // 상세 장소가 있으면 더 확대
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
        const markerTitle =
          meetingData.mission?.location ||
          (meetingData.mission?.district
            ? `${meetingData.mission.district.city} ${meetingData.mission.district.districtName}`
            : "송파구");

        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(songpaLat, songpaLng),
          map: map,
          title: markerTitle,
        });
      } catch (error) {
        console.error("네이버 지도 초기화 실패:", error);
      }
    }
  }, [mapLoaded, meetingData, isDark]);

  // 페이지 제목 및 헤더 타이틀 동적 설정
  useEffect(() => {
    if (meetingData?.mission?.title) {
      document.title = `${meetingData.mission.title} | 할사람?`;

      // 헤더 제목도 업데이트
      const headerElement = document.querySelector("[data-header-title]");
      if (headerElement) {
        headerElement.textContent = meetingData.mission.title;
      }
    } else if (meetingData) {
      document.title = "번개모임 | 할사람?";

      const headerElement = document.querySelector("[data-header-title]");
      if (headerElement) {
        headerElement.textContent = "번개모임";
      }
    }
  }, [meetingData]);

  // 로딩 상태
  if (isDataLoading) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div>모임 정보를 불러오는 중...</div>
        </div>
      </PageContainer>
    );
  }

  // 에러 상태
  if (error || !meetingData) {
    const from = searchParams.get("from");

    const handleGoBack = () => {
      if (from === "home") {
        navigate("/");
      } else if (from === "mission") {
        navigate(-1); // 미션 상세에서 온 경우 이전 페이지로
      } else {
        navigate("/meetings"); // 기본적으로 모임 리스트로
      }
    };

    return (
      <PageContainer $isMobile={isMobile}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ color: "#EF4444", marginBottom: "10px" }}>
            {error || "모임 정보를 찾을 수 없습니다."}
          </div>
          <button
            onClick={handleGoBack}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  // 날짜와 시간 파싱
  const meetingDateTime = new Date(meetingData.scheduledAt);
  const meetingDate = meetingDateTime.toISOString().split("T")[0];
  const meetingTime = meetingDateTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const timeRemaining = calculateTimeRemaining(meetingDate, meetingTime);
  const statusInfo = getStatusInfo(
    meetingData.status,
    meetingData.currentParticipants || 0,
    meetingData.mission?.participants || 0
  );

  const seatsLeft = Math.max(
    0,
    (meetingData.mission?.participants || 0) - (meetingData.currentParticipants || 0)
  );

  // 현재 사용자가 참여한 모임인지 확인
  const isParticipant = currentUserId
    ? meetingData.participantList?.some((p) => p.userId === currentUserId) ||
      false
    : false;

  // 현재 사용자가 호스트인지 확인
  const isHost = currentUserId
    ? meetingData.hostUserId === currentUserId
    : false;

  const handleJoin = async () => {
    console.log("참여하기 버튼 클릭됨", {
      isParticipant,
      isHost,
      meetingId: meetingData?.id,
    });

    if (!meetingData) {
      console.error("모임 데이터가 없습니다");
      return;
    }

    setIsLoading(true);

    try {
      if (isParticipant) {
        if (isHost) {
          // 호스트 - 모임 삭제 로직
          // 간단한 확인 대화상자 표시
          if (window.confirm("정말로 모임을 삭제하시겠습니까?\n\n⚠️ 삭제된 모임은 복구할 수 없습니다.\n📋 참여자들에게는 환불 정책에 따라 포인트가 처리됩니다.")) {
            try {
              await meetingApiService.deleteMeeting(meetingData.id);
              showAlert("success", "성공", "모임이 삭제되었습니다.");
              navigate("/meetings"); // 모임 목록으로 이동
            } catch (error) {
              console.error("모임 삭제 실패:", error);
              showAlert(
                "error",
                "오류",
                "서버 측에서 예상치 못한 문제가 발생하여 모임을 삭제할 수 없습니다. 잠시 후 다시 시도해주세요."
              );
            }
          }
        } else {
          // 일반 참여자 - 참여 취소 로직
          const now = new Date();
          const scheduledAt = new Date(meetingData.scheduledAt);
          const hoursUntilMeeting =
            (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

          // 포인트 처리 정책 메시지 생성
          let pointPolicyMessage = "";
          const paidAmount = meetingData.mission?.basePoints || 0;

          if (hoursUntilMeeting <= 0) {
            pointPolicyMessage = `⚠️ 모임이 이미 시작되어 노쇼 처리됩니다.\n환불은 없으며 ${paidAmount}P의 추가 패널티가 적용됩니다.`;
          } else if (hoursUntilMeeting > 6) {
            pointPolicyMessage = `✅ 6시간 전 취소로 ${paidAmount}P 전액 환불됩니다.`;
          } else {
            const refundAmount = Math.floor(paidAmount * 0.5);
            pointPolicyMessage = `⚠️ 6시간 이내 취소로 ${refundAmount}P만 환불됩니다.\n(50% 환불 정책)`;
          }

          // 간단한 확인 대화상자 표시
          if (window.confirm(`정말로 모임을 나가시겠습니까?\n\n${pointPolicyMessage}`)) {
            try {
              console.log("🚪 모임 나가기 API 호출 시작:", meetingData.id);
              await meetingApiService.leaveMeeting(meetingData.id);
              console.log("✅ 모임 나가기 API 성공");
              showAlert(
                "success",
                "성공",
                "모임에서 나갔습니다.",
                async () => {
                  // 알림 모달 닫힌 후 데이터 새로고침
                  console.log("🔄 모임 나가기 후 데이터 새로고침 시작");
                  await fetchMeetingDetail();
                  console.log("✅ 모임 나가기 후 데이터 새로고침 완료");
                }
              );
            } catch (error) {
              console.error("모임 나가기 실패:", error);
              showAlert(
                "error",
                "오류",
                "서버 측에서 예상치 못한 문제가 발생하여 모임을 나갈 수 없습니다. 잠시 후 다시 시도해주세요."
              );
            }
          }
        }
      } else {
        // 참여하기 로직 - 모달을 열거나 직접 참여
        console.log("참여하기 로직 실행");

        // 자리가 없는 경우 참여 불가
        if (seatsLeft <= 0) {
          showAlert("info", "알림", "모임이 가득 차서 참여할 수 없습니다.");
          return;
        }

        // 포인트가 필요한 경우 모달 열기
        if (
          meetingData.mission?.basePoints &&
          meetingData.mission.basePoints > 0
        ) {
          console.log("포인트가 필요한 모임 - 모달 열기");
          setShowJoinModal(true);
        } else {
          // 무료 모임 직접 참여
          console.log("무료 모임 직접 참여");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          showAlert("success", "성공", "모임에 참여했습니다!", async () => {
            // 알림 모달 닫힌 후 데이터 새로고침
            await fetchMeetingDetail();
          });
        }
      }
    } catch (error) {
      console.error("참여/취소 처리 실패:", error);
      showAlert(
        "error",
        "오류",
        "서버 측에서 예상치 못한 문제가 발생하여 요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // QR 코드 생성 (호스트 전용)
  const handleGenerateQR = async () => {
    if (!meetingData?.id || !isHost) return;

    try {
      setIsGeneratingQR(true);
      const result = await attendanceApiService.generateQRCode(meetingData.id);
      setQRCodeToken(result.qrCodeToken);
      setShowQRGenerator(true);
      // 출석 상태 새로고침
      await fetchAttendanceData(meetingData.id);
    } catch (error) {
      console.error("QR 코드 생성 실패:", error);
      showAlert(
        "error",
        "오류",
        "서버 측에서 예상치 못한 문제가 발생하여 출석체크를 시작할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsGeneratingQR(false);
    }
  };

  // QR 코드 스캔 처리
  const handleQRScan = async (qrToken: string) => {
    if (!meetingData?.id) return;

    try {
      setIsCheckingIn(true);
      await attendanceApiService.checkIn(meetingData.id, qrToken);
      showAlert("success", "성공", "출석체크가 완료되었습니다!");
      setShowQRScanner(false);
      // 출석 상태 새로고침
      await fetchAttendanceData(meetingData.id);
    } catch (error) {
      console.error("출석체크 실패:", error);
      showAlert(
        "error",
        "오류",
        "서버 측에서 예상치 못한 문제가 발생하여 출석체크를 완료할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLiking || !meetingData) return;

    // 이미 좋아요를 눌렀다면 모달 표시
    if (isLiked) {
      setShowAlreadyLikedModal(true);
      return;
    }

    try {
      setIsLiking(true);
      const result = await meetingApiService.toggleLike(meetingData.id);

      setIsLiked(result.isLiked);

      // meetingData의 likesCount 업데이트
      setMeetingData((prev) =>
        prev ? { ...prev, likesCount: result.likesCount } : null
      );
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const getJoinButtonText = () => {
    if (isLoading) return "처리 중";
    if (meetingData.status !== "recruiting") return "지금은 참여할 수 없어요";
    if (isParticipant) {
      // 호스트인 경우 "모임 삭제하기", 일반 참여자인 경우 "참여 취소하기"
      return isHost ? "모임 삭제하기" : "모임 나가기";
    }
    if (!meetingData.canJoin) return "참여할 수 없습니다";
    if (seatsLeft <= 0) return "참여 불가 (모집완료)";
    return "참여하기";
  };

  const isJoinButtonDisabled = () => {
    // 로딩 중이거나 모집이 끝났거나, 참여할 수 없는 경우, 또는 남은 자리가 없는 경우
    return (
      isLoading ||
      meetingData.status !== "recruiting" ||
      (!isParticipant && !meetingData.canJoin) ||
      (!isParticipant && seatsLeft <= 0)
    );
  };

  return (
    <>
      <PageContainer $isMobile={isMobile}>
        {/* 노션 스타일 헤더 */}
        <ContentSection $isMobile={isMobile}>
          <StorySection $isMobile={isMobile} $isHeader={true}>
            {/* 모집 마감 시간 */}
            {timeRemaining.display !== "시작됨" && (
              <div style={{ marginBottom: "8px" }}>
                <CountdownBadge $urgent={timeRemaining.urgent}>
                  <Clock size={12} />
                  모집 마감까지 {timeRemaining.display}
                </CountdownBadge>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <StatusBadge
                $color={statusInfo.color}
                $bgColor={statusInfo.bgColor}
              >
                {statusInfo.text}
              </StatusBadge>
            </div>

            {/* 타이틀과 액션 버튼들 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <HeroTitle
                $isMobile={isMobile}
                style={{ margin: "0", color: "inherit", flex: 1 }}
              >
                {meetingData.mission?.title || "제목 없음"}
              </HeroTitle>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {/* 호스트 전용 수정 버튼 */}
                {isHost && (
                  <div
                    onClick={() => navigate(`/meetings/edit/${meetingData.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      padding: "6px 10px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.95)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <Edit3 size={14} color="#3B82F6" />
                    <span
                      style={{
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: "600",
                        color: "#3B82F6",
                      }}
                    >
                      수정
                    </span>
                  </div>
                )}

                {/* 좋아요 버튼 */}
                <div
                  onClick={handleLikeClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    backgroundColor: "rgba(255, 139, 85, 0.1)",
                    padding: "6px 10px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.95)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Heart
                    size={16}
                    fill={isLiked ? "#ff8b55" : "transparent"}
                    color="#ff8b55"
                  />
                  <span
                    style={{
                      fontSize: isMobile ? "14px" : "15px",
                      fontWeight: "600",
                      color: "#ff8b55",
                    }}
                  >
                    {meetingData.likesCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* 노션 스타일 정보 칩들 */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <InfoChip>
                <InfoIcon>
                  <Clock size={16} />
                </InfoIcon>
                {meetingDateTime.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}{" "}
                {meetingTime}
              </InfoChip>
              <InfoChip>
                <InfoIcon>
                  <Timer size={16} />
                </InfoIcon>
                {meetingData.mission?.estimatedDuration || 0}분
              </InfoChip>
              <InfoChip $highlight>
                <InfoIcon>
                  <DollarSign size={16} />
                </InfoIcon>
                +{meetingData.mission?.basePoints || 0}P
              </InfoChip>
            </div>
          </StorySection>

          {/* 미션 상세페이지에서 온 경우가 아닐 때만 연결된 미션 섹션 표시 */}
          {!hideFromMissionDetail && (
            <MissionCard $isMobile={isMobile}>
              <MissionHeader>
                <div>
                  <MissionTitle $isMobile={isMobile}>
                    🎯 연결된 미션
                  </MissionTitle>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: isMobile ? "15px" : "16px",
                      color: "#6B7280",
                      fontWeight: "600",
                    }}
                  >
                    {meetingData.mission?.title || "미션 제목 없음"}
                  </p>
                </div>
              </MissionHeader>
              <MissionBody>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    color: "#6B7280",
                    lineHeight: "1.5",
                    fontSize: isMobile ? "13px" : "14px",
                  }}
                >
                  {meetingData.mission?.description || "미션 설명 없음"}
                </p>
                <ViewMissionBtn
                  onClick={() =>
                    navigate(
                      `/missions/${meetingData.mission?.id}?from=meeting`
                    )
                  }
                  $isMobile={isMobile}
                >
                  미션 상세보기 <ChevronRight size={16} />
                </ViewMissionBtn>
              </MissionBody>
            </MissionCard>
          )}

          <StorySection $isMobile={isMobile}>
            <SectionTitle $isMobile={isMobile}>이런 모임이에요</SectionTitle>
            <Description $isMobile={isMobile}>
              {meetingData.mission?.description || "모임 설명이 없습니다."}
            </Description>

            {/* 미션 해시태그 표시 */}
            {meetingData.mission?.hashtags &&
              meetingData.mission.hashtags.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {meetingData.mission.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#F3F4F6",
                        color: "#6B7280",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: "500",
                      }}
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}

            <HostCard
              $isMobile={isMobile}
              onClick={() =>
                meetingData.host?.userId &&
                navigate(`/user/${meetingData.host.userId}`)
              }
              style={{
                cursor: meetingData.host?.userId ? "pointer" : "default",
              }}
            >
              <HostAvatar $isMobile={isMobile}>
                {meetingData.host?.profileImageUrl ? (
                  <img
                    src={meetingData.host.profileImageUrl}
                    alt={meetingData.host.nickname}
                  />
                ) : (
                  <Crown size={isMobile ? 18 : 20} />
                )}
              </HostAvatar>
              <HostInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "4px",
                  }}
                >
                  <HostName $isMobile={isMobile}>
                    {meetingData.host?.nickname || "호스트"}
                  </HostName>
                  <Crown size={isMobile ? 12 : 14} color="#F59E0B" />
                  <HostLevel $isMobile={isMobile}>
                    {formatLevel(
                      meetingData.host?.level,
                      meetingData.host?.points
                    ).toUpperCase()}
                  </HostLevel>
                </div>
                {meetingData.participantList?.find((p) => p.isHost)?.bio && (
                  <div
                    style={{
                      fontSize: isMobile ? "12px" : "13px",
                      color: "#6B7280",
                      lineHeight: "1.4",
                    }}
                  >
                    {meetingData.participantList?.find((p) => p.isHost)?.bio}
                  </div>
                )}
              </HostInfo>
            </HostCard>
          </StorySection>

          <DetailsGrid $isMobile={isMobile}>
            {/* 미션 상세 정보 */}
            {meetingData.mission?.precautions &&
              meetingData.mission.precautions.length > 0 && (
                <DetailCard $isMobile={isMobile} $col={6}>
                  <DetailHeader>
                    <MapPin size={20} />
                    <span>주의사항</span>
                  </DetailHeader>
                  <DetailContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {meetingData.mission.precautions.map(
                        (precaution, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "8px",
                              fontSize: isMobile ? "13px" : "14px",
                              color: "#6B7280",
                              lineHeight: "1.4",
                            }}
                          >
                            <span
                              style={{
                                color: "#F59E0B",
                                fontWeight: "bold",
                                minWidth: "4px",
                              }}
                            >
                              •
                            </span>
                            <span>{precaution}</span>
                          </div>
                        )
                      )}
                    </div>
                  </DetailContent>
                </DetailCard>
              )}

            {/* 이런 분과 함께하고 싶어요 - API에서 제공되지 않아 임시로 숨김 */}

            {/* 출석체크 현황 (진행 중인 모임이고 참가자인 경우만 표시) */}
            {meetingData.status === "active" &&
              (isParticipant || isHost) &&
              attendanceStatus && (
                <DetailCard $isMobile={isMobile} $col={6}>
                  <DetailHeader>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Users size={20} />
                        출석 현황 ({attendanceStatus.summary.checkedIn}/
                        {attendanceStatus.summary.total})
                      </span>

                      {/* 호스트 액션 버튼들 */}
                      {isHost && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          {attendanceStatus.canGenerateQR &&
                            !attendanceStatus.qrCodeActive && (
                              <button
                                onClick={handleGenerateQR}
                                disabled={isGeneratingQR}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "11px",
                                  backgroundColor: "#10B981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                {isGeneratingQR ? "생성 중..." : "QR 생성"}
                              </button>
                            )}

                          {attendanceStatus.qrCodeActive && (
                            <span
                              style={{
                                padding: "4px 8px",
                                fontSize: "11px",
                                backgroundColor: "#3B82F6",
                                color: "white",
                                borderRadius: "4px",
                              }}
                            >
                              QR 활성
                            </span>
                          )}
                        </div>
                      )}

                      {/* 참가자 출석 버튼 */}
                      {!isHost && myAttendance?.canCheckIn && (
                        <button
                          onClick={() => setShowQRScanner(true)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "11px",
                            backgroundColor: "#10B981",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          출석체크
                        </button>
                      )}
                    </div>
                  </DetailHeader>
                  <DetailContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {attendanceStatus.attendances.map((attendance) => (
                        <div
                          key={attendance.userId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 8px",
                            backgroundColor:
                              attendance.status === "checked_in"
                                ? "#F0FDF4"
                                : attendance.status === "no_show"
                                ? "#FEF2F2"
                                : "#F9FAFB",
                            borderRadius: "6px",
                            border: "1px solid",
                            borderColor:
                              attendance.status === "checked_in"
                                ? "#D1FAE5"
                                : attendance.status === "no_show"
                                ? "#FEE2E2"
                                : "#E5E7EB",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                fontSize: isMobile ? "13px" : "14px",
                              }}
                            >
                              {attendance.nickname}
                              {attendance.isHost && (
                                <Crown
                                  size={12}
                                  color="#F59E0B"
                                  style={{ marginLeft: "4px" }}
                                />
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                              backgroundColor:
                                attendance.status === "checked_in"
                                  ? "#10B981"
                                  : attendance.status === "no_show"
                                  ? "#EF4444"
                                  : "#6B7280",
                              color: "white",
                            }}
                          >
                            {attendance.status === "checked_in"
                              ? "출석"
                              : attendance.status === "no_show"
                              ? "노쇼"
                              : "대기"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 요약 정보 */}
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px",
                        backgroundColor: "#F3F4F6",
                        borderRadius: "6px",
                        fontSize: isMobile ? "12px" : "13px",
                        color: "#6B7280",
                      }}
                    >
                      출석: {attendanceStatus.summary.checkedIn}명 | 노쇼:{" "}
                      {attendanceStatus.summary.noShow}명 | 대기:{" "}
                      {attendanceStatus.summary.pending}명
                    </div>
                  </DetailContent>
                </DetailCard>
              )}

            {/* 현재 멤버 */}
            <DetailCard $isMobile={isMobile} $col={6}>
              <DetailHeader>
                <Users size={20} />
                <span>
                  현재 멤버 ({meetingData.currentParticipants || 0}/
                  {meetingData.mission?.participants || 0})
                </span>
              </DetailHeader>
              <DetailContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {meetingData.participantList &&
                  meetingData.participantList.length > 0 ? (
                    meetingData.participantList.map((participant) => (
                      <MemberItem key={participant.userId} $isMobile={isMobile}>
                        <MemberAvatar
                          $isMobile={isMobile}
                          onClick={
                            participant.userId &&
                            participant.userId !== currentUserId
                              ? () => navigate(`/user/${participant.userId}`)
                              : undefined
                          }
                          style={{
                            cursor:
                              participant.userId &&
                              participant.userId !== currentUserId
                                ? "pointer"
                                : "default",
                          }}
                        >
                          {participant.profileImageUrl ? (
                            <img
                              src={participant.profileImageUrl}
                              alt={participant.nickname}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <User size={isMobile ? 16 : 18} />
                          )}
                        </MemberAvatar>
                        <MemberInfo>
                          <MemberName $isMobile={isMobile}>
                            <span
                              onClick={
                                participant.userId &&
                                participant.userId !== currentUserId
                                  ? () =>
                                      navigate(`/user/${participant.userId}`)
                                  : undefined
                              }
                              style={{
                                color:
                                  participant.userId === currentUserId
                                    ? "#3B82F6"
                                    : "inherit",
                                cursor:
                                  participant.userId &&
                                  participant.userId !== currentUserId
                                    ? "pointer"
                                    : "default",
                              }}
                            >
                              {participant.nickname}
                            </span>
                            {participant.isHost && (
                              <HostBadge $isMobile={isMobile}>
                                <Crown size={12} />
                              </HostBadge>
                            )}
                            {participant.userId === currentUserId && (
                              <span
                                style={{
                                  fontSize: isMobile ? "10px" : "11px",
                                  color: "#3B82F6",
                                  fontWeight: "600",
                                  marginLeft: "6px",
                                  background: "rgba(59, 130, 246, 0.1)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                나
                              </span>
                            )}
                          </MemberName>
                          <MemberDetails $isMobile={isMobile}>
                            <MemberLevel>
                              {formatLevel(
                                participant.level,
                                participant.points
                              ).toUpperCase()}
                            </MemberLevel>
                            {participant.mbti && (
                              <MemberMBTI>{participant.mbti}</MemberMBTI>
                            )}
                          </MemberDetails>
                        </MemberInfo>
                      </MemberItem>
                    ))
                  ) : (
                    <div style={{ color: "#6B7280", fontSize: "14px" }}>
                      참여자가 없습니다.
                    </div>
                  )}
                </div>
              </DetailContent>
            </DetailCard>

            {/* 모임 시간 및 장소 : 전체 폭 */}
            <DetailCard $isMobile={isMobile} $col={12}>
              <DetailHeader>
                <MapPin size={20} />
                <span>모임 시간 및 장소</span>
              </DetailHeader>
              <DetailContent>
                {/* 시간 정보 */}
                <LocationInfo style={{ marginBottom: "16px" }}>
                  <LocationMain>
                    <div
                      style={{
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "2px",
                      }}
                    >
                      모임 시작 일시
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#6b7280",
                        marginBottom: "2px",
                      }}
                    >
                      {meetingDateTime.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}{" "}
                      {meetingTime}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      예상 소요시간:{" "}
                      {meetingData.mission?.estimatedDuration || 0}분
                    </div>
                  </LocationMain>
                </LocationInfo>

                {/* 장소 정보 */}
                <LocationInfo>
                  <LocationMain>
                    <div
                      style={{
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "2px",
                      }}
                    >
                      모임 장소
                    </div>
                    <LocationName>
                      {meetingData.mission?.location || "상세 장소 없음"}
                    </LocationName>
                    <LocationAddress>
                      {meetingData.mission?.district?.districtName &&
                      meetingData.mission?.district?.city
                        ? `${meetingData.mission.district.city} ${meetingData.mission.district.districtName}`
                        : "주소 정보 없음"}
                    </LocationAddress>
                  </LocationMain>
                </LocationInfo>

                {/* 미션 지역 정보가 있을 때만 지도 표시 */}
                {(meetingData.mission?.districtId ||
                  meetingData.mission?.location) && (
                  <>
                    <MapFrame ref={mapRef} $isMobile={isMobile} />

                    <button
                      onClick={() => {
                        const location =
                          meetingData.mission?.location ||
                          (meetingData.mission?.district
                            ? `${meetingData.mission.district.city} ${meetingData.mission.district.districtName}`
                            : "송파구");
                        const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
                          location
                        )}`;
                        window.open(naverMapUrl, "_blank");
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      네이버 지도에서 보기 <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </DetailContent>
            </DetailCard>
          </DetailsGrid>

          {/* 데스크톱에서만 보이는 하단 참여 버튼 */}
          {meetingData.status === "recruiting" && (
            <BottomActionSection $isMobile={isMobile}>
              <PrimaryAction
                onClick={handleJoin}
                disabled={isJoinButtonDisabled()}
                $isMobile={isMobile}
                $isCancel={isParticipant}
              >
                {getJoinButtonText()}
              </PrimaryAction>
            </BottomActionSection>
          )}
        </ContentSection>
      </PageContainer>

      {/* 모바일에서만 보이는 플로팅 버튼 */}
      {meetingData.status === "recruiting" && isMobile && (
        <FloatingActions $isMobile={isMobile}>
          <ActionContainer $isMobile={isMobile}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <PriceInfo $isMobile={isMobile}>
                +{meetingData.mission?.basePoints || 0}P 획득
              </PriceInfo>
              <SeatsInfo $warning={seatsLeft <= 2} $isMobile={isMobile}>
                {seatsLeft > 0 ? `${seatsLeft}자리 남음` : "대기 접수 가능"}
              </SeatsInfo>
            </div>
            <PrimaryAction
              onClick={handleJoin}
              disabled={isJoinButtonDisabled()}
              $isMobile={isMobile}
              $isCancel={isParticipant}
            >
              {getJoinButtonText()}
            </PrimaryAction>
          </ActionContainer>
        </FloatingActions>
      )}

      {/* 이미 좋아요를 눌렀을 때 표시되는 모달 */}
      <AlertModal
        isOpen={showAlreadyLikedModal}
        onClose={() => setShowAlreadyLikedModal(false)}
        type="info"
        title="좋아요 알림"
        message="이미 좋아요를 눌렀습니다."
        confirmText="확인"
      />

      {/* 커스텀 알림 모달 */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="확인"
      />

      {/* 모임 참여 모달 */}
      {meetingData && (
        <MeetingJoinModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          meetingData={{
            id: meetingData.id,
            title: meetingData.mission?.title || "모임",
            requiredPoints: meetingData.mission?.basePoints || 0,
            currentParticipants: meetingData.participantList?.length || 0,
            maxParticipants: meetingData.mission?.participants || 4,
            scheduledAt: (() => {
              console.log("모임 데이터 scheduledAt:", meetingData.scheduledAt);
              if (!meetingData.scheduledAt) return "날짜 정보 없음";
              if (typeof meetingData.scheduledAt === "string")
                return meetingData.scheduledAt;
              const scheduledAtObj = meetingData.scheduledAt as {
                date?: string;
                time?: string;
              };
              if (scheduledAtObj?.date && scheduledAtObj?.time) {
                return `${scheduledAtObj.date} ${scheduledAtObj.time}`;
              }
              return "날짜 정보 없음";
            })(),
            isHost: meetingData.hostUserId === currentUserId,
          }}
          onSuccess={async () => {
            // 참여 성공 후 데이터 새로고침
            await fetchMeetingDetail();
          }}
        />
      )}

      {/* QR 코드 생성 모달 (호스트용) */}
      {showQRGenerator && qrCodeToken && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowQRGenerator(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              출석체크 QR 코드
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                color: "#6B7280",
                fontSize: "14px",
              }}
            >
              참가자들이 이 QR 코드를 스캔하여 출석체크할 수 있습니다. (30분
              유효)
            </p>

            <QRCodeGenerator value={qrCodeToken} size={200} />

            <button
              onClick={() => setShowQRGenerator(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* QR 코드 스캐너 모달 (참가자용) */}
      {showQRScanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "white",
              }}
            >
              QR 코드를 스캔해주세요
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                color: "#D1D5DB",
                fontSize: "14px",
              }}
            >
              호스트가 제공한 QR 코드를 카메라에 비춰주세요
            </p>

            <QRCodeScanner
              isActive={showQRScanner}
              onScan={handleQRScan}
              onClose={() => setShowQRScanner(false)}
            />

            {isCheckingIn && (
              <div
                style={{
                  marginTop: "16px",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                출석체크 처리 중...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
