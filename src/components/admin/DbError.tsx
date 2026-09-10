/**
 * Blanks out the credentials in anything shaped like a connection string.
 *
 * This panel prints a driver message verbatim, and `neon()` puts the whole
 * DATABASE_URL — password and all — into its "not a valid URL" error. Rendering
 * that would publish the database password to the page. src/server/db catches
 * the known faults before the driver sees them; this is the second line, for
 * every message it does not raise itself.
 */
function withoutCredentials(message: string): string {
  return message.replace(
    /(postgres(?:ql)?:\/\/)[^@\s]+@/gi,
    "$1<user>:<password>@",
  );
}

/**
 * The dashboard is useless without a database, and the most likely cause by far
 * is a missing DATABASE_URL rather than a real outage. Say so plainly instead of
 * throwing an opaque 500.
 */
export function DbError({ error }: { error: unknown }) {
  const message = withoutCredentials(
    error instanceof Error ? error.message : String(error),
  );

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--chip-spam-bd)] bg-[var(--chip-spam-bg)] p-6">
      <h2 className="m-0 text-[18px] font-bold">לא הצלחנו לקרוא מהמסד</h2>
      <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
        ודאו ש־<bdi>DATABASE_URL</bdi> מוגדר וש־
        <bdi>npm run db:migrate</bdi> הורץ מול המסד הזה.
      </p>
      <p
        dir="ltr"
        className="mt-3 mb-0 overflow-x-auto rounded-[10px] bg-[var(--ad-code-bg)] p-3 text-start font-mono text-[12px] text-[var(--text-tertiary)]"
      >
        {message}
      </p>
    </div>
  );
}
