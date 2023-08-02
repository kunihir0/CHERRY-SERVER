import * as bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export class Utils {
  public static isJSON(data: string): boolean {
    try {
      JSON.parse(data)
    } catch (e) {
      return false
    }
    return true
  }

  public static getTime(): number {
    const date = new Date()
    const time = date.getTime()
    return time
  }

  public static genSalt(saltRounds: number, value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = bcrypt.genSaltSync(saltRounds)
      bcrypt.hash(value, salt, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  }

  public static compareHash(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('comparing password:', value, 'with hash:', hash);
      bcrypt.compare(value, hash, (err, result): boolean | any => {
        if (err) reject(err)
        console.log('compare result:', result);
        resolve(result)
      })
    })
  }
}
