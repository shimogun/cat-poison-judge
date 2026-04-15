# PIPELINE.md — 開発フロー定義

## 全体フロー

```
STEP 0  プロジェクト初期化
  ↓
[承認①] ディレクトリ構造・package.json 確認
  ↓
STEP 1  骨格作成（型・定数・コンポーネント空ファイル）
  ↓
[承認②] コンポーネント構成確認
  ↓
STEP 2  型定義・定数・アニメーション定数（Fork）
  ├── 2-A: judgment.ts
  ├── 2-B: catFoodPrompt.ts
  └── 2-C: animations.ts
（Join: 全完了後に次へ）
  ↓
STEP 3  カスタムフック実装
  ├── useCamera.ts
  └── useVisionJudge.ts
  ↓
STEP 4  UIコンポーネント実装
  ↓
STEP 5  App.tsx 統合
  ↓
STEP 6  動作確認（4シナリオ）
  ↓
[承認③] 完了確認
```

---

## 承認ポイント詳細

| # | タイミング | 確認内容 | NGの場合 |
|---|-----------|---------|---------|
| ① | STEP0完了後 | ディレクトリ・.env.example・.gitignore | STEP0やり直し |
| ② | STEP1完了後 | ファイル構成・役割コメントの正確さ | STEP1修正後に進む |
| ③ | STEP6完了後 | 4シナリオの手動確認結果 | 失敗シナリオのSTEPに戻る |

---

## エラー時の振る舞い

| 状況 | 対応 |
|------|------|
| `npm install` 失敗 | エラー全文を報告してSTOP |
| TypeScript エラー発生 | 修正してから次STEPへ（エラー残存で進まない） |
| APIレスポンスがJSONでない | `unknown` 判定として処理・エラーは握り潰さない |
| カメラ取得失敗（動作確認時） | エラー種別とコンソール内容を報告してSTOP |

---

## 各STEPの成果物

| STEP | 成果物 |
|------|--------|
| STEP0 | package.json・tailwind設定・.env.example・.gitignore |
| STEP1 | 全骨格ファイル（役割コメント付き・実装なし） |
| STEP2 | judgment.ts・catFoodPrompt.ts・animations.ts |
| STEP3 | useCamera.ts・useVisionJudge.ts（実装済み） |
| STEP4 | 全UIコンポーネント（実装済み） |
| STEP5 | App.tsx（統合済み・起動可能な状態） |
| STEP6 | 動作確認レポート（4シナリオの結果） |
