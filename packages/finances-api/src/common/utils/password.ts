import { createHash } from "node:crypto"

export const hashPassword = (password: string, salt: string): string => {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex")
}

export const verifyPassword = (inputPassword: string, storedPassword: string, salt: string): boolean => {
  if (inputPassword === storedPassword) return true
  return hashPassword(inputPassword, salt) === storedPassword
}
