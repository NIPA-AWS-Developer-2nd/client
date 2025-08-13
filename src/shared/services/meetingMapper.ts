import type { MeetingDto, MeetingMissionDto, MeetingHostDto } from './meetingApi';
import type { Meeting, Mission, User } from '../../types/meeting.types';

/**
 * 백엔드 API 응답을 프론트엔드 타입으로 변환
 */
export class MeetingMapper {
  /**
   * MeetingDto -> Meeting 변환
   */
  static toMeeting(dto: MeetingDto): Meeting {
    return {
      id: dto.id,
      missionId: dto.missionId,
      hostUserId: dto.hostUserId,
      status: dto.status as Meeting['status'],
      recruitUntil: dto.recruitUntil,
      scheduledAt: dto.scheduledAt,
      qrCodeToken: dto.qrCodeToken || undefined,
      qrGeneratedAt: dto.qrGeneratedAt || undefined,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      currentParticipants: dto.currentParticipants,
      mission: dto.mission ? this.toMission(dto.mission) : undefined,
      host: dto.host ? this.toUser(dto.host) : undefined,
    };
  }

  /**
   * MeetingMissionDto -> Mission 변환
   */
  static toMission(dto: MeetingMissionDto): Mission {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      minParticipants: dto.minParticipants,
      maxParticipants: dto.maxParticipants,
      estimatedDuration: dto.estimatedDuration,
      minimumDuration: dto.minimumDuration,
      basePoints: dto.basePoints,
      photoVerificationGuide: dto.photoVerificationGuide,
      sampleImageUrls: dto.sampleImageUrls,
      categoryId: dto.categoryId,
      difficulty: dto.difficulty as Mission['difficulty'],
      thumbnailUrl: dto.thumbnailUrl,
      precautions: dto.precautions,
      districtId: dto.districtId,
      location: dto.location || undefined,
      hashtags: dto.hashtags,
      isActive: dto.isActive,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      category: dto.category ? {
        id: dto.category.id,
        name: dto.category.name,
        slug: dto.category.slug,
        isActive: dto.category.isActive,
      } : undefined,
      district: dto.district ? {
        id: dto.district.id,
        regionCode: dto.district.regionCode,
        districtName: dto.district.districtName,
        city: dto.district.city,
        isActive: dto.district.isActive,
      } : undefined,
    };
  }

  /**
   * MeetingHostDto -> User 변환
   */
  static toUser(dto: MeetingHostDto): User {
    return {
      id: dto.id,
      nickname: dto.nickname,
      profileImageUrl: dto.profileImageUrl,
      points: dto.points,
      level: dto.level,
    };
  }

  /**
   * Meeting 배열 변환
   */
  static toMeetings(dtos: MeetingDto[]): Meeting[] {
    return dtos.map(dto => this.toMeeting(dto));
  }
}