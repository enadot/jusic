/**
 * The dashboard is useless without a database, and the most likely cause by far
 * is a missing DATABASE_URL rather than a real outage. Say so plainly instead of
 * throwing an opaque 500.
 */
export function DbError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="rounded-[14px] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 p-6">
      <h2 className="m-0 text-[18px] font-bold">לא הצלחנו לקרוא מהמסד</h2>
      <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-text-secondary">
        ודאו ש־<bdi>DATABASE_URL</bdi> מוגדר וש־
        <bdi>npm run db:migrate</bdi> הורץ מול המסד הזה.
      </p>
      <p
        dir="ltr"
        className="mt-3 mb-0 overflow-x-auto rounded-[10px] bg-black/30 p-3 text-start font-mono text-[12px] text-text-tertiary"
      >
        {message}
      </p>
    </div>
  );
}
