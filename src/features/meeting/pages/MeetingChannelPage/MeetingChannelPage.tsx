import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Clock,
  Lock,
  QrCode,
  ScanLine,
  Check,
  X,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { deviceDetection, formatLevel } from "../../../../shared/utils";
import { useHomeStore } from "../../../../shared/store/homeStore";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAlert } from "../../../../shared/components/common";
import { useTheme } from "../../../../shared/hooks/useTheme";
import { ThemeProvider } from "styled-components";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { attendanceApi } from "../../api";
import { QRTestHelper } from "../../components";
import { Chat } from "../../components/Chat";
import { SinglePhotoVerification } from "../../components/SinglePhotoVerification";
import { Skeleton } from "../../../../shared/components/ui";
import * as S from "./MeetingChannelPage.styles";

type ChannelTab = "info" | "chat" | "verification";

interface Participant {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  isHost: boolean;
  level?: number;
  mbti?: string;
}

interface MeetingDetail {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  status: string;
  currentParticipants: number;
  maxParticipants: number;
  participants: Participant[];
  host?: { id: string };
  mission?: {
    id?: string;
    location?: string;
    precautions?: string[];
  };
  region?: {
    districtName?: string;
    city?: string;
  };
  recruitUntil?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const MeetingChannelPage: React.FC = () => {
  const { id: meetingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [activeTab, setActiveTab] = useState<ChannelTab>("info");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [attendanceTimeLeft, setAttendanceTimeLeft] = useState<string>("");
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [attendedUserIds, setAttendedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [noShowUserIds, setNoShowUserIds] = useState<Set<string>>(new Set());
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showQRTestHelper, setShowQRTestHelper] = useState(false);
  const [_capturedImage, setCapturedImage] = useState<string | null>(null);
  const [meetingDetail, setMeetingDetail] = useState<MeetingDetail | null>(
    null
  );
  const [meetingLoading, setMeetingLoading] = useState(true);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getMeetingDetail } = useHomeStore();
  const { user } = useAuth();
  const { warning, info } = useAlert();
  const { isDark, currentTheme } = useTheme();

  // 홈 스토어에서 모임 정보 가져오기 (있으면 사용)
  const cachedMeetingDetail = getMeetingDetail(meetingId || "");

  // 사용자 노쇼 상태 확인 함수
  const checkUserNoShowStatus = useCallback(
    (meetingDetail: MeetingDetail, userId: string) => {
      const now = new Date().getTime();
      const scheduled = new Date(meetingDetail.scheduledAt).getTime();
      const attendanceWindowMs = import.meta.env.DEV
        ? 10 * 60 * 1000
        : 30 * 60 * 1000;
      const attendanceEndTime = scheduled + attendanceWindowMs;

      // 출석체크 시간이 지났고, 현재 사용자가 출석하지 않았으면 노쇼
      if (now > attendanceEndTime && !attendedUserIds.has(userId)) {
        const currentUser = meetingDetail.participants?.find(
          (p: Participant) => p.id === userId
        );
        if (currentUser && !currentUser.isHost) {
          warning(
            "출석체크를 완료하지 않아 노쇼 처리되었습니다. 모임 채널에 접근할 수 없습니다.",
            "접근 제한"
          );
          navigate(-1); // 이전 페이지로 돌아가기
        }
      }
    },
    [attendedUserIds, warning, navigate]
  );

  // 모임 정보 로드
  useEffect(() => {
    const loadMeetingDetail = async () => {
      if (!meetingId) {
        setMeetingError("모임 ID가 없습니다.");
        setMeetingLoading(false);
        return;
      }

      // 캐시된 데이터가 있으면 먼저 사용
      if (cachedMeetingDetail) {
        console.log("✅ 캐시된 모임 정보 사용:", cachedMeetingDetail);
        setMeetingDetail(cachedMeetingDetail as MeetingDetail);
        setMeetingLoading(false);
        return;
      }

      try {
        console.log("📡 모임 정보 API 호출 중...", meetingId);
        setMeetingLoading(true);
        setMeetingError(null);

        // homeApi를 사용해서 모임 상세 정보 가져오기
        const { homeApi } = await import("../../../home/api/homeApi");
        const response = await homeApi.getMyMeetingDetail(meetingId);

        console.log("✅ 모임 정보 로드 완료:", response.data);
        setMeetingDetail(response.data as MeetingDetail);

        // 현재 사용자가 노쇼인지 확인
        if (user?.id && response.data?.status === "active") {
          checkUserNoShowStatus(response.data, user.id);
        }
      } catch (error: unknown) {
        console.error("❌ 모임 정보 로드 실패:", error);
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "모임 정보를 불러올 수 없습니다.";
        setMeetingError(errorMessage);
      } finally {
        setMeetingLoading(false);
      }
    };

    loadMeetingDetail();
  }, [meetingId, cachedMeetingDetail, user?.id, checkUserNoShowStatus]); // user.id 추가

  // 지역 인증은 ResponsiveLayout에서 관리하므로 여기서는 제거

  // 출석 목록 조회 함수
  const fetchAttendanceList = useCallback(async () => {
    if (!meetingDetail?.id) return;

    try {
      const response = await attendanceApi.getAttendanceList(meetingDetail.id);
      const attendedIds = new Set(response.data.attendedUserIds || []);
      setAttendedUserIds(attendedIds);
    } catch (error) {
      console.error("출석 목록 조회 실패:", error);
    }
  }, [meetingDetail?.id]);

  // 출석 상태 확인
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      if (!meetingDetail?.id || !user?.id) return;

      try {
        const response = await attendanceApi.getMyAttendance(meetingDetail.id);
        const { status, canCheckIn } = response.data;

        if (status === "checked_in") {
          setAttendanceStatus("completed");
        }

        // 출석체크 불가능 시간에는 버튼 비활성화 상태 동기화
        if (!canCheckIn && !isAttendanceActive) {
          setIsAttendanceActive(false);
        }
      } catch (error) {
        console.error("출석 상태 확인 실패:", error);
        // 에러가 발생해도 UI는 정상 작동하도록 함
      }
    };

    if (meetingDetail?.status === "active") {
      checkAttendanceStatus();
      fetchAttendanceList();
    }
  }, [
    meetingDetail?.id,
    meetingDetail?.status,
    user?.id,
    isAttendanceActive,
    fetchAttendanceList,
  ]);

  // 개발 모드에서 QR 테스트 도구 토글 (Ctrl+Shift+Q)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "Q") {
        if (import.meta.env.DEV) {
          setShowQRTestHelper((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 틸-블루 테마 오버라이드 (이미지 색상 팔레트 기준)
  const tealTheme = {
    ...currentTheme,
    colors: {
      ...currentTheme?.colors,
      primary: "rgb(0, 171, 191)", // R:000 G:171 B:191 - 메인 틸 색상
      primaryHover: "rgb(0, 140, 160)", // 더 어두운 틸
      primaryLight: "rgb(153, 228, 237)", // R:153 G:228 B:237 - 밝은 틸
      success: "rgb(0, 171, 191)", // primary와 동일하게
      // 배경 색상들도 틸-블루 톤으로
      background: {
        primary: "rgb(240, 250, 252)", // 매우 연한 틸 배경
        secondary: "rgb(245, 252, 253)", // 조금 더 밝은 틸 배경
        tertiary: "rgb(235, 248, 250)", // 세 번째 틸 배경
      },
      surface: "#ffffff", // 카드 배경은 흰색 유지
      card: "rgb(220, 245, 248)", // 연한 틸 강조 배경
      // 보더와 회색톤들도 틸 계열로
      border: {
        light: "rgb(180, 235, 242)", // 연한 틸 보더
        primary: "rgb(180, 235, 242)", // 연한 틸 보더
      },
      divider: "rgb(153, 228, 237)", // 중간 틸 보더
      gray50: "rgb(248, 252, 253)", // 매우 연한 틸-그레이
      gray100: "rgb(235, 248, 250)", // 연한 틸-그레이
      gray200: "rgb(200, 240, 245)", // 중간 틸-그레이
      // 그라데이션도 틸-블루 계열로
      gradient: {
        primary:
          "linear-gradient(135deg, rgb(0, 171, 191) 0%, rgb(0, 140, 160) 100%)",
        primaryLight:
          "linear-gradient(135deg, rgb(153, 228, 237) 0%, rgb(0, 171, 191) 100%)",
        background:
          "linear-gradient(135deg, rgb(240, 250, 252) 0%, rgb(248, 252, 253) 100%)",
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 카운트다운 타이머
  useEffect(() => {
    if (meetingDetail?.status !== "ready") {
      setTimeLeft("");
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const scheduled = new Date(meetingDetail.scheduledAt).getTime();
      const difference = scheduled - now;

      if (difference <= 0) {
        setTimeLeft("활동 시작!");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [meetingDetail?.status, meetingDetail?.scheduledAt]);

  // 출석체크 가능 시간 타이머 (활동 시작 후 30분)
  useEffect(() => {
    if (meetingDetail?.status !== "active") {
      setAttendanceTimeLeft("");
      setIsAttendanceActive(false);
      return;
    }

    const calculateAttendanceTimeLeft = () => {
      const now = new Date().getTime();
      const scheduled = new Date(meetingDetail.scheduledAt).getTime();

      // TODO: 개발 환경 테스트용 10분 설정 - 나중에 1분 또는 적절한 시간으로 조정 필요
      const attendanceWindowMs = import.meta.env.DEV
        ? 10 * 60 * 1000
        : 30 * 60 * 1000;
      const attendanceEndTime = scheduled + attendanceWindowMs;
      const difference = attendanceEndTime - now;

      if (now < scheduled) {
        // 아직 시작 전
        console.log("❌ 아직 활동 시작 전");
        setAttendanceTimeLeft("");
        setIsAttendanceActive(false);
        return;
      }

      if (difference <= 0) {
        // 출석체크 시간이 지남 - 노쇼 처리
        console.log("⏰ 출석체크 시간 종료, 노쇼 사용자 처리");
        setAttendanceTimeLeft("시간 종료");
        setIsAttendanceActive(false);

        // 출석하지 않은 참가자들을 노쇼로 처리
        if (meetingDetail?.participants) {
          const noShowUsers = meetingDetail.participants
            .filter(
              (participant: Participant) =>
                !participant.isHost && // 호스트는 제외
                !attendedUserIds.has(participant.id) // 출석하지 않은 사용자
            )
            .map((participant: Participant) => participant.id);

          setNoShowUserIds(new Set(noShowUsers));
        }
        return;
      }

      setIsAttendanceActive(true);
      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setAttendanceTimeLeft(`${minutes}분 ${seconds}초`);
    };

    calculateAttendanceTimeLeft();
    const timer = setInterval(calculateAttendanceTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [
    meetingDetail?.status,
    meetingDetail?.scheduledAt,
    meetingDetail?.participants,
    attendedUserIds,
  ]);

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
    // 지역 정보가 있을 때만 지도 초기화 + info 탭에서만 초기화
    if (
      mapLoaded &&
      mapRef.current &&
      window.naver &&
      window.naver.maps &&
      meetingDetail &&
      meetingDetail.mission?.location &&
      activeTab === "info" // info 탭에서만 지도 초기화
    ) {
      try {
        // 기존 지도 인스턴스가 있으면 제거
        if (mapRef.current.children.length > 0) {
          mapRef.current.innerHTML = "";
        }

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

        // 약간의 지연을 두고 지도 초기화 (DOM이 완전히 렌더링된 후)
        setTimeout(() => {
          if (mapRef.current && activeTab === "info") {
            const map = new window.naver.maps.Map(mapRef.current, mapOptions);

            // 마커 추가
            const markerTitle = meetingDetail.mission?.location || "모임 장소";

            new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(songpaLat, songpaLng),
              map: map,
              title: markerTitle,
            });
          }
        }, 100);
      } catch (error) {
        console.error("네이버 지도 초기화 실패:", error);
      }
    }
  }, [mapLoaded, meetingDetail, isDark, activeTab]);

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
  const isHost = meetingDetail?.host?.id === currentUserId;

  // 모집 마감 시간 확인 (모집 마감 이후 = 활동 중)
  const isMeetingActive = () => {
    if (!meetingDetail?.recruitUntil) return false;
    const recruitUntilTime = new Date(meetingDetail.recruitUntil);
    const now = new Date();
    return now >= recruitUntilTime;
  };

  // 현재 사용자가 노쇼인지 확인
  const isCurrentUserNoShow = () => {
    return user?.id && noShowUserIds.has(user.id);
  };

  // 출석체크 핸들러
  const handleAttendanceClick = () => {
    if (!isAttendanceActive) {
      warning("출석체크 시간이 아닙니다.", "출석체크");
      return;
    }

    if (isHost) {
      handleGenerateQR();
    } else {
      handleScanQR();
    }
  };

  const generateQRCode = async () => {
    console.log("🎯 QR 코드 생성 시작");
    console.log("📍 meetingDetail:", meetingDetail?.id);

    if (!meetingDetail) {
      console.error("❌ meetingDetail이 없습니다");
      return;
    }

    setQrGenerating(true);

    try {
      // 백엔드 API에서 QR 토큰 생성
      console.log("📡 QR 토큰 생성 API 호출 중...");
      const response = await attendanceApi.generateQRCode(meetingDetail.id);
      console.log("✅ QR 토큰 생성 API 응답:", response);

      const token = response.data.qrCodeToken;
      console.log("🎫 생성된 토큰:", token);

      // QR 코드 생성 (토큰 앞에 식별자 추가)
      const qrData = `ATTENDANCE:${token}`;
      console.log("📋 QR 데이터:", qrData);

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000", // 검정색
          light: "#FFFFFF",
        },
      });

      console.log("✅ QR 코드 이미지 생성 완료");
      setQrCodeData(qrCodeDataUrl);

      // 호스트 자동 출석 처리 - 출석 상태 및 목록 업데이트
      if (user?.id) {
        setAttendanceStatus("completed");
        setAttendedUserIds((prev) => new Set([...prev, user.id]));

        // 출석자 목록 새로고침
        await fetchAttendanceList();
        console.log("✅ 호스트 자동 출석 처리 완료");
      }
    } catch (error: unknown) {
      console.error("❌ QR 코드 생성 실패:", error);
      const apiError = error as ApiError;
      console.error("❌ 에러 상세:", apiError.response?.data || apiError);
      const errorMessage =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "QR 코드 생성에 실패했습니다.";
      warning(errorMessage, "출석체크");
      setShowQRModal(false);
    } finally {
      setQrGenerating(false);
    }
  };

  const handleGenerateQR = async () => {
    setShowQRModal(true);
    await generateQRCode();
  };

  const handleRefreshQR = async () => {
    // 기존 QR 코드를 서서히 사라지게 하기
    setQrCodeData(null);

    // 약간의 지연으로 자연스러운 전환 효과
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 새로운 QR 코드 생성 (모달은 이미 열려있으므로 generateQRCode만 호출)
    await generateQRCode();
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setQrCodeData(null);
  };

  const handleScanQR = async () => {
    try {
      setShowCameraModal(true);
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // 후방 카메라 우선
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startQRScanning();
      }
    } catch (error) {
      console.error("카메라 접근 실패:", error);
      warning("카메라에 접근할 수 없습니다. 권한을 확인해주세요.", "출석체크");
      setShowCameraModal(false);
      setScanning(false);
    }
  };

  const startQRScanning = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          // QR 코드 감지됨
          handleQRCodeDetected(code.data);
          return;
        }
      }

      if (scanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    requestAnimationFrame(scanFrame);
  };

  const handleQRCodeDetected = async (qrData: string) => {
    console.log("🔍 QR 코드 감지됨:", qrData);
    console.log("📍 meetingDetail:", meetingDetail?.id);
    console.log("👤 user:", user?.id);

    if (!meetingDetail || !user?.id) {
      console.error("❌ meetingDetail 또는 user 정보가 없습니다");
      return;
    }

    try {
      // QR 데이터가 출석체크 형식인지 확인
      if (!qrData.startsWith("ATTENDANCE:")) {
        console.error("❌ 잘못된 QR 코드 형식:", qrData);
        warning("올바르지 않은 QR 코드입니다.", "출석체크");
        return;
      }

      // 토큰 추출 (ATTENDANCE: 접두사 제거)
      const token = qrData.replace("ATTENDANCE:", "");
      console.log("🎫 추출된 토큰:", token);

      // 백엔드 API로 출석체크 처리
      console.log("📡 출석체크 API 호출 중...");
      const response = await attendanceApi.checkIn(meetingDetail.id, token);
      console.log("✅ 출석체크 API 응답:", response);

      setAttendanceStatus("completed");

      // 출석한 사용자 목록에 현재 사용자 추가
      setAttendedUserIds((prev) => new Set([...prev, user.id]));

      info("출석체크가 완료되었습니다! 🎉", "출석체크");
      handleCloseCameraModal();
    } catch (error: unknown) {
      console.error("❌ 출석체크 실패:", error);
      const apiError = error as ApiError;
      console.error("❌ 에러 상세:", apiError.response?.data || apiError);
      const errorMessage =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "출석체크에 실패했습니다. 다시 시도해주세요.";
      warning(errorMessage, "출석체크");
    }
  };

  // 촬영 버튼 핸들러
  const handleCapturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // 캔버스에 현재 비디오 프레임 그리기
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캔버스에서 이미지 데이터 추출
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // QR 코드 인식 시도
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      console.log("📸 촬영된 이미지에서 QR 코드 감지:", code.data);
      handleQRCodeDetected(code.data);
    } else {
      // 촬영된 이미지를 데이터 URL로 저장 (디버깅용)
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);
      console.log("📸 촬영 완료, QR 코드 미감지");
      warning(
        "QR 코드를 찾을 수 없습니다. 카메라를 QR 코드에 더 가까이 대고 다시 시도해주세요.",
        "출석체크"
      );
    }
  };

  const handleCloseCameraModal = () => {
    setScanning(false);
    setShowCameraModal(false);
    setCapturedImage(null);

    // 카메라 스트림 중지
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab: ChannelTab) => {
    // no-show 사용자의 채팅 및 인증 기능 제한
    if ((tab === "chat" || tab === "verification") && isCurrentUserNoShow()) {
      warning(
        tab === "chat"
          ? "출석하지 않은 사용자는 채팅에 참여할 수 없습니다."
          : "출석하지 않은 사용자는 미션 인증을 할 수 없습니다.",
        "접근 제한"
      );
      return;
    }

    // READY 상태일 때 채팅과 인증 탭 접근 제한
    if (
      meetingDetail?.status === "ready" &&
      (tab === "chat" || tab === "verification")
    ) {
      info(
        tab === "chat"
          ? "활동이 시작되면 채팅을 사용할 수 있습니다."
          : "활동이 시작되면 인증 기능을 사용할 수 있습니다."
      );
      return;
    }

    // 기존 로직 유지: recruiting 상태에서도 제한
    if ((tab === "chat" || tab === "verification") && !isMeetingActive()) {
      warning(
        "채팅과 인증 기능은 모집 마감 이후에 이용할 수 있습니다.",
        "접근 제한"
      );
      return;
    }
    setActiveTab(tab);
  };

  const renderSkeletonContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <S.InfoContent $isMobile={isMobile}>
            {/* 출석체크 섹션 스켈레톤 */}
            <S.AttendanceSection $isMobile={isMobile}>
              <Skeleton width="80px" height="18px" marginBottom="16px" />
              <Skeleton
                width="100%"
                height="48px"
                borderRadius="8px"
                marginBottom="8px"
              />
              <Skeleton width="120px" height="14px" />
            </S.AttendanceSection>

            {/* 모임 기본 정보 스켈레톤 */}
            <S.Section>
              <Skeleton width="100px" height="18px" marginBottom="16px" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Skeleton width="20px" height="20px" />
                  <Skeleton width="150px" height="16px" />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Skeleton width="20px" height="20px" />
                  <Skeleton width="200px" height="16px" />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Skeleton width="20px" height="20px" />
                  <Skeleton width="100px" height="16px" />
                </div>
              </div>
            </S.Section>

            {/* 참가자 정보 스켈레톤 */}
            <S.Section>
              <Skeleton width="120px" height="18px" marginBottom="16px" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Skeleton width="40px" height="40px" borderRadius="50%" />
                      <div style={{ flex: 1 }}>
                        <Skeleton
                          width="80px"
                          height="16px"
                          marginBottom="4px"
                        />
                        <Skeleton width="60px" height="12px" />
                      </div>
                    </div>
                  ))}
              </div>
            </S.Section>

            {/* 지도 섹션 스켈레톤 */}
            <S.Section>
              <Skeleton width="60px" height="18px" marginBottom="16px" />
              <Skeleton
                width="100%"
                height="200px"
                borderRadius="8px"
                marginBottom="12px"
              />
              <Skeleton width="150px" height="40px" borderRadius="8px" />
            </S.Section>
          </S.InfoContent>
        );

      case "chat":
        return (
          <S.ChatContent $isMobile={isMobile}>
            {/* 채팅 헤더 스켈레톤 */}
            <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
              <Skeleton width="100px" height="18px" marginBottom="8px" />
              <Skeleton width="60px" height="14px" />
            </div>

            {/* 채팅 메시지 스켈레톤 */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                      justifyContent:
                        index % 2 === 0 ? "flex-start" : "flex-end",
                    }}
                  >
                    {index % 2 === 0 && (
                      <Skeleton width="32px" height="32px" borderRadius="50%" />
                    )}
                    <div style={{ maxWidth: "70%" }}>
                      {index % 2 === 0 && (
                        <Skeleton
                          width="60px"
                          height="12px"
                          marginBottom="4px"
                        />
                      )}
                      <Skeleton
                        width={
                          index % 3 === 0
                            ? "200px"
                            : index % 3 === 1
                            ? "120px"
                            : "160px"
                        }
                        height="36px"
                        borderRadius="12px"
                      />
                    </div>
                    {index % 2 === 1 && (
                      <Skeleton width="32px" height="32px" borderRadius="50%" />
                    )}
                  </div>
                ))}
            </div>

            {/* 채팅 입력창 스켈레톤 */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                gap: "8px",
              }}
            >
              <Skeleton width="100%" height="40px" borderRadius="20px" />
              <Skeleton width="40px" height="40px" borderRadius="50%" />
            </div>
          </S.ChatContent>
        );

      default:
        return (
          <S.LoadingContainer>
            <Skeleton width="200px" height="20px" />
          </S.LoadingContainer>
        );
    }
  };

  const renderTabContent = () => {
    if (meetingLoading) {
      return renderSkeletonContent();
    }

    if (meetingError) {
      return (
        <S.LoadingContainer>
          <div style={{ textAlign: "center" }}>
            <p>❌ {meetingError}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                background: "#00abbf",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </div>
        </S.LoadingContainer>
      );
    }

    if (!meetingDetail) {
      return (
        <S.LoadingContainer>모임 정보를 찾을 수 없습니다.</S.LoadingContainer>
      );
    }

    switch (activeTab) {
      case "info":
        return (
          <S.InfoContent $isMobile={isMobile}>
            {/* READY 상태일 때 카운트다운 표시 */}
            {meetingDetail.status === "ready" && timeLeft && (
              <S.CountdownBanner $isMobile={isMobile}>
                <Clock size={isMobile ? 20 : 24} />
                <S.CountdownText $isMobile={isMobile}>
                  활동 시작까지: <strong>{timeLeft}</strong>
                </S.CountdownText>
              </S.CountdownBanner>
            )}

            {/* ACTIVE 상태일 때 출석체크 섹션 표시 */}
            {meetingDetail.status === "active" && (
              <S.AttendanceSection $isMobile={isMobile}>
                <S.SectionTitle $isMobile={isMobile}>출석체크</S.SectionTitle>

                {attendanceStatus ? (
                  <S.AttendanceStatus $isMobile={isMobile}>
                    <Check size={isMobile ? 16 : 18} />
                    출석체크 완료
                  </S.AttendanceStatus>
                ) : (
                  <>
                    <S.AttendanceButton
                      $isMobile={isMobile}
                      $variant={isHost ? "host" : "participant"}
                      $disabled={!isAttendanceActive}
                      disabled={!isAttendanceActive}
                      onClick={handleAttendanceClick}
                    >
                      {!isAttendanceActive ? (
                        attendanceTimeLeft === "시간 종료" ? (
                          "출석체크 시간 종료"
                        ) : (
                          "출석체크 시간이 아닙니다"
                        )
                      ) : isHost ? (
                        <>
                          <QrCode size={isMobile ? 18 : 20} />
                          QR 코드 생성
                        </>
                      ) : (
                        <>
                          <ScanLine size={isMobile ? 18 : 20} />
                          출석체크하기
                        </>
                      )}
                    </S.AttendanceButton>

                    {isAttendanceActive && attendanceTimeLeft && (
                      <S.AttendanceTimer $isMobile={isMobile}>
                        <Clock size={isMobile ? 14 : 16} />
                        {attendanceTimeLeft}
                      </S.AttendanceTimer>
                    )}
                  </>
                )}
              </S.AttendanceSection>
            )}

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

            {/* 참가자 정보 */}
            <S.Section>
              <S.SectionTitle $isMobile={isMobile}>
                참가 현황 ({meetingDetail.currentParticipants}명)
              </S.SectionTitle>
              <S.ParticipantList $isMobile={isMobile}>
                {meetingDetail.participants.map(
                  (
                    participant: {
                      id: string;
                      nickname: string;
                      profileImageUrl?: string;
                      isHost: boolean;
                      level?: number;
                      mbti?: string;
                    },
                    index: number
                  ) => (
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
                        onClick={
                          participant.id !== user?.id
                            ? () => navigate(`/user/${participant.id}`)
                            : undefined
                        }
                        style={{
                          cursor:
                            participant.id !== user?.id ? "pointer" : "default",
                        }}
                      />
                      <S.ParticipantInfo>
                        <S.ParticipantName
                          $isMobile={isMobile}
                          onClick={
                            participant.id !== user?.id
                              ? () => navigate(`/user/${participant.id}`)
                              : undefined
                          }
                          style={{
                            cursor:
                              participant.id !== user?.id
                                ? "pointer"
                                : "default",
                          }}
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
                          {formatLevel(participant.level)}
                          {participant.mbti && ` · ${participant.mbti}`}
                        </S.ParticipantMeta>
                      </S.ParticipantInfo>

                      {/* 출석/노쇼 상태를 오른쪽에 표시 */}
                      {(meetingDetail.status === "active" ||
                        meetingDetail.status === "completed") && (
                        <div
                          style={{ marginLeft: "auto", alignSelf: "center" }}
                        >
                          {attendedUserIds.has(participant.id) ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#2563eb",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: "#2563eb15",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                border: "1px solid #2563eb30",
                              }}
                            >
                              <Check size={12} />
                              Joined
                            </span>
                          ) : noShowUserIds.has(participant.id) ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#dc2626",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: "#dc262615",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                border: "1px solid #dc262630",
                              }}
                            >
                              <XCircle size={12} />
                              No-Show
                            </span>
                          ) : null}
                        </div>
                      )}
                    </S.ParticipantItem>
                  )
                )}
              </S.ParticipantList>
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
          </S.InfoContent>
        );

      case "chat":
        return (
          <S.ChatContent $isMobile={isMobile}>
            {meetingDetail ? (
              <Chat
                meetingId={meetingDetail.id}
                isMobile={isMobile}
                meetingStatus={meetingDetail.status}
                totalParticipants={meetingDetail.currentParticipants}
                noShowUserIds={noShowUserIds}
                isCurrentUserNoShow={!!isCurrentUserNoShow()}
              />
            ) : (
              <S.ChatContent $isMobile={isMobile}>
                {/* 채팅 헤더 스켈레톤 */}
                <div
                  style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}
                >
                  <Skeleton width="100px" height="18px" marginBottom="8px" />
                  <Skeleton width="60px" height="14px" />
                </div>

                {/* 채팅 메시지 스켈레톤 */}
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "flex-start",
                          justifyContent:
                            index % 2 === 0 ? "flex-start" : "flex-end",
                        }}
                      >
                        {index % 2 === 0 && (
                          <Skeleton
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                          />
                        )}
                        <div style={{ maxWidth: "70%" }}>
                          {index % 2 === 0 && (
                            <Skeleton
                              width="60px"
                              height="12px"
                              marginBottom="4px"
                            />
                          )}
                          <Skeleton
                            width={
                              index % 3 === 0
                                ? "200px"
                                : index % 3 === 1
                                ? "120px"
                                : "160px"
                            }
                            height="36px"
                            borderRadius="12px"
                          />
                        </div>
                        {index % 2 === 1 && (
                          <Skeleton
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                          />
                        )}
                      </div>
                    ))}
                </div>

                {/* 채팅 입력창 스켈레톤 */}
                <div
                  style={{
                    padding: "16px",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <Skeleton width="100%" height="40px" borderRadius="20px" />
                  <Skeleton width="40px" height="40px" borderRadius="50%" />
                </div>
              </S.ChatContent>
            )}
          </S.ChatContent>
        );

      case "verification":
        // no-show 사용자는 인증 기능 접근 불가
        if (isCurrentUserNoShow()) {
          return (
            <S.VerificationContent $isMobile={isMobile}>
              <S.ComingSoon $isMobile={isMobile}>
                출석하지 않은 사용자는 미션 인증을 할 수 없습니다.
              </S.ComingSoon>
            </S.VerificationContent>
          );
        }
        return (
          <S.VerificationContent $isMobile={isMobile}>
            <SinglePhotoVerification
              meetingId={meetingId!}
              isMobile={isMobile}
            />
          </S.VerificationContent>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={tealTheme}>
      <S.PageContainer $isMobile={isMobile}>
        {/* 컨텐츠 영역 */}
        <S.ContentContainer
          $isMobile={isMobile}
          $noPadding={activeTab === "chat"}
        >
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
            $disabled={meetingDetail?.status === "ready"}
            onClick={() => handleTabClick("chat")}
          >
            {meetingDetail?.status === "ready" ? (
              <Lock size={isMobile ? 20 : 24} />
            ) : (
              <MessageCircle size={isMobile ? 20 : 24} />
            )}
            <S.TabLabel $isMobile={isMobile}>채팅</S.TabLabel>
          </S.TabButton>

          <S.TabButton
            $active={activeTab === "verification"}
            $isMobile={isMobile}
            $disabled={meetingDetail?.status === "ready"}
            onClick={() => handleTabClick("verification")}
          >
            {meetingDetail?.status === "ready" ? (
              <Lock size={isMobile ? 20 : 24} />
            ) : (
              <Camera size={isMobile ? 20 : 24} />
            )}
            <S.TabLabel $isMobile={isMobile}>인증</S.TabLabel>
          </S.TabButton>
        </S.BottomTabBar>

        {/* QR 코드 모달 */}
        <S.QRModal
          $show={showQRModal}
          onClick={(e) => e.target === e.currentTarget && handleCloseQRModal()}
        >
          <S.QRModalContent $isMobile={isMobile} $show={showQRModal}>
            <S.QRModalHeader>
              <S.QRModalTitle $isMobile={isMobile}>출석 QR 코드</S.QRModalTitle>
              <S.QRModalCloseButton onClick={handleCloseQRModal}>
                <X size={20} />
              </S.QRModalCloseButton>
            </S.QRModalHeader>

            <S.QRCodeContainer>
              {qrGenerating || !qrCodeData ? (
                <S.QRCodeSkeleton />
              ) : (
                <S.QRCodeImage
                  src={qrCodeData}
                  alt="출석체크 QR 코드"
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                />
              )}

              <S.QRCodeInfo $isMobile={isMobile}>
                <p>
                  참가자가 이 QR 코드를 스캔하여 <br />
                  출석체크를 할 수 있습니다.
                </p>

                <p>
                  <strong>남은 시간:</strong> {attendanceTimeLeft}
                </p>
              </S.QRCodeInfo>

              <S.QRButtonContainer>
                {!qrGenerating && qrCodeData && (
                  <S.QRRefreshButton
                    $isMobile={isMobile}
                    onClick={handleRefreshQR}
                  >
                    <RefreshCw size={16} />
                    새로운 QR 코드 생성
                  </S.QRRefreshButton>
                )}
              </S.QRButtonContainer>
            </S.QRCodeContainer>
          </S.QRModalContent>
        </S.QRModal>

        {/* 카메라 스캔 모달 */}
        <S.CameraModal
          $show={showCameraModal}
          onClick={(e) =>
            e.target === e.currentTarget && handleCloseCameraModal()
          }
        >
          <S.CameraContainer $isMobile={isMobile}>
            <S.CameraHeader $isMobile={isMobile}>
              <h3>출석체크 QR 스캔</h3>
              <S.CameraCloseButton onClick={handleCloseCameraModal}>
                <X size={20} />
              </S.CameraCloseButton>
            </S.CameraHeader>

            <S.CameraViewContainer>
              <S.CameraVideo ref={videoRef} autoPlay playsInline muted />
              <S.CameraCanvas ref={canvasRef} />

              {scanning && (
                <S.ScanningOverlay>
                  <S.ScanningFrame $isMobile={isMobile} />

                  {/* 상단 안내 문구 */}
                  <div
                    style={{
                      position: "absolute",
                      top: "5%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                      zIndex: 1001,
                      width: "100%",
                    }}
                  >
                    <S.ScanningText $isMobile={isMobile}>
                      QR 코드를 프레임 안에 맞춰주세요
                    </S.ScanningText>
                  </div>

                  {/* 하단 촬영 버튼 */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      justifyContent: "center",
                      zIndex: 1001,
                      pointerEvents: "auto",
                    }}
                  >
                    <button
                      onClick={handleCapturePhoto}
                      disabled={false}
                      style={{
                        width: isMobile ? "50px" : "60px",
                        height: isMobile ? "50px" : "60px",
                        borderRadius: "50%",
                        border: "2px solid white",
                        background: "#00abbf",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1px",
                        fontSize: isMobile ? "9px" : "11px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Camera size={isMobile ? 20 : 24} />
                      <span>촬영</span>
                    </button>
                  </div>
                </S.ScanningOverlay>
              )}
            </S.CameraViewContainer>

            <S.CameraInstructions $isMobile={isMobile}>
              <p>
                <strong>출석체크 방법:</strong>
              </p>
              <p>1. 호스트가 생성한 QR 코드를 화면에 보여주세요</p>
              <p>2. QR 코드가 프레임 안에 들어오도록 조정하세요</p>
              <p>
                3. 하단의 <strong>촬영</strong> 버튼을 눌러 QR 코드를 인식하세요
              </p>
            </S.CameraInstructions>
          </S.CameraContainer>
        </S.CameraModal>

        {/* 개발 모드 QR 테스트 도구 */}
        {import.meta.env.DEV && showQRTestHelper && (
          <QRTestHelper onClose={() => setShowQRTestHelper(false)} />
        )}
      </S.PageContainer>
    </ThemeProvider>
  );
};
