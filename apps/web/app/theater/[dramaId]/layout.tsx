/**
 * 剧场页面专用布局
 * 使用 fixed 定位覆盖根布局的 Header/Footer，提供全屏沉浸式体验
 */
export default function TheaterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {children}
    </div>
  );
}
