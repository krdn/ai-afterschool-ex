import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  // JSX를 React.createElement로 변환
  esbuildOptions(options) {
    options.jsx = "automatic"
  },
});
