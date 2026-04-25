"use client";

import { useMemo } from "react";
import { ROUTES } from "../config/constant";
import { usePathname } from "next/navigation";

const useRoute = () => {
  const pathName = usePathname();
  const isOnReviewPage = useMemo(() => {
    if (
      pathName?.startsWith(ROUTES.CANDIDATE.SESSION) &&
      pathName.split("/").length === 5
    ) {
      return true;
    }
    return false;
  }, [pathName]);

  return { isOnReviewPage };
};

export default useRoute;
