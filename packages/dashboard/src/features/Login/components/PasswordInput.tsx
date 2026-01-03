import { Eye, EyeOff } from "lucide-react"
import { type InputHTMLAttributes, type Ref, useState } from "react"
import { Button } from "@/components/ui/button"
import { FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  ref?: Ref<HTMLInputElement>
}

export function PasswordInput({ className = "", ...field }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={"relative"}>
      <FormControl>
        <Input
          className={`pr-10 ${className}`}
          type={showPassword ? "text" : "password"}
          {...field}
        />
      </FormControl>
      <Button
        type="button"
        className={"absolute top-1/2 right-0 -translate-y-1/2"}
        onClick={() => setShowPassword((prev) => !prev)}
        variant={"link"}
      >
        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
      </Button>
    </div>
  )
}
