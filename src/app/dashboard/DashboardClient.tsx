'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/hooks/useAuth';
import { useSites } from '../../lib/hooks/useSites';
import { useActivities } from '../../lib/hooks/useActivities';
import { useLicenses } from '../../lib/hooks/useLicenses';
import { Card, CardContent } from '../../components/ui/Card';
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


interface ActivityItemProps {
  activity: ActivityLog;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIconClass = (activityType: string) => {
    switch (activityType) {
      case 'user_login':
        return 'lh-activity-icon-login';
      case 'site_created':
      case 'product_registered':
        return 'lh-activity-icon-site';
      case 'search_performed':
        return 'lh-activity-icon-search';
      case 'site_updated':
        return 'lh-activity-icon-update';
      default:
        return 'lh-activity-icon-default';
    }
  };

  return (
    <div className="lh-activity-item">
      <div className={`lh-activity-icon ${getActivityIconClass(activity.activity_type)}`}>
        {getActivityIcon(activity.activity_type)}
      </div>
      <div className="lh-activity-content">
        <p className="lh-activity-title">{activity.title}</p>
        {activity.description && (
          <p className="lh-activity-description">{activity.description}</p>
        )}
        <div className="lh-activity-meta">
          <span className="font-medium">
            {formatTimeAgo(activity.created_at)}
          </span>
          {activity.site && (
            <span>• {activity.site.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const { user, prefetchedSites } = useAuth();
  
  // Use hooks to get current data, with initial data as fallback
  const { sites, isLoading: sitesLoading } = useSites(initialSites.length > 0 ? initialSites : undefined);
  const { activities, stats, isLoading: activitiesLoading, error } = useActivities();
  const { licenses, isLoading: licensesLoading } = useLicenses();

  // Use the most current data available - prioritize prefetched data
  const currentSites = prefetchedSites || (sites.length > 0 ? sites : initialSites);
  const currentActivities = activities.length > 0 ? activities : initialActivities;
  const currentStats = stats || initialStats;
  
  // Calculate active products (assigned licenses)
  const activeProducts = licenses.filter(license => 
    license.status === 'active' && license.metadata?.assigned_site_id
  ).length;
  
  // Determine if we should show loading state for stats
  const isStatsLoading = (sitesLoading && !prefetchedSites) || activitiesLoading || licensesLoading;


  const stats_data = [
    {
      name: 'Total Sites',
      value: isStatsLoading ? '—' : currentSites.length.toString(),
      description: 'WordPress sites registered',
      href: '/dashboard/sites',
      action: 'Manage Sites',
      trend: isStatsLoading ? '...' : `+${currentSites.length}`,
      trendUp: true,
      isLoading: isStatsLoading,
    },
    {
      name: 'Active Products',
      value: isStatsLoading ? '—' : activeProducts.toString(),
      description: 'Lighthouse products assigned',
      href: '/dashboard/products',
      action: 'View Products',
      trend: isStatsLoading ? '...' : `+${activeProducts}`,
      trendUp: true,
      isLoading: isStatsLoading,
    },
    {
      name: 'Recent Activities',
      value: isStatsLoading ? '—' : (currentStats.recent_activity_count?.toString() || '0'),
      description: 'Actions in the last 30 days',
      href: '#recent-activity',
      action: 'View Details',
      trend: isStatsLoading ? '...' : `+${currentStats.recent_activity_count || 0}`,
      trendUp: true,
      isLoading: isStatsLoading,
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
      <div className="lh-welcome-section lh-section-spacing">
        <div className="lh-flex-icon-text">
          <div className="lh-welcome-icon-container">
            <span className="text-white text-xl">👋</span>
          </div>
          <div className="lh-welcome-content">
            <h1 className="lh-title-page lh-no-spacing">Welcome, {user?.name || 'che'}!</h1>
            <p className="lh-text-description lh-element-spacing-sm">
              Manage your WordPress sites and Lighthouse plugins from this
              dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="lh-section-spacing">
        <h2 className="lh-title-section lh-element-spacing">Overview</h2>
        <div className="lh-grid-stats">
          {stats_data.map(stat => (
            <div key={stat.name} className="lh-stat-card">
              <div className="lh-stat-card-header">
                <div className="lh-flex-between">
                  <h3 className="lh-text-stat-label">{stat.name}</h3>
                  <span
                    className={`lh-stat-trend-badge ${
                      !stat.trendUp ? 'lh-stat-trend-badge-negative' : ''
                    } ${stat.isLoading ? 'animate-pulse' : ''}`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="lh-stat-card-content">
                <div className="lh-flex-between">
                  <div>
                    <p className={`lh-text-stat ${stat.isLoading ? 'animate-pulse' : ''}`}>
                      {stat.value}
                    </p>
                    <p className="lh-text-muted">{stat.description}</p>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <Link href={stat.href}>
                    <button
                      className="lh-btn lh-btn-outline lh-btn-full-width"
                      disabled={stat.isLoading}
                    >
                      {stat.action}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="lh-section-spacing">
        <div className="lh-flex-between lh-element-spacing">
          <h2 className="lh-title-section lh-no-spacing">Quick Actions</h2>
          <p className="lh-text-muted lh-no-spacing">Get started with these common tasks</p>
        </div>
        <div className="lh-grid-cards">
          {quickActions.map(action => (
            <div key={action.title} className="lh-quick-action-card">
              <div className="lh-quick-action-header">
                <div className="lh-flex-icon-text">
                  <div className="lh-quick-action-icon-container" style={{ backgroundColor: 'var(--color-dashboard-accent)' }}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="lh-title-card">
                      {action.title}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="lh-quick-action-content">
                <p className="lh-quick-action-description">
                  {action.description}
                </p>
                <Link href={action.href}>
                  <button className="lh-btn lh-btn-outline lh-btn-full-width">
                    {action.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div id="recent-activity" className="lh-section-spacing">
        <div className="lh-flex-between lh-element-spacing">
          <h2 className="lh-title-section lh-no-spacing">Recent Activity</h2>
          {currentActivities.length > 0 && (
            <Link href="/dashboard/activities">
              <button className="lh-btn lh-btn-ghost lh-btn-sm">
                View All
              </button>
            </Link>
          )}
        </div>

        <Card className="lh-card overflow-hidden">
          <CardContent className="p-0">
            {activitiesLoading ? (
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