"use client";

import CommonSidebar from "@/common/components/CommonSidebar";
import { MdOutlineRateReview } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import useRoute from "@/common/hooks/useRoute";

export const Sidebar = ({ className }: { className?: string }) => {
  const { isOnReviewPage } = useRoute();
  // Check if the path matches "/candidate/dashboard/session/[id]" where [id] exists
  if (isOnReviewPage) {
    return null;
  }

  return (
    <CommonSidebar
      className={className}
      items={SIDEBAR_ITEMS}
      logoRedirect="/admin/dashboard"
    />
  );
};

const SIDEBAR_ITEMS = [
  {
    label: "Evaluation",
    href: "/candidate/dashboard/session",
    icon: <MdOutlineRateReview size={25} />,
  },
  {
    label: "My Progress",
    href: "/candidate/dashboard/reports",
    icon: <GiProgression size={25} />,
  },
];
