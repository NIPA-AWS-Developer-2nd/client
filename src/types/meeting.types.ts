export type MeetingStatus = "recruiting" | "ready" | "active" | "completed" | "canceled";
export type ParticipantStatus = "joined" | "completed" | "dropped";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type MissionDifficulty = "very_easy" | "easy" | "medium" | "hard" | "very_hard";

export interface Mission {
  id: string;
  title: string;
  description: string;
  participants: number;
  estimatedDuration: number;
  minimumDuration: number;
  basePoints: number;
  points?: number;
  photoVerificationGuide: string;
  sampleImageUrls: string[];
  categoryId: number;
  difficulty: MissionDifficulty;
  thumbnailUrl: string;
  precautions: string[];
  districtId: string;
  location?: string;
  hashtags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  district?: District;
}

export interface ParticipantProfile {
  id: string;
  nickname: string;
  profileImageUrl: string;
  level: number;
  isHost: boolean;
}

export interface Meeting {
  id: string;
  missionId: string;
  hostUserId: string;
  status: MeetingStatus;
  recruitUntil: string;
  scheduledAt: string;
  qrCodeToken?: string;
  qrGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
  mission?: Mission;
  host?: User;
  participants?: MissionParticipant[];
  participantProfiles?: ParticipantProfile[];
  currentParticipants?: number;
  likesCount?: number;
}

export interface MissionParticipant {
  id: number;
  meetingId: string;
  userId: string;
  isHost: boolean;
  status: ParticipantStatus;
  joinedAt: string;
  createdAt: string;
  user?: User;
}

export interface MeetingAttendance {
  id: number;
  meetingId: string;
  userId: string;
  qrCodeToken: string;
  checkedInAt: string;
  durationMinutes: number;
  createdAt: string;
}

export interface MissionReview {
  id: number;
  meetingId: string;
  userId: string;
  reviewText: string;
  rating: number;
  photoUrls: string[];
  aiVerificationStatus: VerificationStatus;
  earnedPoints: number;
  pointCalculationDetails?: Record<string, unknown>;
  submittedAt: string;
  verifiedAt?: string;
  user?: User;
}

export interface User {
  id: string;
  nickname: string;
  profileImageUrl: string;
  categoryIds?: number[];
  mbti?: string;
  districtId?: string;
  bio?: string;
  birthYear?: number;
  gender?: "male" | "female";
  points: number;
  level: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface District {
  id: string;
  regionCode: string;
  districtName: string;
  city: string;
  isActive: boolean;
}

export interface MeetingListFilters {
  status?: MeetingStatus;
  categoryId?: number;
  districtId?: string;
  difficulty?: MissionDifficulty;
  searchKeyword?: string;
  sortBy?: "latest" | "deadline" | "popular" | "newest" | "points";
}

export interface CreateMeetingRequest {
  missionId: string;
  recruitUntil: string;
  scheduledAt: string;
}

export interface JoinMeetingRequest {
  meetingId: string;
}
