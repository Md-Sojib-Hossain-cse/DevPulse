export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export type TJwtPayload = {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
};
