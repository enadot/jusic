/**
 * Fails the build when Next.js would not load proxy.ts.
 *
 * Next 16 renamed middleware.ts to proxy.ts and looks for it beside the app
 * directory — so with routes under src/app it must be src/proxy.ts. A copy at
 * the repository root is not an error, it is simply never executed: the build
 * succeeds, the dashboard still works because requireAdmin() guards every page,
 * and the only thing that quietly breaks is the OAuth return, which needs the
 * proxy to trade Neon's verifier for a session. That failure looks exactly like
 * a rejected Google login, so it is worth catching here rather than in
 * production.
 */
import { existsSync } from "node:fs";

const errors = [];

if (!existsSync("src/app")) {
  errors.push(
    "Expected routes at src/app. If the app directory moved, this check has to move with it.",
  );
} else {
  if (!existsSync("src/proxy.ts")) {
    errors.push(
      "src/proxy.ts is missing. Routes live in src/app, so Next looks for the proxy at src/proxy.ts.",
    );
  }
  for (const stray of ["proxy.ts", "middleware.ts", "src/middleware.ts"]) {
    if (existsSync(stray)) {
      errors.push(
        `${stray} exists and Next will never run it. The only file Next loads here is src/proxy.ts.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("Proxy check failed:\n");
  for (const error of errors) console.error(`  • ${error}`);
  console.error("");
  process.exit(1);
}

console.log("Proxy check passed.");
