import { create } from "zustand";
import { devtools } from "zustand/middleware";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HomeData {
  myMeetings?: any[];
  meetings?: any[];
  hotMeetings?: any[];
  activityLogs?: any[];
  currentUser?: { id: string } | null;
  user?: { id: string } | null;
  me?: { id: string } | null;

  recentMeetings?: MyMeetingDetail[];
  upcomingMeetings?: MyMeetingDetail[];
  statistics?: {
    totalMeetings: number;
    completedMissions: number;
    totalPoints: number;
  };
  [key: string]: unknown;
}

export interface MyMeetingDetail {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string; // ISO
  recruitUntil?: string; // ISO
  status: "recruiting" | "ready" | "active" | "completed";
  maxParticipants: number;
  currentParticipants: number; // 표준 필드
  participantCount?: number;
  isHost?: boolean; // 내가 호스트인지
  meJoined?: boolean; // 내가 참가자인지

  mission?: {
    title?: string;
    location?: string;
    precautions?: string[];
    basePoints?: number;
    difficulty?: string;
    thumbnailUrl?: string;
  };

  region?: {
    districtName: string;
    city: string;
  };

  hostUserId?: string; // 호스트 판정용
  host?: {
    id?: string;
    nickname: string;
    level: number;
    mbti?: string;
    profileImageUrl?: string;
    bio?: string;
  };

  participants: Array<{
    id?: string; // 서버가 id 또는 userId로 줄 수 있음
    userId?: string;
    nickname?: string;
    profileImageUrl?: string;
    level?: number;
    mbti?: string;
    isHost?: boolean;
  }>;

  chatRoomId?: string;
}

interface MeetingDetailCache {
  data: MyMeetingDetail;
  timestamp: number;
}

interface HomeStore {
  // 홈 데이터 캐시
  homeData: HomeData | null;
  homeDataTimestamp: number | null;

  // 모임 상세 정보 캐시
  meetingDetailsCache: Map<string, MeetingDetailCache>;

  // 로딩 상태
  isLoadingHome: boolean;
  loadingMeetingIds: Set<string>;

  // 에러 상태
  homeError: string | null;
  meetingErrors: Map<string, string>;

  // 캐시 유효 시간 (5분)
  CACHE_DURATION: number;

  // Actions
  setHomeData: (data: HomeData) => void;

  setMeetingDetail: (meetingId: string, data: MyMeetingDetail) => void;
  getMeetingDetail: (meetingId: string) => MyMeetingDetail | null;

  isDataFresh: () => boolean;
  clearCache: () => void;
  setLoadingMeetingId: (meetingId: string, isLoading: boolean) => void;
  setMeetingError: (meetingId: string, error: string | null) => void;

  // 통합 "내 모임" 셀렉터 (meJoined/host/status 재구성)
  getUnifiedMyMeetings: (myId?: string) => MyMeetingDetail[];
}

/** =========================
 *   Local Utilities (Pure)
 *  ========================= */

// 상태 문자열 정규화
const normalizeStatus = (s?: string): MyMeetingDetail["status"] => {
  if (!s) return "recruiting";
  const x = String(s).toLowerCase();
  if (x === "recruiting") return "recruiting";
  if (x === "ready") return "ready";
  if (x === "active") return "active";
  if (x === "completed") return "completed";
  // 너그럽게 매핑
  if (x.includes("recruit")) return "recruiting";
  if (x.includes("ready")) return "ready";
  if (x.includes("active")) return "active";
  if (x.includes("complete") || x.includes("done") || x.includes("finish"))
    return "completed";
  return "recruiting";
};

// 시간 기반 상태 보정(백엔드 상태가 이상하거나 누락일 때)
const classifyStatusByTime = (
  scheduledAt?: string,
  recruitUntil?: string
): MyMeetingDetail["status"] => {
  if (!scheduledAt && !recruitUntil) return "recruiting";

  const now = Date.now();
  const sch = scheduledAt ? Date.parse(scheduledAt) : undefined;
  const rec = recruitUntil ? Date.parse(recruitUntil) : undefined;

  // 규칙:
  // now < recruitUntil         -> recruiting
  // recruitUntil <= now < sch  -> ready
  // sch <= now < sch + 12h     -> active
  // now >= sch + 12h           -> completed
  if (rec !== undefined && now < rec) return "recruiting";
  if (sch !== undefined && now < sch) return "ready";
  if (sch !== undefined) {
    const activeWindowEnd = sch + 12 * 60 * 60 * 1000;
    if (now < activeWindowEnd) return "active";
    return "completed";
  }
  // recruitUntil만 있을 때
  return now < (rec ?? 0) ? "recruiting" : "ready";
};

const extractParticipants = (m: any): any[] =>
  m?.participants ?? m?.participantList ?? m?.participants_list ?? [];

// 서버가 주는 다양한 조인 플래그를 우선 사용
const joinedFlagFromServer = (m: any): boolean | undefined => {
  const candidates = [
    m?.isJoined,
    m?.meJoined,
    m?.joined,
    m?.meIsParticipant,
    m?.me_is_participant,
    m?.iJoined,
  ];
  const hit = candidates.find((v) => v !== undefined);
  return hit === undefined ? undefined : !!hit;
};

const isMeInParticipants = (m: any, myId?: string): boolean => {
  if (!myId) return false;
  const ps = extractParticipants(m);
  return (
    Array.isArray(ps) && ps.some((p) => p?.userId === myId || p?.id === myId)
  );
};

const computeHostFlag = (m: any, myId?: string): boolean | undefined => {
  // 서버가 준 isHost가 있으면 그대로
  if (m?.isHost !== undefined) return !!m.isHost;

  // hostUserId와 내 id 비교
  if (myId && m?.hostUserId && String(m.hostUserId) === String(myId))
    return true;

  // participants에서 내 항목이 isHost인지
  if (myId) {
    const ps = extractParticipants(m);
    const mine = Array.isArray(ps)
      ? ps.find((p) => p?.userId === myId || p?.id === myId)
      : undefined;
    if (mine && mine.isHost !== undefined) return !!mine.isHost;
  }

  return undefined; // 모르면 undefined
};

const coalesceNumber = (...vals: Array<number | undefined | null>) => {
  for (const v of vals) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return undefined;
};

/** =========================
 *         Store
 *  ========================= */
export const useHomeStore = create<HomeStore>()(
  devtools(
    (set, get) => {
      let _lastMyIdForUnifiedMeetings: string | undefined | null = null;
      let _lastUnifiedMyMeetings: MyMeetingDetail[] = [];
      let _lastHomeDataTimestampForUnifiedMeetings: number | null = null;

      return {
        // 초기 상태
        homeData: null,
        homeDataTimestamp: null,
        meetingDetailsCache: new Map(),
        isLoadingHome: false,
        loadingMeetingIds: new Set(),
        homeError: null,
        meetingErrors: new Map(),
        CACHE_DURATION: 5 * 60 * 1000, // 5분

        // 홈 데이터 설정
        setHomeData: (data) =>
          set(() => ({
            homeData: data,
            homeDataTimestamp: Date.now(),
            homeError: null,
          })),

        // 모임 상세 정보 설정
        setMeetingDetail: (meetingId, data) =>
          set((state) => {
            const newCache = new Map(state.meetingDetailsCache);
            newCache.set(meetingId, { data, timestamp: Date.now() });

            const newLoadingIds = new Set(state.loadingMeetingIds);
            newLoadingIds.delete(meetingId);

            const newErrors = new Map(state.meetingErrors);
            newErrors.delete(meetingId);

            return {
              meetingDetailsCache: newCache,
              loadingMeetingIds: newLoadingIds,
              meetingErrors: newErrors,
            };
          }),

        // 특정 모임 상세 정보 가져오기
        getMeetingDetail: (meetingId) => {
          const state = get();
          const cached = state.meetingDetailsCache.get(meetingId);
          if (!cached) return null;
          if (Date.now() - cached.timestamp > state.CACHE_DURATION) return null;
          return cached.data;
        },

        // 데이터가 신선한지 확인
        isDataFresh: () => {
          const state = get();
          if (!state.homeDataTimestamp) return false;
          return Date.now() - state.homeDataTimestamp < state.CACHE_DURATION;
        },

        // 로딩 상태 설정
        setLoadingMeetingId: (meetingId, isLoading) =>
          set((state) => {
            const newLoadingIds = new Set(state.loadingMeetingIds);
            if (isLoading) newLoadingIds.add(meetingId);
            else newLoadingIds.delete(meetingId);
            return { loadingMeetingIds: newLoadingIds };
          }),

        // 에러 설정
        setMeetingError: (meetingId, error) =>
          set((state) => {
            const newErrors = new Map(state.meetingErrors);
            if (error) newErrors.set(meetingId, error);
            else newErrors.delete(meetingId);
            return { meetingErrors: newErrors };
          }),

        // 캐시 클리어
        clearCache: () =>
          set({
            homeData: null,
            homeDataTimestamp: null,
            meetingDetailsCache: new Map(),
            isLoadingHome: false,
            loadingMeetingIds: new Set(),
            homeError: null,
            meetingErrors: new Map(),
          }),

        /** =========================
         *   통합 "내 모임" 셀렉터
         *  =========================
         * - 서버가 주든 안 주든, 스토어가 내 모임을 일관되게 산출
         * - meJoined를 플래그/참가자/버킷출처로 재구성
         * - status 정규화 + 시간기반 보정
         */
        getUnifiedMyMeetings: (myId) => {
          const state = get();

          if (
            _lastMyIdForUnifiedMeetings === myId &&
            _lastHomeDataTimestampForUnifiedMeetings ===
              state.homeDataTimestamp &&
            _lastUnifiedMyMeetings
          ) {
            return _lastUnifiedMyMeetings;
          }

          const hd: any = state.homeData ?? {};

          // 서버에서 myMeetings로 직접 준 ID들을 기록(버킷 출처)
          const myBucketIds = new Set<string>(
            Array.isArray(hd.myMeetings)
              ? hd.myMeetings
                  .map((m: any) => m?.id ?? m?.meeting_id)
                  .filter((id: any) => !!id)
              : []
          );

          // 후보 소스 구성
          const bucketA: any[] = Array.isArray(hd.myMeetings)
            ? hd.myMeetings
            : [];
          const bucketB: any[] = Array.isArray(hd.meetings)
            ? hd.meetings.filter((m: any) => {
                // meetings 안에서 내가 참가자인 것만 추출
                // 1) 서버 플래그 우선
                const flag = joinedFlagFromServer(m);
                if (flag !== undefined) return flag;
                // 2) 참가자 배열로 판정
                if (isMeInParticipants(m, myId)) return true;
                return false;
              })
            : [];

          // 합치고 id 기준 dedupe
          const byId = new Map<string, any>();
          [...bucketA, ...bucketB].forEach((m: any) => {
            const id = m?.id ?? m?.meeting_id;
            if (!id) return;
            if (!byId.has(id)) byId.set(id, m);
          });

          // 정규화
          const unified: MyMeetingDetail[] = Array.from(byId.values()).map(
            (m: any) => {
              const id = m?.id ?? m?.meeting_id;
              const title = m?.title ?? m?.meeting_title ?? "모임";
              const scheduledAt: string =
                m?.scheduledAt ??
                m?.scheduled_at ??
                m?.startAt ??
                m?.start_at ??
                new Date().toISOString();

              const recruitUntil: string | undefined =
                m?.recruitUntil ?? m?.recruit_until ?? m?.deadline ?? undefined;

              // status: 서버 값 -> 정규화; 없거나 이상하면 시간기반 보정
              const rawStatus = m?.status;
              const normalized = normalizeStatus(rawStatus);
              const finalStatus = rawStatus
                ? normalized
                : classifyStatusByTime(scheduledAt, recruitUntil);

              // participants/카운트
              const participants = extractParticipants(m);
              const currentParticipants =
                coalesceNumber(
                  m?.currentParticipants,
                  m?.participantCount,
                  m?.participantsCount,
                  Array.isArray(participants) ? participants.length : undefined
                ) ?? 0;

              // meJoined 판정
              const serverFlag = joinedFlagFromServer(m);
              const joinedByList = isMeInParticipants(m, myId);
              const joinedByBucket = myBucketIds.has(id); // 서버가 myMeetings로 줬다면 사실상 내 모임

              const meJoined = ((): boolean => {
                if (serverFlag !== undefined) return serverFlag;
                if (joinedByList) return true;
                if (joinedByBucket) return true;
                return false;
              })();

              // isHost 판정
              const hostFlag =
                computeHostFlag(m, myId) ??
                // 버킷만으로는 호스트 여부 확정 못 하면 false (뱃지 정도만 영향)
                false;

              // mission 덩어리 정규화(필요 최소 필드)
              const mission = {
                title: m?.mission?.title ?? m?.mission_title,
                location: m?.mission?.location ?? m?.location,
                precautions: m?.mission?.precautions ?? m?.precautions,
                basePoints:
                  m?.mission?.basePoints ??
                  m?.basePoints ??
                  (typeof m?.mission_basePoints === "number"
                    ? m.mission_basePoints
                    : undefined),
                difficulty:
                  m?.mission?.difficulty ??
                  m?.difficulty ??
                  m?.mission_difficulty,
                thumbnailUrl:
                  m?.mission?.thumbnailUrl ??
                  m?.thumbnailUrl ??
                  m?.mission_thumbnailUrl,
              };

              return {
                id,
                title,
                scheduledAt,
                recruitUntil,
                status: finalStatus,
                maxParticipants:
                  m?.maxParticipants ??
                  m?.participants ??
                  m?.mission?.participants ??
                  0,
                currentParticipants,
                participantCount: currentParticipants, // UI 호환
                isHost: hostFlag,
                meJoined,

                mission,
                region:
                  m?.region ??
                  (m?.district
                    ? {
                        districtName: m.district?.districtName,
                        city: m.district?.city,
                      }
                    : undefined),

                hostUserId: m?.hostUserId ?? m?.host_user_id,
                host:
                  m?.host ??
                  (m?.host_profile
                    ? {
                        id: m?.host_user_id,
                        nickname: m?.host_profile?.nickname,
                        level: m?.host_profile?.level,
                        mbti: m?.host_profile?.mbti,
                        profileImageUrl: m?.host_profile?.profileImageUrl,
                        bio: m?.host_profile?.bio,
                      }
                    : undefined),

                participants: participants ?? [],
                chatRoomId: m?.chatRoomId ?? m?.chat_room_id,
              } as MyMeetingDetail;
            }
          );

          // 정렬(시작 시간 최신순 → UI에서 slice할 때 유리)
          unified.sort((a, b) => {
            const ta = Date.parse(a.scheduledAt || "0");
            const tb = Date.parse(b.scheduledAt || "0");
            return tb - ta;
          });

          _lastMyIdForUnifiedMeetings = myId;
          _lastUnifiedMyMeetings = unified;
          _lastHomeDataTimestampForUnifiedMeetings = state.homeDataTimestamp;

          return unified;
        },
      };
    },
    { name: "home-store" }
  )
);
