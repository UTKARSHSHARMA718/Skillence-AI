import NavigationAnimation from "@/common/components/NavigationAnimation";
import SessionPage from "@/modules/candidate/session/components/SessoinPage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <NavigationAnimation>
      <SessionPage sessionId={id} />
    </NavigationAnimation>
  );
};

export default page;
