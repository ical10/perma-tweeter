import clsx from "clsx";

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
  return (
    <button
      className={clsx("btn-gradient btn !rounded-xl", {
        "w-[121px]": size === "small",
        "w-[180px]": size === "medium",
        "w-[200px]": size === "large",
      })}>
      <span className="text-[1rem] font-medium leading-[162%]">{text}</span>
    </button>
  );
};

export default AppButton;
