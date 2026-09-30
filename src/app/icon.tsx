import { ImageResponse } from "next/og";

export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #4c0519 100%)",
          borderRadius: "38px",
          border: "4px solid #f43f5e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: "92px", fontWeight: 900, letterSpacing: "-2px" }}>
          <span style={{ color: "#ffffff" }}>F</span>
          <span style={{ color: "#f43f5e" }}>X</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
