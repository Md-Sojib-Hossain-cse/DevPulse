export type TAuth = {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
};
