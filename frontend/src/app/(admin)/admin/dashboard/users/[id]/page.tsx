import NavigationAnimation from "@/common/components/NavigationAnimation";
import UserDetailsPage from "@/modules/admin/users/components/UserDetailsPage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const userId = id;
  return (
    <NavigationAnimation>
      <UserDetailsPage userId={userId} />
    </NavigationAnimation>
  );
};

export default page;
