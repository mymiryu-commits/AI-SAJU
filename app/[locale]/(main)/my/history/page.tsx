'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Star,
  Eye,
  Sparkles,
  Calendar,
  Download,
  Share2,
  ChevronRight,
  Heart,
  Users,
} from 'lucide-react';

// Mock history data
const mockHistory = [
  {
    id: '1',
    type: 'saju',
    title: 'Four Pillars Analysis',
    date: '2025-01-09',
    score: 85,
    status: 'completed',
    hasPdf: true,
  },
  {
    id: '2',
    type: 'face',
    title: 'Face Reading Analysis',
    date: '2025-01-08',
    score: 82,
    status: 'completed',
    hasPdf: true,
  },
  {
    id: '3',
    type: 'daily',
    title: 'Daily Fortune',
    date: '2025-01-07',
    score: 78,
    status: 'completed',
    hasPdf: false,
  },
  {
    id: '4',
    type: 'compatibility',
    title: 'Love Compatibility',
    date: '2025-01-05',
    score: 91,
    status: 'completed',
    hasPdf: true,
  },
  {
    id: '5',
    type: 'saju',
    title: 'Four Pillars Analysis',
    date: '2025-01-03',
    score: 79,
    status: 'completed',
    hasPdf: true,
  },
];

const typeIcons = {
  saju: Sparkles,
  face: Eye,
  daily: Calendar,
  compatibility: Heart,
  group: Users,
};

const typeColors = {
  saju: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  face: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  daily: 'text-green-500 bg-green-100 dark:bg-green-900/20',
  compatibility: 'text-pink-500 bg-pink-100 dark:bg-pink-900/20',
  group: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
};

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');

  const filteredHistory =
    filter === 'all'
      ? mockHistory
      : mockHistory.filter((item) => item.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Analysis History</h1>
        <p className="text-muted-foreground">
          View and manage all your past analyses
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="saju">Saju</TabsTrigger>
          <TabsTrigger value="face">Face</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first analysis to see your history here
              </p>
              <Link href="/fortune">
                <Button>Get Started</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((item) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons] || Star;
            const colorClass = typeColors[item.type as keyof typeof typeColors] || '';

            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{item.date}</span>
                          <Badge variant="outline" className="ml-2">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {item.score}
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>

                      <div className="flex gap-2">
                        {item.hasPdf && (
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Link href={`/fortune/result/${item.id}`}>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{mockHistory.length}</p>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">
                {Math.round(
                  mockHistory.reduce((acc, item) => acc + item.score, 0) /
                    mockHistory.length
                )}
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">
                {mockHistory.filter((item) => item.type === 'saju').length}
              </p>
              <p className="text-sm text-muted-foreground">Saju Analyses</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">
                {mockHistory.filter((item) => item.hasPdf).length}
              </p>
              <p className="text-sm text-muted-foreground">PDF Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
