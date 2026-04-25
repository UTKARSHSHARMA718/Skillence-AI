import NavigationAnimation from "@/common/components/NavigationAnimation";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <NavigationAnimation>
      <div className="flex items-center justify-center px-6">
        <LoginForm />
      </div>
    </NavigationAnimation>
  );
}
