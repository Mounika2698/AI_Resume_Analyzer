import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
};

export const sendError = (
  res: Response,
  message: string,
  errorCode: string,
  statusCode: number = 400
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  } as ApiResponse);
};

export const sendValidationError = (
  res: Response,
  message: string,
  errors?: Record<string, string>
): void => {
  res.status(400).json({
    success: false,
    message,
    errorCode: 'VALIDATION_ERROR',
    errors,
  });
};
