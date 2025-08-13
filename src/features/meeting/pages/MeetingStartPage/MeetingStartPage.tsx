import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import type { Meeting } from "../../../../types";
import * as S from "./MeetingStartPage.styles";

interface ParticipantStatus {
    id: string;
    nickname: string;
    profileImageUrl: string;
    status: "waiting" | "verified" | "completed";
}

const MeetingStartPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [participants, setParticipants] = useState<ParticipantStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // TODO: DB 연결 필요 - 실제 모임 데이터 가져오기
    const mockMeeting: Meeting = {
        id: "01HQXXX001",
        missionId: "mission1",
        hostUserId: "user1",
        status: "recruiting",
        recruitUntil: new Date(Date.now() + 86400000 * 2).toISOString(),
        scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentParticipants: 3,
        mission: {
            id: "mission1",
            title: "한강 러닝 크루 함께해요",
            description: "한강에서 함께 러닝하실 분들 모집합니다!",
            minParticipants: 2,
            maxParticipants: 8,
            estimatedDuration: 120,
            minimumDuration: 90,
            basePoints: 100,
            photoVerificationGuide: "러닝 전후 단체 사진, 한강 배경 인증샷",
            sampleImageUrls: [],
            categoryId: 1,
            difficulty: "easy",
            thumbnailUrl: "https://via.placeholder.com/800x450",
            precautions: ["운동화 필수", "물 준비", "날씨 확인 필수"],
            districtId: "11680",
            location: "반포한강공원 달빛광장",
            hashtags: ["러닝", "한강", "운동", "건강", "주말"],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category: { id: 1, name: "운동", slug: "sports", isActive: true },
            district: {
                id: "11680",
                regionCode: "11680",
                districtName: "강남구",
                city: "서울",
                isActive: true,
            },
        },
        host: {
            id: "user1",
            nickname: "러닝매니아",
            profileImageUrl: "https://via.placeholder.com/100",
            points: 1200,
            level: 3,
            bio: "매주 한강에서 러닝하고 있어요!",
        },
        participants: [
            {
                id: 1,
                meetingId: "01HQXXX001",
                userId: "user1",
                isHost: true,
                status: "joined",
                joinedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                user: {
                    id: "user1",
                    nickname: "러닝매니아",
                    profileImageUrl: "https://via.placeholder.com/100",
                    points: 1200,
                    level: 3,
                },
            },
            {
                id: 2,
                meetingId: "01HQXXX001",
                userId: "user2",
                isHost: false,
                status: "joined",
                joinedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                user: {
                    id: "user2",
                    nickname: "건강러",
                    profileImageUrl: "https://via.placeholder.com/100",
                    points: 800,
                    level: 2,
                },
            },
            {
                id: 3,
                meetingId: "01HQXXX001",
                userId: "user3",
                isHost: false,
                status: "joined",
                joinedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                user: {
                    id: "user3",
                    nickname: "초보러너",
                    profileImageUrl: "https://via.placeholder.com/100",
                    points: 200,
                    level: 1,
                },
            },
        ],
    };

    // 모임 참가자 데이터를 기반으로 참가자 상태 초기화
    const initializeParticipants = (meeting: Meeting): ParticipantStatus[] => {
        return meeting.participants?.map((participant) => ({
            id: participant.userId,
            nickname: participant.user?.nickname || "알 수 없음",
            profileImageUrl: participant.user?.profileImageUrl || "/default-avatar.png",
            status: participant.isHost ? "completed" : "waiting",
        })) || [];
    };

    useEffect(() => {
        const loadMeetingData = async () => {
            setIsLoading(true);
            try {
                // TODO: DB 연결 - 실제 API 호출로 교체
                await new Promise((resolve) => setTimeout(resolve, 500));
                setMeeting(mockMeeting);
                setParticipants(initializeParticipants(mockMeeting));

                // QR 코드 생성 - 실제로는 서버에서 토큰을 받아와야 함
                const qrData = JSON.stringify({
                    meetingId: id,
                    token: `meeting_${id}_${Date.now()}`, // TODO: 서버에서 생성된 토큰 사용
                    timestamp: Date.now(),
                });

                const qrUrl = await QRCode.toDataURL(qrData, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: "#1C1917",
                        light: "#FFFFFF",
                    },
                });
                setQrCodeUrl(qrUrl);
            } catch (error) {
                console.error("Failed to load meeting data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMeetingData();
    }, [id]);

    // TODO: WebSocket 연결 - 실시간 참가자 상태 업데이트
    useEffect(() => {
        // 목 데이터로 실시간 업데이트 시뮬레이션
        const interval = setInterval(() => {
            setParticipants((prev) =>
                prev.map((participant) => {
                    if (participant.status === "waiting" && Math.random() > 0.8) {
                        return { ...participant, status: "verified" };
                    }
                    if (participant.status === "verified" && Math.random() > 0.7) {
                        return { ...participant, status: "completed" };
                    }
                    return participant;
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleStartMission = () => {
        // TODO: 모임 상태를 'active'로 변경하는 API 호출
        console.log("Starting mission for meeting:", id);
        // 미션 진행 페이지로 이동하거나 다른 액션 수행
    };

    const getStatusText = (status: ParticipantStatus["status"]) => {
        switch (status) {
            case "waiting":
                return "대기중";
            case "verified":
                return "인증완료";
            case "completed":
                return "참가완료";
            default:
                return status;
        }
    };

    const getStatusColor = (status: ParticipantStatus["status"]) => {
        switch (status) {
            case "waiting":
                return "gray";
            case "verified":
                return "warning";
            case "completed":
                return "success";
            default:
                return "gray";
        }
    };

    const allParticipantsReady = participants.every(
        (p) => p.status === "completed"
    );

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingContainer>
                    <S.LoadingText>모임 정보를 불러오는 중...</S.LoadingText>
                </S.LoadingContainer>
            </S.Container>
        );
    }

    if (!meeting) {
        return (
            <S.Container>
                <S.ErrorContainer>
                    <S.ErrorText>모임을 찾을 수 없습니다.</S.ErrorText>
                </S.ErrorContainer>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.Header>
                <S.BackButton onClick={handleBack}>←</S.BackButton>
                <S.HeaderTitle>모임 시작</S.HeaderTitle>
            </S.Header>

            <S.Content>
                <S.MeetingInfo>
                    <S.MeetingTitle>{meeting.mission?.title}</S.MeetingTitle>
                    <S.MeetingLocation>
                        📍 {meeting.mission?.district?.districtName} · {meeting.mission?.location}
                    </S.MeetingLocation>
                </S.MeetingInfo>

                <S.NoticeSection>
                    <S.NoticeTitle>미션 인증 가이드</S.NoticeTitle>
                    <S.NoticeText>
                        사진 인증 시 GPS 정보가 포함되도록 위치 서비스를 켜주세요.
                        <br />
                        사진에 위치정보가 없다면 인증이 실패합니다.
                        <br />
                        참가자들은 호스트의 QR 코드를 스캔한 후 참가 인증을 완료해 주세요.
                        <br />
                        
                    </S.NoticeText>
                </S.NoticeSection>

                <S.PrecautionsSection>
                    <S.SectionTitle>⚠️ 모임 주의사항</S.SectionTitle>
                    <S.PrecautionList>
                        {meeting.mission?.precautions?.map((precaution, index) => (
                            <S.PrecautionItem key={index}>{precaution}</S.PrecautionItem>
                        ))}
                    </S.PrecautionList>
                </S.PrecautionsSection>

                <S.QRSection>
                    <S.SectionTitle>참가자 인증 QR 코드</S.SectionTitle>
                    <S.QRContainer>
                        {qrCodeUrl ? (
                            <S.QRImage src={qrCodeUrl} alt="참가자 인증 QR 코드" />
                        ) : (
                            <S.QRPlaceholder>QR 코드 생성 중...</S.QRPlaceholder>
                        )}
                    </S.QRContainer>
                    <S.QRDescription>
                        참가자들이 이 QR 코드를 스캔하면 출석 인증이 완료됩니다.
                    </S.QRDescription>
                </S.QRSection>

                <S.ParticipantsSection>
                    <S.SectionTitle>
                        👥 참가자 현황 ({participants.filter(p => p.status === "completed").length}/{participants.length})
                    </S.SectionTitle>
                    <S.ParticipantList>
                        {participants.map((participant) => (
                            <S.ParticipantItem key={participant.id}>
                                <S.ParticipantAvatar
                                    src={participant.profileImageUrl}
                                    alt={participant.nickname}
                                />
                                <S.ParticipantInfo>
                                    <S.ParticipantName>{participant.nickname}</S.ParticipantName>
                                    <S.ParticipantStatus $status={getStatusColor(participant.status)}>
                                        {getStatusText(participant.status)}
                                    </S.ParticipantStatus>
                                </S.ParticipantInfo>
                            </S.ParticipantItem>
                        ))}
                    </S.ParticipantList>
                </S.ParticipantsSection>

                <S.ActionSection>
                    {allParticipantsReady ? (
                        <S.StartButton onClick={handleStartMission}>
                            🚀 미션 시작하기
                        </S.StartButton>
                    ) : (
                        <S.WaitingButton disabled>
                            참가자 인증 대기 중... ({participants.filter(p => p.status === "completed").length}/{participants.length})
                        </S.WaitingButton>
                    )}
                </S.ActionSection>
            </S.Content>
        </S.Container>
    );
};

export default MeetingStartPage;