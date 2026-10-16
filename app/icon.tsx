import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#693693",
          color: "white",
          fontSize: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia",
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
