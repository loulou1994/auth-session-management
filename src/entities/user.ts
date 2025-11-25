export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
};

export type UserSignup = Omit<User, "id">;