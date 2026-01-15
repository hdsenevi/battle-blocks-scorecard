/**
 * App Lifecycle Handler Component
 * Wrapper component to use the app lifecycle hook
 * Must be inside GameProvider
 */

import { useAppLifecycle } from "../hooks/use-app-lifecycle";

export function AppLifecycleHandler() {
  useAppLifecycle();
  return null; // This component doesn't render anything
}
