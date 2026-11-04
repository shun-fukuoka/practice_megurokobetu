# hello-worker-practice

M10（デプロイ）の演習のための、**小さな Cloudflare Worker** です。データベースも、秘密も、個人情報も使いません。

> このフォルダの中身は、**独立したリポジトリ**（テンプレート）として使います。コース全体のリポジトリとは、**別のリポジトリ**を作って、そこに置きます（手順は、コースの M10 の手順書）。

## 使い方

```bash
npm ci            # 依存関係を入れる
npm run check     # 型検査とテスト
npm run dev       # ローカルで起動（http://127.0.0.1:8787）
npm run deploy:dry   # 公開せずに、設定だけを検証する
```

## 構成

| ファイル | 役割 |
|---|---|
| `src/index.ts` | Worker の入口。`/` と `/health` を返す |
| `src/greeting.ts` | あいさつの文面と、版（`VERSION`）。演習で、版を書き換える |
| `test/` | テスト |
| `wrangler.jsonc` | Worker の設定（名前、入口、実行環境の版）。**秘密は書かない** |
| `.github/workflows/ci.yml` | PR で、型検査とテストを行う（秘密は使わない） |
| `.github/workflows/deploy.yml` | `main` に変更が入ったら、テストを通してから公開する（Secrets を使う） |

## Secrets（自分のリポジトリに、自分で登録する）

| 名前 | 内容 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | デプロイ用の API トークン（権限は、最小限） |
| `CLOUDFLARE_ACCOUNT_ID` | デプロイ先のアカウントの ID |

**これらの値を、コード・設定ファイル・チャット・AI に、書かないでください。**
