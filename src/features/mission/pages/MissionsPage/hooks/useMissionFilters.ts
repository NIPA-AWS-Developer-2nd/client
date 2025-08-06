import React from "react";
import { useSearchParams } from "react-router-dom";

export const useMissionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialFilter = (key: string, defaultValue: string) => {
    return searchParams.get(key) || defaultValue;
  };

  const [activeFilter, setActiveFilter] = React.useState(() =>
    getInitialFilter("category", "all")
  );
  const [currentPage, setCurrentPage] = React.useState(() =>
    parseInt(getInitialFilter("page", "1"))
  );
  const [difficultyFilter, setDifficultyFilter] = React.useState<string>(() =>
    getInitialFilter("difficulty", "all")
  );
  const [participantsFilter, setParticipantsFilter] = React.useState<string>(
    () => getInitialFilter("participants", "all")
  );
  const [durationFilter, setDurationFilter] = React.useState<string>(() =>
    getInitialFilter("duration", "all")
  );
  const [pointFilter, setPointFilter] = React.useState<string>(() =>
    getInitialFilter("point", "all")
  );

  const updateURLParams = React.useCallback(
    (updates: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "all" || (key === "page" && value === "1")) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const resetAllFilters = () => {
    setActiveFilter("all");
    setDifficultyFilter("all");
    setParticipantsFilter("all");
    setDurationFilter("all");
    setPointFilter("all");
    setCurrentPage(1);
    
    const newParams = new URLSearchParams();
    setSearchParams(newParams, { replace: true });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 1) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("page");
      setSearchParams(newParams, { replace: true });
    } else {
      updateURLParams({ page: page.toString() });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTop = 0;
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    if (searchParams.has("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("page");
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeFilter,
    difficultyFilter,
    participantsFilter,
    durationFilter,
    pointFilter,
  ]);

  return {
    filters: {
      category: activeFilter,
      difficulty: difficultyFilter,
      participants: participantsFilter,
      duration: durationFilter,
      point: pointFilter,
    },
    currentPage,
    setActiveFilter,
    setDifficultyFilter,
    setParticipantsFilter,
    setDurationFilter,
    setPointFilter,
    updateURLParams,
    resetAllFilters,
    handlePageChange,
  };
};