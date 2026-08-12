/**
 * Minimum password length Neon Auth enforces on reset-password.
 *
 * It lives here rather than beside the actions for the same reason IDLE_STATE
 * does: a "use server" module may only export async functions, and both the
 * server action and the client form need this number.
 */
export const MIN_PASSWORD_LENGTH = 8;
