import { USER_ROLE } from "@/common/types/user.types";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function Home() {
  const sesssion = await getServerSession(authOptions);

  if(sesssion?.user?.role === USER_ROLE.ADMIN){
    redirect("/admin/dashboard");
  }
  
  if(sesssion?.user?.role === USER_ROLE.USER){
    redirect("/candidate/dashboard");
  }

  if(!sesssion){
    redirect("/login");
  }

  notFound();
}
