import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

/**
 * Optional atmosphere plate behind the card — same rules as public/atmos:
 * abstract, always under a scrim, never people, symbols, text or fake artwork.
 * Satori rasterises PNG/JPEG only, so this one stays uncompressed by design.
 * Absent file → the plain gradient card below, which is a valid OG image too.
 */
async function atmosphere() {
  for (const file of ["og.jpg", "og.png"]) {
    try {
      const data = await readFile(join(process.cwd(), "public/atmos", file));
      const mime = file.endsWith(".png") ? "image/png" : "image/jpeg";
      return `data:${mime};base64,${data.toString("base64")}`;
    } catch {
      // not shipped yet — fall through to the next candidate
    }
  }
  return null;
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.title;

export default async function OpenGraphImage() {
  const [bold, black, plate] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/ploni-bold-aaa.woff")),
    readFile(join(process.cwd(), "public/fonts/ploni-black-aaa.woff")),
    atmosphere(),
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
        {plate ? (
          <img
            src={plate}
            width={size.width}
            height={size.height}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              insetInlineStart: 0,
              width: size.width,
              height: size.height,
              objectFit: "cover",
            }}
          />
        ) : null}
        {plate ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              insetInlineStart: 0,
              width: size.width,
              height: size.height,
              background:
                "linear-gradient(to left, rgba(15,20,23,0.94), rgba(15,20,23,0.72))",
            }}
          />
        ) : null}
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
