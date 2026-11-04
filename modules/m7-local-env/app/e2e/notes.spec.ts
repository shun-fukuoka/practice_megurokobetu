/**
 * E2E（エンドツーエンド）テスト: 実際のブラウザで、人が行う操作を自動で再現する。
 *
 * 前提: 初期状態のデータベースから始める（`npm run db:reset`）。
 * 実行: npm run test:e2e
 */

import { test, expect } from "@playwright/test";

test("初期データが、一覧に表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "メモ" })).toBeVisible();
  await expect(page.getByRole("list", { name: "メモの一覧" }).getByText("はじめてのメモ")).toBeVisible();
});

test("メモを追加すると、一覧に表示される", async ({ page }) => {
  const title = `E2E ${Date.now()}`;

  await page.goto("/");
  await page.getByLabel("タイトル").fill(title);
  await page.getByRole("button", { name: "追加" }).click();

  await expect(page.getByRole("list", { name: "メモの一覧" }).getByText(title)).toBeVisible();
});

test("タイトルが空だと、エラーが表示される", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "追加" }).click();

  await expect(page.getByRole("alert")).toHaveText("タイトルを入力してください。");
});
