'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Users,
  Coins,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  RefreshCw,
  Plus,
  Minus,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  createdAt: string;
  lastSignIn: string | null;
  isAdmin: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [grantingUserId, setGrantingUserId] = useState<string | null>(null);
  const [grantAmount, setGrantAmount] = useState<{ [key: string]: number }>({});

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setMessage({ type: 'error', text: data.error || '회원 목록을 불러올 수 없습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '회원 목록 조회 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleGrantPoints = async (userId: string, points: number) => {
    if (points === 0) return;

    setGrantingUserId(userId);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        // 목록 새로고침
        await fetchUsers();
        // 입력 초기화
        setGrantAmount(prev => ({ ...prev, [userId]: 0 }));
      } else {
        setMessage({ type: 'error', text: data.error || '포인트 부여 실패' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '포인트 부여 중 오류가 발생했습니다.' });
    } finally {
      setGrantingUserId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">회원 관리</h1>
              <p className="text-muted-foreground text-sm">
                총 {users.length}명의 회원
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="이메일 또는 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-muted-foreground">회원</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-muted-foreground">이메일</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-muted-foreground">포인트</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-muted-foreground">가입일</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-muted-foreground">최근 접속</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-muted-foreground">포인트 부여</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{user.name}</span>
                        {user.isAdmin && (
                          <Crown className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                        user.points > 0
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}>
                        <Coins className="h-3 w-3" />
                        {user.points.toLocaleString()}P
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-muted-foreground">
                      {formatDate(user.lastSignIn)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setGrantAmount(prev => ({
                              ...prev,
                              [user.id]: (prev[user.id] || 0) - 1000
                            }))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <input
                            type="number"
                            value={grantAmount[user.id] || 0}
                            onChange={(e) => setGrantAmount(prev => ({
                              ...prev,
                              [user.id]: parseInt(e.target.value) || 0
                            }))}
                            className="w-20 h-8 px-2 text-center text-sm border border-border rounded-lg bg-background"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setGrantAmount(prev => ({
                              ...prev,
                              [user.id]: (prev[user.id] || 0) + 1000
                            }))}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleGrantPoints(user.id, grantAmount[user.id] || 0)}
                          disabled={grantingUserId === user.id || (grantAmount[user.id] || 0) === 0}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        >
                          {grantingUserId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            '부여'
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'}
            </div>
          )}
        </div>

        {/* Quick Grant Presets */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">포인트 부여 안내</h3>
          <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
            <li>• +/- 버튼으로 1,000P 단위로 조절하거나 직접 입력 가능</li>
            <li>• 음수 입력 시 포인트 차감</li>
            <li>• 포인트 부여 이력은 자동으로 기록됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
