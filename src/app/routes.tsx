import { Routes, Route } from "react-router-dom";
import { ResponsiveLayout } from "../shared/layout/ResponsiveLayout";
import {
  HomePage,
  MarketPage,
  MeetingListPage,
  MeetingDetailPage,
  MeetingCreatePage,
  MissionsPage,
  MyPage,
  AppSettingsPage,
  AuthCallbackPage,
  LoginPage,
  MissionDetailPage,
  AuthSuccessPage,
  NotFoundPage,
  OnboardingPage,
} from "../features";

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
            title="Halsaram | 번개모임 커뮤니티"
            showBanner={true}
          >
            <HomePage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/missions"
        element={
          <ResponsiveLayout title="지역미션 | Halsaram" showBanner={true}>
            <MissionsPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/missions/:id"
        element={
          <ResponsiveLayout
            title="지역미션 | Halsaram"
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
          <ResponsiveLayout title="번개모임 | Halsaram" showBanner={true}>
            <MeetingListPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings/new"
        element={
          <ResponsiveLayout
            title="번개모임 | Halsaram"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
          >
            <MeetingCreatePage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/meetings/:id"
        element={
          <ResponsiveLayout
            title="번개모임 | Halsaram"
            showBanner={true}
            noPadding={true}
            hideBottomNav={true}
          >
            <MeetingDetailPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/market"
        element={
          <ResponsiveLayout title="포인트마켓 | Halsaram" showBanner={true}>
            <MarketPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/my"
        element={
          <ResponsiveLayout title="마이페이지 | Halsaram" showBanner={true}>
            <MyPage />
          </ResponsiveLayout>
        }
      />
      <Route
        path="/my/settings"
        element={
          <ResponsiveLayout title="앱 설정 | Halsaram" showBanner={true}>
            <AppSettingsPage />
          </ResponsiveLayout>
        }
      />

      {/* 404 페이지 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
