import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.title;

export default async function OpenGraphImage() {
  const [bold, black] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/ploni-bold-aaa.woff")),
    readFile(join(process.cwd(), "public/fonts/ploni-black-aaa.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0F1417",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* the single permitted cyan glow */}
        <div
          style={{
            position: "absolute",
            top: -260,
            insetInlineStart: 260,
            width: 780,
            height: 780,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(30,176,213,0.30), rgba(15,20,23,0) 62%)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontFamily: "PloniBlack",
            fontSize: 88,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            direction: "rtl",
          }}
        >
          כל המוזיקה היהודית במקום אחד.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: "PloniBold",
            fontSize: 36,
            color: "#1EB0D5",
            direction: "rtl",
          }}
        >
          בדיוק כמו שאתם אוהבים.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontFamily: "PloniBold",
            fontSize: 30,
            letterSpacing: "0.18em",
            color: "#8A9391",
          }}
        >
          JUSIC.CO
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "PloniBold", data: bold, weight: 700, style: "normal" },
        { name: "PloniBlack", data: black, weight: 800, style: "normal" },
      ],
    },
  );
}
