import js from "@eslint/js";
import tseslint from "typescript-eslint";

// 練習用の最小設定。M4 の演習で「CI が赤くなる理由」を読み取れるよう、
// 理由が分かりやすいルール（eqeqeq / no-var）を明示的に有効にしている。
export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      eqeqeq: "error",
      "no-var": "error",
    },
  },
];
