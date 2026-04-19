declare module "bcrypt" {
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hashSync(data: string, saltOrRounds: string | number): string;
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
}
