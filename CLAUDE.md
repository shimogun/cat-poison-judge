# CLAUDE.md — 猫ごはん判定アプリ 実装指示書

## プロジェクト概要
カメラで撮影したものが「猫が食べて安全か危険か」を
Claude Haiku 4.5 Vision APIで判定し、理由とともに表示するSPA。
Vite + React (TypeScript) + Framer Motion + Tailwind CSS。
バックエンドサーバーなし。Vite devServerのproxyでAPIキーを保護。

## 技術スタック
- Vite + React 18 (TypeScript, strict)
- Framer Motion
- Tailwind CSS
- Anthropic SDK (@anthropic-ai/sdk)
- APIキー管理: .env (VITE_ANTHROPIC_API_KEY)

---

## 実装ステップ

### STEP 0：プロジェクト初期化
- `npm create vite@latest` で React + TypeScript プロジェクト作成
- 依存パッケージをインストール:
  `framer-motion` `tailwindcss` `@anthropic-ai/sdk`
- Tailwind CSS 初期設定（tailwind.config.js, index.css）
- `.env.example` を作成（`VITE_ANTHROPIC_API_KEY=your_key_here`）
- `.gitignore` に `.env` が含まれていることを確認
- `docs/SKILL.md` `docs/PIPELINE.md` を配置
- 完了後、ディレクトリ構造とpackage.jsonをオーナーに報告

> ⚠️ 承認ポイント①：構成確認後に次へ進む

---

### STEP 1：型定義・定数・コンポーネント骨格の作成
以下を空の骨格として作成（実装はしない）:
```
src/
  components/
    CameraView.tsx       # カメラ映像 + 撮影ボタン
    ResultCard.tsx       # 判定結果カード（アニメーション付き）
    LoadingOverlay.tsx   # 分析中オーバーレイ
    Header.tsx           # アプリタイトル・ロゴ
  hooks/
    useCamera.ts         # カメラ制御・撮影ロジック
    useVisionJudge.ts    # Haiku 4.5 Vision API呼び出し
  constants/
    catFoodPrompt.ts     # 判定用システムプロンプト
    animations.ts        # Framer Motion アニメーション定数
  types/
    judgment.ts          # 型定義
  App.tsx
```
各ファイルに役割コメントを必ず記載する。実装は一切しない。

> ⚠️ 承認ポイント②：コンポーネント構成確認後に次へ進む

---

### STEP 2：型定義・定数の実装（SubAgent並列可）

#### 2-A: src/types/judgment.ts
```typescript
export type Safety = 'safe' | 'dangerous' | 'caution' | 'unknown'
export type AppState = 'idle' | 'capturing' | 'analyzing' | 'result' | 'error'

export interface JudgmentResult {
  safety: Safety
  itemName: string       // 撮影されたものの名前（日本語）
  reason: string         // 判定理由（日本語・1〜2文）
  confidence: 'high' | 'medium' | 'low'
}
```

#### 2-B: src/constants/catFoodPrompt.ts
システムプロンプトを定義する。以下の内容を含めること:
- あなたは猫の健康管理の専門家
- 画像に写っているものを特定し、猫が食べて安全か判定する
- 必ずJSON形式のみで返答する（他のテキスト不可）
- JSON schema: `{ safety, itemName, reason, confidence }`
- safety の値: "safe"=安全, "dangerous"=危険, "caution"=要注意, "unknown"=判定不能

#### 2-C: src/constants/animations.ts
Framer Motion のアニメーション定数をすべてここに定義する:
- `shutterAnimation`: 撮影ボタンクリック時（scale pulse）
- `resultCardAnimation`: 結果カードのスライドイン
- `staggerContainer`: 子要素の順次表示
- `loadingSpinAnimation`: ローディングアイコンの回転

SubAgent並列実行条件: 2-A / 2-B / 2-C は互いに独立。同時実行可。

---

### STEP 3：カスタムフック実装

#### useCamera.ts
- `getUserMedia({ video: { facingMode: 'environment' } })` でカメラ起動
- video ref と canvas ref を管理
- `captureImage()`: canvas に描画し base64(jpeg, quality=0.8) を返す
- エラー種別を区別: `NotAllowedError` / `NotFoundError` / その他
- cleanup: コンポーネントアンマウント時にストリームを停止

#### useVisionJudge.ts
- `@anthropic-ai/sdk` を使用
- 引数: base64画像文字列
- Haiku 4.5 (`claude-haiku-4-5-20251001`) を使用
- max_tokens: 300
- レスポンスのJSONをパースして `JudgmentResult` 型に変換
- パース失敗時は safety: 'unknown' を返す（例外を握り潰さない）

---

### STEP 4：UIコンポーネント実装

#### デザイントークン（Tailwind config に追加）
```
primary:   #F5C842  （メインイエロー）
secondary: #FF6B9D  （ピンク）
accent:    #4CAF50  （グリーン）
danger:    #FF4444  （レッド）
caution:   #FF9800  （オレンジ）
bg:        #FFF9E6  （クリームホワイト）
```

#### CameraView.tsx
- video タグでカメラ映像をライブ表示
- 撮影ボタン: `shutterAnimation` を適用、クリック時に pulse エフェクト
- ボタンデザイン: 丸型・ピンク背景・カメラアイコン

#### ResultCard.tsx
- safety の値に応じて背景色を切り替える:
  - safe → accent（緑）
  - dangerous → danger（赤）
  - caution → caution（オレンジ）
  - unknown → gray
- `resultCardAnimation` でスライドイン表示
- 表示内容: 判定アイコン（✅/❌/⚠️/❓）+ itemName + reason + confidence

#### LoadingOverlay.tsx
- カメラ映像の上に半透明オーバーレイ
- 肉球アイコン（🐾）が `loadingSpinAnimation` で回転
- 「判定中...」テキスト表示

#### Header.tsx
- アプリ名「🐱 ねこごはん判定器」
- 動物番組風フォント・ポップなデザイン

---

### STEP 5：App.tsx で統合
- AppState に従ってコンポーネントを切り替える:
  - idle: CameraView（待機）
  - capturing: CameraView（撮影エフェクト中）
  - analyzing: CameraView + LoadingOverlay
  - result: ResultCard + 「もう一度」ボタン
  - error: エラーメッセージ + 「再試行」ボタン
- useCamera と useVisionJudge を接続

---

### STEP 6：動作確認・品質チェック
- `npm run build` で TypeScript エラー0件を確認
- 以下4シナリオを手動確認してオーナーに報告:
  1. カメラ権限拒否 → エラー表示（クラッシュしない）
  2. 安全な食べ物（例：鶏肉）→ safe 判定
  3. 危険な食べ物（例：チョコレート）→ dangerous 判定
  4. 食べ物以外（例：本）→ unknown 判定

> ⚠️ 承認ポイント③：4シナリオ確認後に完了とする

---

## 禁止事項
- 承認なしに次のSTEPへ進まない
- 指示にないライブラリを追加しない
- `.env` をコミットしない・APIキーをコードにハードコードしない
- `any` 型を使用しない
- エラーを console.log のみで処理しない
- 既存ファイルを無断で上書きしない
- APIレスポンスのJSONパースを try/catch なしで行わない

## SubAgent 利用条件
STEP 2（2-A / 2-B / 2-C）のみ並列実行可。
共有状態なし・互いに依存なし・成果物がファイル単位で独立。
それ以外のSTEPは順次実行。
