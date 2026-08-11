/**
 * Shape returned by the form actions to useActionState.
 *
 * It lives here rather than beside the actions because a "use server" module may
 * only export async functions — a constant like IDLE_STATE exported from there
 * fails at runtime with "can only export async functions, found object".
 */
export type FormState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Record<string, string>;
  message?: string;
  /**
   * What the visitor typed, echoed back on failure.
   *
   * React 19 resets an uncontrolled form once its action resolves, so without
   * this a single validation error would empty every field. Feeding these back
   * as defaultValue means the reset lands on the submitted values instead.
   */
  values?: Record<string, string>;
};

export const IDLE_STATE: FormState = { status: "idle" };
