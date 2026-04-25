import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

 const useNavigationLock = (isEnabled: boolean = true) => {
  const router = useRouter();

  useEffect(() => {
    if (!isEnabled) return;

    // 1. Handle Tab Close and Page Refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Most modern browsers ignore the return string and show a generic message
      e.returnValue = ''; 
    };

    // 2. Handle "Back" button and internal Next.js navigation
    // Note: This pushes a new state to the history so that when the user 
    // clicks "Back", they stay on the current page first.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Are you sure you want to leave the interview? Your progress may be lost."
      );

      if (confirmLeave) {
        // If they confirm, we let them go back
        window.history.back();
      } else {
        // If they cancel, we push the state again to keep them here
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isEnabled, router]);
};

export default useNavigationLock;