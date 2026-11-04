import { defineConfig } from "@playwright/test";

// E2E テストの設定。
// テストを実行すると、Web サーバー（npm run dev）が自動で起動する。
// 前提: ローカルの Supabase が起動していること、`.env`（または環境変数）が設定されていること。
export default defineConfig({
  testDir: "e2e",
  // 1 つのテスト全体の制限時間。初回はページの表示が遅いことがあるので、余裕を持たせている
  timeout: 30_000,
  // 画面の確認（expect）は、5 秒まで待つ
  expect: { timeout: 5_000 },
  // テスト同士が同じデータベースを使うため、順番に1つずつ実行する
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    // クリックや入力が、見つからない要素を待つ時間。失敗したときに、待たされすぎないよう、短めにしてある
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
    // 失敗したときだけ、操作の記録（trace）と画面のスクリーンショットを残す
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
