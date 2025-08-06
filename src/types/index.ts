export type {
  MissionWithDetails,
  MeetingWithDetails,
} from "../shared/store/missionStore";

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

export interface TraitSelectorProps {
  traits: ParticipantTrait[];
  selectedTraitIds: string[];
  onSelectionChange: (traitIds: string[]) => void;
  maxSelection: number;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface User {
  id: number;
  provider: "KAKAO" | "NAVER" | "GOOGLE";
  provider_user_id: string;
  email: string;
  name: string;
  phone?: string;
  profile_image_url?: string;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "APPROVED";
export type AccountStatus = "ACTIVE" | "INACTIVE";
