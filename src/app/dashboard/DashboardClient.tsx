'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/hooks/useAuth';
import { useSites } from '../../lib/hooks/useSites';
import { useActivities } from '../../lib/hooks/useActivities';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { ActivityLog, ActivityStatsResponse, Site } from '../../types';

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'user_login':
      return (
        <svg
          className="lh-icon-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      );
    case 'site_created':
      return (
        <svg
          className="lh-icon-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      );
    case 'product_registered':
      return (
        <svg
          className="lh-icon-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    case 'search_performed':
      return (
        <svg
          className="lh-icon-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      );
    case 'site_updated':
      return (
        <svg
          className="lh-icon-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="lh-icon-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
};

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case 'user_login':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'site_created':
    case 'product_registered':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'search_performed':
      return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
    case 'site_updated':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

interface ActivityItemProps {
  activity: ActivityLog;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => (
  <div className="lh-flex-start p-6 hover:bg-white/5 lh-transition-colors border-b border-white/10 last:border-b-0">
    <div
      className={`flex-shrink-0 lh-icon-xl lh-icon-circle ${getActivityColor(activity.activity_type)} shadow-sm`}
    >
      {getActivityIcon(activity.activity_type)}
    </div>
    <div className="flex-1 min-w-0 ml-1">
      <p className="lh-table-cell-content font-medium">{activity.title}</p>
      {activity.description && (
        <p className="lh-text-description mt-1 text-gray-400">{activity.description}</p>
      )}
      <div className="lh-flex-icon-text mt-3">
        <span className="lh-text-small text-gray-500 font-medium">
          {formatTimeAgo(activity.created_at)}
        </span>
        {activity.site && (
          <span className="text-xs text-gray-500 ml-2">• {activity.site.name}</span>
        )}
      </div>
    </div>
  </div>
);

interface DashboardClientProps {
  initialSites?: Site[];
  initialActivities?: ActivityLog[];
  initialStats?: ActivityStatsResponse;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  initialSites = [],
  initialActivities = [],
  initialStats = {
    total_activities: 0,
    recent_activity_count: 0,
    activities_by_type: {},
  },
}) => {
  const { user } = useAuth();
  
  // Use hooks to get current data, with initial data as fallback
  const { sites } = useSites(initialSites.length > 0 ? initialSites : undefined);
  const { activities, stats, isLoading, error } = useActivities();

  // Use the most current data available
  const currentSites = sites.length > 0 ? sites : initialSites;
  const currentActivities = activities.length > 0 ? activities : initialActivities;
  const currentStats = stats || initialStats;


  const stats_data = [
    {
      name: 'Total Sites',
      value: currentSites.length.toString(),
      description: 'WordPress sites registered',
      href: '/dashboard/sites',
      action: 'Manage Sites',
      trend: `+${currentSites.length}`,
      trendUp: true,
    },
    {
      name: 'Active Products',
      value: '0', // TODO: Calculate from products data
      description: 'Lighthouse products registered',
      href: '/dashboard/products',
      action: 'View Products',
      trend: '+0%',
      trendUp: true,
    },
    {
      name: 'Recent Activities',
      value: currentStats.recent_activity_count?.toString() || '0',
      description: 'Actions in the last 30 days',
      href: '#recent-activity',
      action: 'View Details',
      trend: `+${currentStats.recent_activity_count || 0}`,
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      title: 'Add Your First Site',
      description:
        'Connect your WordPress site to get started with Lighthouse plugins.',
      href: '/dashboard/sites',
      buttonText: 'Add Site',
      color: 'dashboard-primary',
      icon: (
        <svg
          className="lh-icon-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      title: 'Explore Neural Search',
      description:
        "Learn how AI-powered search can transform your site's user experience.",
      href: '/dashboard/products',
      buttonText: 'Browse Products',
      color: 'dashboard-secondary',
      icon: (
        <svg
          className="lh-icon-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: 'AI Readiness Check',
      description:
        'Optimize your site for AI crawlers and improve search visibility.',
      href: '/dashboard/products',
      buttonText: 'Check Products',
      color: 'dashboard-success',
      icon: (
        <svg
          className="lh-icon-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="lh-page-container">
      {/* Welcome Section */}
      <div className="lh-card lh-card-content">
        <div className="lh-flex-icon-text">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl lh-flex-center" 
                 style={{ backgroundColor: 'var(--color-dashboard-accent)' }}>
              <span className="text-white text-xl">👋</span>
            </div>
          </div>
          <div>
            <h1 className="lh-title-page">Welcome, {user?.name || 'che'}!</h1>
            <p className="lh-text-description mt-1">
              Manage your WordPress sites and Lighthouse plugins from this
              dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="lh-title-section mb-6">Overview</h2>
        <div className="lh-grid-stats">
          {stats_data.map(stat => (
            <Card key={stat.name} className="lh-card-hover lh-card">
              <CardHeader className="pb-2">
                <div className="lh-flex-between">
                  <h3 className="lh-text-stat-label">{stat.name}</h3>
                  <span
                    className={`lh-badge ${
                      stat.trendUp ? 'lh-badge-green' : 'lh-badge-red'
                    }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="lh-flex-between">
                  <div>
                    <p className="lh-text-stat">{stat.value}</p>
                    <p className="lh-text-muted mt-1">{stat.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={stat.href}>
                    <Button
                      variant="outline"
                      className="w-full lh-text-link border-lighthouse-primary hover:bg-lighthouse-primary hover:text-white lh-transition font-medium"
                    >
                      {stat.action}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="lh-flex-between mb-6">
          <h2 className="lh-title-section">Quick Actions</h2>
          <p className="lh-text-muted">Get started with these common tasks</p>
        </div>
        <div className="lh-grid-cards">
          {quickActions.map(action => (
            <Card key={action.title} className="lh-card-hover group lh-card">
              <CardHeader className="pb-4">
                <div className="lh-flex-icon-text">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl lh-flex-center text-white shadow-sm group-hover:shadow-md lh-transition-shadow"
                    style={{ backgroundColor: 'var(--color-dashboard-accent)' }}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="lh-title-card lh-transition-colors">
                      {action.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="lh-text-description mb-6 leading-relaxed">
                  {action.description}
                </p>
                <Link href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full font-medium"
                  >
                    {action.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div id="recent-activity">
        <div className="lh-flex-between mb-6">
          <h2 className="lh-title-section">Recent Activity</h2>
          {currentActivities.length > 0 && (
            <Link href="/dashboard/activities">
              <Button variant="ghost" className="lh-text-link hover:bg-white/5">
                View All
              </Button>
            </Link>
          )}
        </div>

        <Card className="lh-card overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="lh-empty-state">
                <div className="lh-spinner lh-spinner-lg" />
                <p className="lh-text-description mt-4">Loading activities...</p>
              </div>
            ) : error ? (
              <div className="lh-empty-state">
                <div className="lh-empty-state-icon">
                  <svg className="lh-icon-xl text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="lh-empty-state-title text-red-400">Error loading activities</h3>
                  <p className="lh-empty-state-description">{error}</p>
                  <p className="lh-text-small text-gray-500 mt-2">Activities: {activities.length}, Stats: {stats?.recent_activity_count || 0}</p>
                </div>
              </div>
            ) : currentActivities.length > 0 ? (
              <div>
                {currentActivities.slice(0, 5).map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="lh-empty-state">
                <div className="lh-empty-state-icon">
                  <svg
                    className="lh-icon-xl text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="lh-empty-state-title">No recent activity</h3>
                  <p className="lh-empty-state-description">
                    Once you start using Lighthouse, your recent activity will
                    appear here.
                  </p>
                  <p className="lh-text-small text-gray-500 mt-2">Debug: Activities: {activities.length}, Stats: {stats?.recent_activity_count || 0}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardClient;