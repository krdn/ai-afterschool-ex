import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI AfterSchool",
  description: "AI 학원 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
