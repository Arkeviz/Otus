import type { TGetBooks, TGetUser } from '@/framework/services/bookStoreService.types'

export type TBook = TGetBooks['response']['books'][number]
export type TUser = TGetUser['response']
