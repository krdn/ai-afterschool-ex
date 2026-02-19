import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/primitives/index.ts",
    "src/composites/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "next-themes", "react-hook-form"],
  banner: {
    js: '"use client";',
  },
});
