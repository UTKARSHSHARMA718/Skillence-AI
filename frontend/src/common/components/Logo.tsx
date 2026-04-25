import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/images/logo.jpg"
      alt="Logo"
      width={100}
      height={100}
      className={className}
    />
  );
};

export default Logo;
