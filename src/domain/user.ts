export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    private readonly passwordHash: string
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.passwordHash = passwordHash
  }
}