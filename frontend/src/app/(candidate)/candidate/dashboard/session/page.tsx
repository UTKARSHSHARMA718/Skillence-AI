import NavigationAnimation from "@/common/components/NavigationAnimation";
import SessionInitForm from "@/modules/candidate/sessionForm/components/SessionInitForm";

const Page = () => {
  return (
    <NavigationAnimation>
      <div className="flex justify-center flex-1 min-h-0 overflow-y-auto">
        <SessionInitForm />
      </div>
    </NavigationAnimation>
  );
};

export default Page;
