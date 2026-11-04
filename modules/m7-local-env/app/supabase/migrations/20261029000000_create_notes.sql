-- M7: 最初のマイグレーション。メモ（notes）テーブルを作る。
--
-- マイグレーションは「データベースの形の変更履歴」。ファイル名の先頭の数字（日時）の順に、
-- 1回ずつ適用される。一度どこかの環境に適用したファイルは、書き換えない（M7 演習4）。

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  body text not null default '',
  created_at timestamptz not null default now()
);

-- Row Level Security（RLS）を有効にする。
-- 有効にすると、ポリシー（許可のルール）で許された行だけが見える。ポリシーが無ければ、誰にも見えない。
-- RLS の詳しい扱いは M9 で行う。
alter table public.notes enable row level security;

-- 練習用: 誰でも（ログインしていなくても）読めるようにする。
create policy "notes are readable by everyone"
  on public.notes
  for select
  using (true);
