# Claude Code と Codex の対応表

> **確認日: 2026-10-29。** 両製品の**公式の資料**で確認した内容です。Claude Code は、手順書の記述を実際に行える部分と、資料でのみ確認した部分があります。**Codex は、資料での確認のみで、実際には操作していません**（この教材の作成環境に、Codex が入っていないため）。名前や挙動は、バージョンで変わることがあります。使う前に、公式の最新の資料を見てください。
>
> Codex の公式の資料は、`developers.openai.com/codex/...` から、`learn.chatgpt.com/docs/...` へ移転していました（確認時点）。資料を探すときは、注意してください。

## 先に知っておくこと: 名前が同じで、意味が違うもの

| 名前 | Claude Code での意味 | Codex での意味 |
|---|---|---|
| **Auto** | **AI（別の審査役）が、行動を裏で審査**して、確認を省くモード | **作業フォルダの中は書き込める（`workspace-write`）、外へ出る操作は確認する（`on-request`）** という、標準の組み合わせ。**審査役が省くのではなく、仕組みの標準** |

→ **「Auto」という名前だけで、同じものと思わないでください。** Claude Code の Auto は、このコースでは使いません。Codex の「Auto」は、標準の設定です。名前が同じでも、**何を許可するか**を、必ず確かめます。

## 対応表

| 項目 | Claude Code | Codex |
|---|---|---|
| **チャット画面で使う方法** | デスクトップアプリ（Code タブ）、VS Code 拡張。ターミナルでも使える | ChatGPT のデスクトップアプリ、IDE 拡張（VS Code などの拡張。公式の資料では、Marketplace の `openai.chatgpt`）。ターミナル（CLI）でも使える |
| **動作モードの切り替え場所** | プロンプト欄の下の、モードの選択欄（モード表示） | 入力欄の下の、権限（permissions）の選択欄。CLI では `/permissions` |
| **確認して実行するモード** | **Manual** | **Ask for approval**（作業フォルダの中で作業し、外へ出る操作の前に確認する） |
| **読むだけのモード** | **Plan**（変更は、計画の承認まで、できない） | **Read-only**（読み取りのみ。CLI の標準の組み合わせの 1 つ）。※Plan は「計画を示す」が、Read-only は「読むだけ」で、**同じではない** |
| **確認を、自動の審査に任せるモード** | **Auto** | **Approve for me**（自動審査。画面での名前）。CLI では、`approvals_reviewer = "auto_review"` の設定 |
| **確認を全部省くモード** | **Bypass permissions**（このコースでは使わない） | **Full access**（`danger-full-access`＋確認なし）。CLI では `--dangerously-bypass-approvals-and-sandbox`（別名 `--yolo`）。**推奨されていない** |
| **設定の場所** | `~/.claude/settings.json`、`.claude/settings.json`、`.claude/settings.local.json`（JSON） | `config.toml`（`sandbox_mode`、`approval_policy`、`approvals_reviewer` など）。プロファイルも使える（TOML） |
| **コマンド単位の許可・拒否** | `permissions` の `allow` / `ask` / `deny`（例: `Bash(rm *)`）。評価の順は deny → ask → allow | **`.rules` ファイルの `prefix_rule`**（`decision = "allow"` / `"prompt"` / `"forbidden"`）。複数当てはまるときは、**最も厳しい**もの（forbidden > prompt > allow）。**実験的な機能**。再起動が必要。`codex execpolicy check` で確かめられる |
| **ファイルの読み取りを禁止する** | `Read(.env)` などの **deny ルール**（AI のファイルを読む道具と、認識されたコマンドに効く） | **確認した資料には、ファイル単位の読み取り禁止に相当する設定は、見つからなかった**（未確認）。サンドボックスの設定（`workspace-write` など）と、保護されたパス（`.git`、`.agents`、`.codex`、`.aws`）の説明はある |
| **OS レベルの隔離（サンドボックス）** | 別の機能（`/sandbox`）。Bash の、ファイルとネットワークの隔離 | **サンドボックスが、標準の仕組みの中心**。`read-only` / `workspace-write` / `danger-full-access`。**ネットワークは、標準で無効** |
| **指示ファイル** | `CLAUDE.md`。`AGENTS.md` も読める（`CLAUDE.md` が無ければ `AGENTS.md`、両方あれば `CLAUDE.md` のみ。取り込みも可） | **`AGENTS.md`**。グローバル（`~/.codex`）と、プロジェクトのルートから現在のフォルダまでを、**連結**して使う。近いものほど優先。サイズの上限は、標準で 32 KiB |
| **指示は、強制か** | **強制ではない**（文脈）。止めるには、許可ルールやフックを使う | **強制ではない**（資料には、強制の仕組みの記述がない） |
| **worktree** | チャットで「worktree で作業して」。または、デスクトップの機能、`--worktree`。標準の場所は `.claude/worktrees/<名前>/`、ブランチは `worktree-<名前>`。`.worktreeinclude` で、Git に入らないファイルをコピー | アプリで、入力欄の下の **Worktree** を選ぶ。標準の場所は `$CODEX_HOME/worktrees`。`.worktreeinclude` も使う。**Hand off**（ローカルと worktree の間で、チャットごと移す）、**Create branch here**。直近 15 個を保持（変更可） |
| **変更の捨て方** | worktree を削除する（`git worktree remove`）。確認が出る場合がある | 公式の資料には、独立した「破棄」の操作の記述がない。チャットを**アーカイブすると、管理下の worktree が削除される**（削除の前に、スナップショットが保存される） |
| **設定の反映** | `permissions` の変更は、**実行中にも反映**される | `.rules` は、**再起動が必要** |

## 読み替えの例（このコースの演習）

| 演習の指示 | Codex の人は |
|---|---|
| M2: モードを Manual か Plan にする | **Ask for approval**、または **Read-only** にする |
| M2: Auto・Bypass を使わない | **Approve for me**、**Full access** を使わない |
| M6-2: `settings.local.json` に拒否ルールを書く | **`.rules` で `forbidden` を書く**（ファイル単位の読み取り禁止は、資料で見つからなかったため、講師に相談する） |
| M6-2: `CLAUDE.local.md` に指示を書く | `AGENTS.md`（個人用のものは、`~/.codex/AGENTS.md`）に書く |
| M6-3: 「worktree で作業して」と頼む | 入力欄の下の **Worktree** を選ぶ |

## 未確認・未調査のこと

- Codex を、実際に操作しての動作確認（画面の表記、確認画面の見え方、`.rules` の動作）
- Codex でファイル単位の読み取りを拒否する方法の有無
- Codex の IDE 拡張・アプリの、最新の画面の名前（資料の中でも、「Ask for approval」と「Auto」「Read-only」など、画面と CLI で呼び方が異なる）
