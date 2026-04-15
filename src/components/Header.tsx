/**
 * Header.tsx
 * アプリタイトル・ロゴ
 * - アプリ名「🐱 ねこごはん判定器」を表示
 * - 動物番組風フォント・ポップなデザイン
 */

export function Header() {
  return (
    <header className="bg-primary py-4 px-4 text-center shadow-md">
      <h1 className="text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
        🐱 ねこごはん判定器
      </h1>
      <p className="text-sm text-white/80 mt-1">
        カメラで撮って、猫が食べて大丈夫かチェック！
      </p>
    </header>
  )
}
