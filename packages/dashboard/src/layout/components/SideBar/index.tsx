import { TextAnimate } from "@/components/ui/text-animate"

export function SideBar() {
  return (
    <div className="w-64 h-full bg-[#f5f5f5] dark:bg-[#3e3e3e]">
      <div className="flex flex-col items-center justify-center h-20">
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className={"text-2xl font-bold"}
        >
          Dashboard
        </TextAnimate>
      </div>
    </div>
  )
}
