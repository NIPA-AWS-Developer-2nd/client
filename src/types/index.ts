export type {
  MissionWithDetails,
  MeetingWithDetails,
} from "../shared/store/missionStore";

export * from './meeting.types';

// Additional types needed by components
export interface CreateMeetingRequest {
  missionId: string;
  scheduledAt: string;
  location: string;
  latitude: number;
  longitude: number;
  preferredGender: PreferredGender;
  minAge: number;
  maxAge: number;
  traits: string[];
}

export interface ParticipantTrait {
  id: string;
  label: string;
  description: string;
  is_active: boolean;
  display_order: number;
}

export type PreferredGender = "MALE" | "FEMALE" | "ANY";

export interface LocationPickerProps {
  location: string;
  latitude: number;
  longitude: number;
  onLocationChange: (
    location: string,
    latitude: number,
    longitude: number
  ) => void;
}

export interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string; // longitude
  y: string; // latitude
  category_name?: string;
  category_group_code?: string;
}

export interface LocationData {
  district: string;
  regionCode: string;
}

export interface TraitSelectorProps {
  traits: ParticipantTrait[];
  selectedTraitIds: string[];
  onSelectionChange: (traitIds: string[]) => void;
  maxSelection: number;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

// User type is now defined in features/auth/hooks/useAuth.ts
// Import from there when needed: import type { User } from "../features/auth/hooks/useAuth";

export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "APPROVED";
export type AccountStatus = "ACTIVE" | "INACTIVE";
