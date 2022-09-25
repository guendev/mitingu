import { UserDocument } from '@entities/user'

export interface MessageDocument {
  id: string | number
  user: UserDocument
  content: string
  createdAt: number
}
