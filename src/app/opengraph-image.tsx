import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Elan Innovate | Building with Momentum";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#000000",
          padding: "80px",
          // subtle grid
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,252,0.08) 2px, transparent 2px), linear-gradient(to bottom, rgba(255,255,252,0.08) 2px, transparent 2px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: "3px solid #FFFFFC",
            padding: "8px 16px",
            color: "#FFFFFC",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          A venture-building institution
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#FFFFFC",
            textTransform: "uppercase",
            letterSpacing: "-2px",
          }}
        >
          Building businesses for scale,
        </div>
        <div style={{ display: "flex", marginTop: 12 }}>
          <div
            style={{
              backgroundColor: "#FF6A00",
              color: "#000000",
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "-2px",
              padding: "4px 20px",
            }}
          >
            with momentum.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}