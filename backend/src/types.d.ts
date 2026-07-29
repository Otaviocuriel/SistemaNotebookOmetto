export {};

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        nome: string;
        email: string;
        tipo: "ADMIN" | "PROFESSOR";
      };
    }
  }
}