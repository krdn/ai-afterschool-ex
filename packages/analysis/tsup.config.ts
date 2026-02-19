import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/saju/index.ts",
    "src/name/index.ts",
    "src/mbti/index.ts",
    "src/vark/index.ts",
    "src/zodiac/index.ts",
    "src/compatibility/index.ts",
    "src/integration/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
