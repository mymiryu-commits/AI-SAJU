import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";
import { execSync } from 'child_process';

const withNextIntl = createNextIntlPlugin();

// Git 커밋 정보 가져오기
function getGitInfo() {
  try {
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const commitDate = execSync('git log -1 --format=%cd --date=format:%Y.%m.%d').toString().trim();
    return { commitHash, commitDate };
  } catch {
    return { commitHash: 'dev', commitDate: new Date().toISOString().split('T')[0].replace(/-/g, '.') };
  }
}

const gitInfo = getGitInfo();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_COMMIT_HASH: gitInfo.commitHash,
    NEXT_PUBLIC_COMMIT_DATE: gitInfo.commitDate,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default withNextIntl(nextConfig);
