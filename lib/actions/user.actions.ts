'use server';

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma"
import { formatError } from "../utils";
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' }
  } catch (error) {

    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    });

    const hashedPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword
      }
    });

    await signIn('credentials', { email: user.email, password: user.password });

    return { success: true, message: 'User registered successfully' }
  } catch (error) {
    // console.log(error.name)
    // console.log(error.code)
    // console.log(error.errors)
    // console.log(error.meta?.target)

    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: formatError(error) }
  }
}