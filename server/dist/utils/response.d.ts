import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errorCode?: string;
}
export declare const sendSuccess: <T>(res: Response, message: string, data?: T, statusCode?: number) => void;
export declare const sendError: (res: Response, message: string, errorCode: string, statusCode?: number) => void;
export declare const sendValidationError: (res: Response, message: string, errors?: Record<string, string>) => void;
//# sourceMappingURL=response.d.ts.map