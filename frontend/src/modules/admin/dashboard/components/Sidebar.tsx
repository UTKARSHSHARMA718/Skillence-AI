import CommonSidebar from "@/common/components/CommonSidebar";
import { FaUsersGear } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";

export const Sidebar = ({ className }: { className?: string }) => {
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
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <BiSolidDashboard size={25} />,
  },
  {
    label: "Users",
    href: "/admin/dashboard/users",
    icon: <FaUsersGear size={25} />,
  },
];
