"use client";

import { useEffect, useState } from "react";

export default function PhotoPick({ name, required }: { name: string; required?: boolean }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  return (
    <label className={`piece-drop${src ? " has-file" : ""}`}>
      {src ? <img src={src} alt="" /> : (
        <span>
          <strong>Upload media</strong>
          Drop a portrait or click to choose · jpeg, png, or webp · under 8MB
        </span>
      )}
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        required={required}
        onChange={(event) => {
          const file = event.target.files?.[0];
          setSrc((current) => {
            if (current) URL.revokeObjectURL(current);
            return file ? URL.createObjectURL(file) : "";
          });
        }}
      />
    </label>
  );
}
