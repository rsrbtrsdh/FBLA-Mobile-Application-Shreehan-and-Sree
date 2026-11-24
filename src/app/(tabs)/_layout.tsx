import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { useOnboardingStatus } from '@/hooks/use-app-data';

export default function TabsLayout() {
  const onboarding = useOnboardingStatus();

  if (onboarding.status === 'loading') return null;
  if (onboarding.data !== true) return <Redirect href="/onboarding" />;

  return <AppTabs />;
}
