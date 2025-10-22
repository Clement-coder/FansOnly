import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export function OnboardingRedirector() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (ready && authenticated && user) {
      const onboardingComplete = user.metadata?.onboardingComplete;
      const userRole = user.metadata?.role;

      // If authenticated but onboarding is not complete and not already on the onboarding page
      if (!onboardingComplete && !userRole && pathname !== "/onboarding") {
        router.push("/onboarding");
      } else if (onboardingComplete && userRole && pathname === "/onboarding") {
        // If onboarding is complete and user has a role, and they are on the onboarding page, redirect to dashboard
        if (userRole === "Creator") {
          router.push("/dashboard/creator");
        } else if (userRole === "Fan") {
          router.push("/dashboard/fan");
        }
      }
    }
  }, [ready, authenticated, user, pathname, router]);

  return null;
}
