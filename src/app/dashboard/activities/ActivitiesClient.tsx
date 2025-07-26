'use client';

import React, { useState } from 'react';
import { useActivities } from '../../../lib/hooks/useActivities';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { ActivityLog } from '../../../types';

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
        <svg className="lh-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      );
    case 'site_created':
      return (
        <svg className="lh-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    case 'product_registered':
      return (
        <svg className="lh-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'search_performed':
      return (
        <svg className="lh-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'site_updated':
      return (
        <svg className="lh-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    default:
      return (
        <svg className="lh-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    <div className={`flex-shrink-0 lh-icon-xl lh-icon-circle ${getActivityColor(activity.activity_type)} shadow-sm`}>
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

const ActivitiesClient: React.FC = () => {
  const { activities, isLoading, hasMore, loadMore, stats } = useActivities();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await loadMore();
    setIsLoadingMore(false);
  };

  return (
    <div className="lh-page-container">
      {/* Header */}
      <div className="lh-flex-between mb-8">
        <div>
          <h1 className="lh-title-page">Activity Log</h1>
          <p className="lh-text-description mt-2">
            View all your recent activities and system events
          </p>
        </div>
        {stats && (
          <div className="text-right">
            <p className="lh-text-small text-gray-500">Total Activities</p>
            <p className="lh-text-stat text-lighthouse-primary">{stats.total_activities}</p>
          </div>
        )}
      </div>

      {/* Activities List */}
      <Card className="lh-card overflow-hidden">
        <CardContent className="p-0">
          {isLoading && activities.length === 0 ? (
            <div className="lh-empty-state">
              <div className="lh-spinner lh-spinner-lg" />
              <p className="lh-text-description mt-4">Loading activities...</p>
            </div>
          ) : activities.length > 0 ? (
            <>
              <div>
                {activities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              
              {hasMore && (
                <div className="p-6 border-t border-white/10 text-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    className="lh-text-link border-lighthouse-primary hover:bg-lighthouse-primary hover:text-white lh-transition font-medium"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="lh-spinner lh-spinner-sm mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="lh-empty-state">
              <div className="lh-empty-state-icon">
                <svg className="lh-icon-xl text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="lh-empty-state-title">No activities found</h3>
                <p className="lh-empty-state-description">
                  Once you start using Lighthouse, your activities will appear here.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesClient;