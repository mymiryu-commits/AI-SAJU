import { Link } from '@/i18n/routing';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 fortune-gradient p-12 flex-col justify-between text-white">
        <Link href="/" className="text-2xl font-bold">
          AI 수익화
        </Link>
        <div>
          <h1 className="text-4xl font-bold mb-4">
            AI Tools Ranking & AI Fortune
          </h1>
          <p className="text-white/80 text-lg">
            Discover the best AI tools and unlock insights about your destiny
            with our AI-powered fortune services.
          </p>
        </div>
        <p className="text-white/60 text-sm">
          © 2025 AI 수익화. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
