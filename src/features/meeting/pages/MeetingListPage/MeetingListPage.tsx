import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MeetingCard from "../../components/MeetingCard";
import MeetingCardSkeleton from "../../components/MeetingCardSkeleton";
import { WeekSelector } from "../../components/WeekSelector";
import { ResponsiveLayout } from "../../../../shared/layout/ResponsiveLayout";
import type { Meeting, MeetingListFilters } from "../../../../types";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import {
  meetingApiService,
  type GetMeetingsParams,
} from "../../../../shared/services";
import { MeetingMapper } from "../../../../shared/services/meetingMapper";
import * as S from "./MeetingListPage.styles";

const MeetingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 전체 일주일 데이터를 저장
  const [allWeekMeetings, setAllWeekMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());

  // 주간 범위
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);
  const [weekEndDate, setWeekEndDate] = useState<Date | null>(null);

  // 선택된 날짜 (URL 파라미터와 동기화)
  const selectedDateParam = searchParams.get("date");
  const selectedDate = useMemo(() => {
    if (!selectedDateParam) return null;

    // YYYY-MM-DD 형식의 문자열을 파싱
    const [year, month, day] = selectedDateParam.split("-").map(Number);
    if (year && month && day) {
      const date = new Date(year, month - 1, day); // month는 0-based
      // 유효한 날짜인지 확인
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return null;
  }, [selectedDateParam]);

  // 필터 상태
  const [filters, setFilters] = useState<MeetingListFilters>({
    status: "recruiting",
    sortBy: "newest", // 최신순을 기본값으로
  });

  // 추가 필터: 남은 자리가 있는 모임만
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // 정렬 역방향 상태
  const [isDescending, setIsDescending] = useState(false);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // URL에서 missionId 가져오기
  const missionIdFromUrl = searchParams.get("missionId");

  // 일주일 데이터 한번에 로드
  const loadWeekMeetings = useCallback(
    async (startDate: Date, endDate: Date, isPolling = false) => {
      // 폴링인 경우 isRefreshing 사용, 아니면 isLoading 사용
      if (isPolling) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        // YYYY-MM-DD 형식으로 날짜 포맷
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const apiParams: GetMeetingsParams = {
          weekStartDate: formatDate(startDate),
          weekEndDate: formatDate(endDate),
          missionId: missionIdFromUrl || undefined,
          size: 20, // 일주일치 데이터 가져오기 (최대 20개)
        };

        console.log(
          isPolling
            ? "🔄 자동 새로고침 중..."
            : "🔍 일주일 모임 데이터 로드 시작:",
          apiParams
        );

        const response = await meetingApiService.getMeetings(apiParams);
        const convertedMeetings = MeetingMapper.toMeetings(response.meetings);

        setAllWeekMeetings(convertedMeetings);
        setLastRefreshed(new Date());

        console.log("✅ 일주일 모임 데이터 로드 완료:", {
          total: convertedMeetings.length,
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
          isPolling,
        });
      } catch (error) {
        console.error("❌ Failed to load week meetings:", error);
        if (!isPolling) {
          setAllWeekMeetings([]);
        }
      } finally {
        if (isPolling) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [missionIdFromUrl]
  );

  // 클라이언트 사이드 필터링 및 정렬
  const filteredAndSortedMeetings = useMemo(() => {
    let filtered = [...allWeekMeetings];

    // 날짜 필터 (선택된 날짜가 있으면 해당 날짜만)
    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      filtered = filtered.filter((meeting) => {
        const meetingTime = new Date(meeting.scheduledAt).getTime();
        return (
          meetingTime >= startOfDay.getTime() &&
          meetingTime <= endOfDay.getTime()
        );
      });
    }

    // 상태 필터
    if (filters.status) {
      filtered = filtered.filter((m) => m.status === filters.status);
    }

    // 카테고리 필터
    if (filters.categoryId) {
      filtered = filtered.filter(
        (m) => m.mission?.categoryId === filters.categoryId
      );
    }

    // 난이도 필터
    if (filters.difficulty) {
      filtered = filtered.filter(
        (m) => m.mission?.difficulty === filters.difficulty
      );
    }

    // 지역구 필터
    if (filters.districtId) {
      filtered = filtered.filter(
        (m) => m.mission?.districtId === filters.districtId
      );
    }

    // 검색어 필터
    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.mission?.title.toLowerCase().includes(keyword) ||
          m.mission?.description.toLowerCase().includes(keyword) ||
          m.mission?.hashtags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }

    // 남은 자리가 있는 모임만 필터링
    if (showAvailableOnly) {
      filtered = filtered.filter((m) => {
        const maxParticipants = m.mission?.maxParticipants || 0;
        const currentParticipants = m.currentParticipants || 0;
        return currentParticipants < maxParticipants;
      });
    }

    // 정렬
    switch (filters.sortBy) {
      case "popular": // 인기순 (참여율)
        filtered.sort((a, b) => {
          const aRatio =
            (a.currentParticipants || 0) / (a.mission?.maxParticipants || 1);
          const bRatio =
            (b.currentParticipants || 0) / (b.mission?.maxParticipants || 1);
          const diff = bRatio - aRatio;
          return isDescending ? -diff : diff;
        });
        break;

      case "deadline": // 모집 시간순
        filtered.sort((a, b) => {
          const now = Date.now();
          const aDeadline = new Date(a.recruitUntil).getTime() - now;
          const bDeadline = new Date(b.recruitUntil).getTime() - now;
          // 양수만 비교 (이미 마감된 것 제외)
          if (aDeadline > 0 && bDeadline > 0) {
            const diff = aDeadline - bDeadline;
            return isDescending ? -diff : diff;
          }
          if (aDeadline > 0) return -1;
          if (bDeadline > 0) return 1;
          return 0;
        });
        break;

      case "newest": // 최신 등록순
        filtered.sort((a, b) => {
          const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return isDescending ? -diff : diff;
        });
        break;

      case "hostLevel": // 호스트 레벨순
        filtered.sort((a, b) => {
          const aLevel = a.host?.level?.value || 0;
          const bLevel = b.host?.level?.value || 0;
          const diff = bLevel - aLevel;
          return isDescending ? -diff : diff;
        });
        break;

      case "latest": // 활동 시간순
      default:
        filtered.sort((a, b) => {
          const diff = new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
          return isDescending ? -diff : diff;
        });
        break;
    }

    return filtered;
  }, [allWeekMeetings, selectedDate, filters, showAvailableOnly, isDescending]);

  // 페이지네이션 적용
  const paginatedMeetings = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedMeetings.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedMeetings, page]);

  const totalPages = Math.ceil(
    filteredAndSortedMeetings.length / ITEMS_PER_PAGE
  );

  // 주간 변경 핸들러
  const handleWeekChange = useCallback(
    (startDate: Date, endDate: Date) => {
      setWeekStartDate(startDate);
      setWeekEndDate(endDate);
      setPage(1);
      loadWeekMeetings(startDate, endDate);
    },
    [loadWeekMeetings]
  );

  // 날짜 선택 핸들러 (URL 업데이트)
  const handleDayChange = useCallback(
    (date: Date | null) => {
      setPage(1);
      if (date) {
        // YYYY-MM-DD 형식으로만 저장
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        searchParams.set("date", `${year}-${month}-${day}`);
      } else {
        searchParams.delete("date");
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  // 필터 변경 핸들러
  const handleFiltersChange = useCallback((newFilters: MeetingListFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 초기 로드
  useEffect(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    setWeekStartDate(weekStart);
    setWeekEndDate(weekEnd);

    // URL에 date 파라미터가 없으면 오늘 날짜로 설정
    if (!selectedDateParam) {
      const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("date", todayString);
      setSearchParams(newSearchParams, { replace: true });
    }

    loadWeekMeetings(weekStart, weekEnd);
  }, [loadWeekMeetings, selectedDateParam, searchParams, setSearchParams]);

  // 자동 API 폴링 (3분마다)
  useEffect(() => {
    // 현재 주간 날짜가 설정되어 있을 때만 폴링 시작
    if (!weekStartDate || !weekEndDate) return;

    // 3분(180초)마다 자동으로 새로운 모임 데이터 확인
    const POLLING_INTERVAL = 3 * 60 * 1000; // 3분

    const pollInterval = setInterval(() => {
      // console.log("자동 폴링: 새로운 모임 확인 중");
      loadWeekMeetings(weekStartDate, weekEndDate, true);
    }, POLLING_INTERVAL);

    // cleanup: 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      // console.log('자동 폴링 중지');
      clearInterval(pollInterval);
    };
  }, [weekStartDate, weekEndDate, loadWeekMeetings]);

  // 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateMeeting = () => {
    navigate("/meetings/create");
  };

  return (
    <ResponsiveLayout>
      <S.Container $isMobile={isMobile}>
        {/* 주간 선택기 */}
        <WeekSelector
          onWeekChange={handleWeekChange}
          onDayChange={handleDayChange}
          selectedDate={selectedDate}
        />


        {/* 추가 필터 옵션 */}
        <S.ExtraFilters $isMobile={isMobile}>
          <S.FilterOption>
            <input
              type="checkbox"
              id="availableOnly"
              checked={showAvailableOnly}
              onChange={(e) => {
                setShowAvailableOnly(e.target.checked);
                setPage(1);
              }}
            />
            <label htmlFor="availableOnly">참여 가능</label>
          </S.FilterOption>

          {/* 정렬 옵션 */}
          <S.SortOptions>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFiltersChange({
                  ...filters,
                  sortBy: e.target.value as MeetingListFilters["sortBy"],
                })
              }
            >
              <option value="newest">최신순</option>
              <option value="latest">시간순</option>
              <option value="deadline">모집순</option>
              <option value="popular">인기순</option>
              <option value="hostLevel">레벨순</option>
            </select>
            <S.SortDirectionButton
              onClick={() => setIsDescending(!isDescending)}
              $isDescending={isDescending}
            >
              ↕
            </S.SortDirectionButton>
          </S.SortOptions>
        </S.ExtraFilters>

        {missionIdFromUrl && (
          <S.FilterNotice $isMobile={isMobile}>
            🎯 특정 미션의 모임만 표시중입니다.
            <button onClick={() => navigate("/meetings")}>전체 보기</button>
          </S.FilterNotice>
        )}

        <S.ContentSection $isMobile={isMobile}>
          <S.Content>
            {/* 로딩 상태 */}
            {isLoading ? (
              <S.MeetingGrid>
                {Array.from({ length: 6 }).map((_, index) => (
                  <MeetingCardSkeleton key={`skeleton-${index}`} />
                ))}
              </S.MeetingGrid>
            ) : (
              <>
                {/* 결과 정보 */}
                {!isLoading && filteredAndSortedMeetings.length > 0 && (
                  <S.ResultInfo $isMobile={isMobile}>
                    {selectedDate && (
                      <span>{selectedDate.toLocaleDateString("ko-KR")} </span>
                    )}
                    총 {filteredAndSortedMeetings.length}개의 모임
                    {isRefreshing && (
                      <span style={{ marginLeft: "8px" }}>🔄</span>
                    )}
                    {lastRefreshed && !isRefreshing && (
                      <span
                        style={{
                          fontSize: "12px",
                          marginLeft: "8px",
                          opacity: 0.7,
                        }}
                      >
                        (마지막 업데이트:{" "}
                        {lastRefreshed.toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        )
                      </span>
                    )}
                  </S.ResultInfo>
                )}

                {/* 모임 그리드 */}
                <S.MeetingGrid>
                  {paginatedMeetings.length === 0 ? (
                    <S.EmptyState $isMobile={isMobile}>
                      <S.EmptyIcon $isMobile={isMobile}>🤔</S.EmptyIcon>
                      <S.EmptyTitle $isMobile={isMobile}>
                        모임을 찾을 수 없어요
                      </S.EmptyTitle>
                      <S.EmptyDescription $isMobile={isMobile}>
                        {selectedDate ? (
                          <>
                            선택한 날짜에 모임이 없어요
                            <br />
                            다른 날짜를 선택해보세요!
                          </>
                        ) : (
                          <>
                            직접 모임을 만들어보세요!
                            <br />
                            새로운 인연과 경험이 여러분을 기다리고 있어요
                          </>
                        )}
                      </S.EmptyDescription>
                      <S.CreateButton
                        $isMobile={isMobile}
                        onClick={handleCreateMeeting}
                      >
                        첫 모임 만들기
                      </S.CreateButton>
                    </S.EmptyState>
                  ) : (
                    paginatedMeetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))
                  )}
                </S.MeetingGrid>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <S.PaginationContainer $isMobile={isMobile}>
                    <S.PaginationButton
                      $isMobile={isMobile}
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      이전
                    </S.PaginationButton>

                    <S.PageNumbers>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <S.PageNumber
                            key={pageNum}
                            $active={pageNum === page}
                            $isMobile={isMobile}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </S.PageNumber>
                        )
                      )}
                    </S.PageNumbers>

                    <S.PaginationButton
                      $isMobile={isMobile}
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      다음
                    </S.PaginationButton>
                  </S.PaginationContainer>
                )}
              </>
            )}
          </S.Content>
        </S.ContentSection>

        <S.FloatingActionButton
          $isMobile={isMobile}
          onClick={handleCreateMeeting}
        >
          +
        </S.FloatingActionButton>
      </S.Container>
    </ResponsiveLayout>
  );
};

export default MeetingListPage;
