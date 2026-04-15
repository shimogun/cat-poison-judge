/**
 * Header.tsx
 * アプリタイトル・ロゴ
 * - ピンク背景に装飾円
 * - 大きな猫絵文字 + タイトル + サブテキスト
 */

export function Header() {
  return (
    <header className="relative w-full bg-pink px-5 sm:px-8 pt-4 pb-5 text-center overflow-hidden shrink-0">
      <div className="absolute -top-10 -right-10 w-[140px] h-[140px] rounded-full bg-white/15" />
      <div className="absolute -bottom-[50px] -left-[30px] w-[120px] h-[120px] rounded-full bg-white/10" />

      <div className="relative z-10">
        <span className="text-[40px] leading-none block mb-1.5">🐱</span>
        <h1 className="text-[22px] font-bold text-white tracking-wide">
          ねこごはん判定器
        </h1>
        <p className="text-[13px] text-white/85 mt-1">
          写真を撮って、猫に安全か調べよう
        </p>
      </div>
    </header>
  )
}
