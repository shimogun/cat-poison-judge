/**
 * Header.tsx
 * アプリタイトル・ロゴ
 * - アプリ名「🐱 ねこごはん判定器」を表示
 * - 動物番組風フォント・ポップなデザイン
 */

export function Header() {
  return (
    <header className="bg-primary h-14 px-4 sm:px-8 flex items-center justify-center border-b border-border">
      <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-white drop-shadow-md tracking-wide">
        <span className="inline-block animate-bounce">🐱</span>
        {' '}ねこごはん判定器
      </h1>
    </header>
  )
}
