import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    // .next/ and next-env.d.ts are generated; scripts/ are one-off Node tools;
    // drizzle/ holds generated migrations and metadata.
    ignores: [
      ".next/**",
      "node_modules/**",
      "scripts/**",
      "drizzle/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
