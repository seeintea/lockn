import { date0 } from "@lockn/shared"
import { useEffect } from "react"

export default function App() {
  useEffect(() => {
    console.log(date0("test"))
  }, [])

  return (
    <div className={"w-full h-screen flex items-center justify-center"}>
      <span>react with rsbuild</span>
    </div>
  )
}
