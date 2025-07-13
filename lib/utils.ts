import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}


export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export async function formatError(error: unknown): Promise<string> {
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map((e) => e.message).join(', ');
    return fieldErrors;
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
  ) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    console.log(prismaError.meta?.target);
    let field = 'field';
    if (Array.isArray(prismaError.meta?.target) && prismaError.meta.target.length > 0) {
      field = String(prismaError.meta.target[0]);
    }
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return JSON.stringify(error);
  }
}
