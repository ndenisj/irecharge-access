import { ApiResponse } from '../interfaces/api-response.interface';

export function createApiResponse<T>(
  status: boolean,
  statusCode: number,
  message: string,
  data: T,
): ApiResponse<T> {
  return { status, statusCode, message, data };
}
