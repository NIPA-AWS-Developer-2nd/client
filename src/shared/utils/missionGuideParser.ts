export interface MissionStep {
  stepIndex: number;
  title: string;
  description: string;
}

/**
 * photoVerificationGuide 문자열을 파싱하여 단계별 가이드로 분리
 * 
 * @param guide - "1단계: 설명\n2단계: 설명" 형태의 문자열
 * @returns MissionStep[] - 단계별 가이드 배열
 */
export const parseMissionGuide = (guide: string): MissionStep[] => {
  if (!guide || !guide.trim()) {
    return [];
  }

  const steps: MissionStep[] = [];
  
  // 줄바꿈으로 분리
  const lines = guide.split('\n').map(line => line.trim()).filter(line => line);
  
  // 먼저 "N단계:" 패턴으로 파싱 시도
  for (const line of lines) {
    const stepMatch = line.match(/^(\d+)단계:\s*(.+)$/);
    
    if (stepMatch) {
      const stepNumber = parseInt(stepMatch[1], 10);
      const description = stepMatch[2].trim();
      
      steps.push({
        stepIndex: stepNumber - 1, // 0부터 시작
        title: `${stepNumber}단계`,
        description,
      });
    }
  }
  
  // 만약 단계별 파싱이 안되었다면, 특정 패턴으로 자동 분할
  if (steps.length === 0) {
    // "N개 이상" 패턴을 찾아서 그 수만큼 단계 생성
    const numberMatch = guide.match(/(\d+)개\s*이상/);
    
    if (numberMatch) {
      const requiredCount = parseInt(numberMatch[1], 10);
      
      for (let i = 0; i < requiredCount; i++) {
        steps.push({
          stepIndex: i,
          title: `${i + 1}번째 인증`,
          description: guide,
        });
      }
    } else {
      // 기본값으로 1개 단계 생성
      steps.push({
        stepIndex: 0,
        title: '미션 인증',
        description: guide,
      });
    }
  }
  
  // stepIndex 순으로 정렬
  return steps.sort((a, b) => a.stepIndex - b.stepIndex);
};

/**
 * 단계별 완료 상태를 확인
 * 
 * @param totalSteps - 전체 단계 수
 * @param completedSteps - 완료된 단계 인덱스 배열
 * @returns boolean - 모든 단계 완료 여부
 */
export const areAllStepsCompleted = (totalSteps: number, completedSteps: number[]): boolean => {
  if (totalSteps === 0) return false;
  
  for (let i = 0; i < totalSteps; i++) {
    if (!completedSteps.includes(i)) {
      return false;
    }
  }
  
  return true;
};

/**
 * 다음 완료해야 할 단계 인덱스를 반환
 * 
 * @param totalSteps - 전체 단계 수
 * @param completedSteps - 완료된 단계 인덱스 배열
 * @returns number | null - 다음 단계 인덱스 (모든 단계 완료시 null)
 */
export const getNextStepIndex = (totalSteps: number, completedSteps: number[]): number | null => {
  for (let i = 0; i < totalSteps; i++) {
    if (!completedSteps.includes(i)) {
      return i;
    }
  }
  
  return null; // 모든 단계 완료
};