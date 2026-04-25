"use client";

import Link from "next/link";
import useRoute from "../hooks/useRoute";
import UserProfile from "./UserProfile";
import clsx from "clsx";
import { ROUTES } from "../config/constant";
import { LogoSvg } from "@/libs/svgs/SvgImage";

const Navbar = () => {
  const { isOnReviewPage } = useRoute();

  return (
    <nav
      className={clsx(
        "w-full h-20 shrink-0 bg-white border-b border-gray-200 flex items-center px-6",
        isOnReviewPage ? "justify-between" : "justify-end",
      )}
    >
      {isOnReviewPage && (
        <Link href={ROUTES.CANDIDATE.DASHBOARD}>
           <LogoSvg />
        </Link>
      )}
      <UserProfile />
    </nav>
  );
};

export default Navbar;
