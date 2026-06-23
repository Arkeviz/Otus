import type { TApiRequest, TSimpleResponse } from '@/framework/types/api'
import type { TBook, TUser } from '@/framework/types/bookstore'

export type TGetUser = TApiRequest<
  string,
  {
    userID: string
    username: string
    books: TBook[]
  }
>

export type TCreateUser = TApiRequest<
  {
    userName: string
    password: string
  },
  TUser
>

export type TDeleteUser = TApiRequest<
  string,
  TSimpleResponse
>

export type TGenerateToken = TApiRequest<
  {
    userName: string
    password: string
  },
  {
    token: string
    expires: string
    status: string
    result: string
  }
>

export type TCheckUserAuthorization = TApiRequest<
  {
    userName: string
    password: string
  },
  boolean
>

export type TGetBooks = TApiRequest<
  null,
  {
    books: {
      isbn: string
      title: string
      subTitle: string
      author: string
      publish_date: string
      publisher: string
      pages: number
      description: string
      website: string
    }[]
  }
>

export type TAddBooks = TApiRequest<
  {
    userId: string
    collectionOfIsbns: {
      isbn: string
    }[]
  },
  {
    books: {
      isbn: string
    }[]
  }
>

export type TReplaceBook = TApiRequest<
  {
    userId: string
    isbn: string
  },
  TUser
>

export type TDeleteBooks = TApiRequest<
  string,
  undefined
>
