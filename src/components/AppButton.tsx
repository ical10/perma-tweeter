import clsx from "clsx";
import { useRouter } from "next/router";

const SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

type Size = typeof SIZE[keyof typeof SIZE];

type AppButtonProps = {
  size: Size;
  text: string;
};

const AppButton = ({ size, text }: AppButtonProps) => {
  const router = useRouter();

  return (
    <button
      className={clsx("btn-gradient btn w-full !rounded-xl", {
        "w-[121px]": size === "small",
        "w-[180px]": size === "medium",
        "max-w-[200px]": size === "large",
      })}
      onClick={() => router.push("/crosspost")}>
      <span className="text-[1rem] font-medium leading-[162%]">{text}</span>
    </button>
  );
};

export default AppButton;
