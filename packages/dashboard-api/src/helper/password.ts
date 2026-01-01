import { createHash } from "node:crypto"
import { nanoid } from "nanoid"

export function getSaltAndPassword(originPassword: string, salt?: string) {
  let nextSalt = salt
  if (!nextSalt) {
    nextSalt = nanoid(16)
  }
  const password = createHash("sha256").update(`${originPassword}${nextSalt}`).digest("hex")
  return [nextSalt, password]
}
