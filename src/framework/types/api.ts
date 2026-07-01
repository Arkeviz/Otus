export interface TApiRequest<Request = object, Response = void> {
  params: Request
  response: Response
}

export interface TSimpleResponse {
  code: string
  message: string
}
