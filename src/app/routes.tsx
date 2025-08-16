import { Routes, Route } from "react-router-dom";
import { ResponsiveLayout } from "../shared/layout/ResponsiveLayout";
import {
  HomePage,
  MarketPage,
  DonationPage,
  MeetingListPage,
  MeetingDetailPage,
  MeetingCreatePage,
  MeetingEditPage,
  MeetingChannelPage,
  MissionsPage,
  MyPage,
  AppSettingsPage,
  UserProfilePage,
  AuthCallbackPage,
  LoginPage,
  MissionDetailPage,
  AuthSuccessPage,
  NotFoundPage,
  OnboardingPage,
} from "../features";
import { PointHistoryPage } from "../features/point";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/success" element={<AuthSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Main app routes */}
      <Route
        path="/"
        element={
          <ResponsiveLayout
            title="할사람? | 번개모임 커뮤니티"
            showBanner={true}
          >
            <HomePage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/missions"
        element={
          <ResponsiveLayout title="지역미션 | 할사람?" showBanner={true}>
            <MissionsPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/missions/:id"
        element={
          <ResponsiveLayout
            title="지역미션 | 할사람?"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
          >
            <MissionDetailPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings"
        element={
          <ResponsiveLayout title="번개모임 | 할사람?" showBanner={true}>
            <MeetingListPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings/new"
        element={
          <ResponsiveLayout
            title="모임 만들기 | 할사람?"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
          >
            <MeetingCreatePage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings/edit/:id"
        element={
          <ResponsiveLayout
            title="모임 정보 수정 | 할사람?"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
          >
            <MeetingEditPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings/:id"
        element={
          <ResponsiveLayout
            title="번개모임 | 할사람?"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
          >
            <MeetingDetailPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings/:id/channel"
        element={
          <ResponsiveLayout
            title="모임 채널 | 할사람?"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
            fullWidth={true}
          >
            <MeetingChannelPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/market"
        element={
          <ResponsiveLayout title="포인트마켓 | 할사람?" showBanner={true}>
            <MarketPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/donation"
        element={
          <ResponsiveLayout title="기부하기 | 할사람?" showBanner={true}>
            <DonationPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/my"
        element={
          <ResponsiveLayout title="마이페이지 | 할사람" showBanner={true}>
            <MyPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/my/settings"
        element={
          <ResponsiveLayout
            title="앱 설정 | 할사람?"
            showBanner={true}
            hideBottomNav={true}
          >
            <AppSettingsPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/user/:userId?"
        element={
          <ResponsiveLayout title="사용자 프로필 | 할사람?" showBanner={true}>
            <UserProfilePage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/points/history"
        element={
          <ResponsiveLayout
            title="포인트 내역 | 할사람?"
            showBanner={true}
            hideBottomNav={true}
            noPadding={true}
          >
            <PointHistoryPage />
          </ResponsiveLayout>
        }
      />

      {/* 404 페이지 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
