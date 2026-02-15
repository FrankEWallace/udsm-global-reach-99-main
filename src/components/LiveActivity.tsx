import { useEffect, useState } from "react";
import { Globe, Clock, Download, Eye, Quote, FileText } from "lucide-react";
import { ActivityItem } from "@/services/ojsApi";

interface Activity {
  id: string;
  paper: string;
  authors: string;
  time: string;
  type: 'download' | 'view' | 'citation';
  abstractViews: number;
  pdfViews: number;
}

interface LiveActivityProps {
  activities?: ActivityItem[];
}

const LiveActivity = ({ activities: apiActivities }: LiveActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (apiActivities && apiActivities.length > 0) {
      const converted = apiActivities.map((activity) => {
        const now = new Date();
        const diff = now.getTime() - activity.timestamp.getTime();
        const min = Math.floor(diff / 60_000);
        const hrs = Math.floor(min / 60);

        let timeStr = "Just now";
        if (hrs > 0) timeStr = `${hrs}h ago`;
        else if (min > 0) timeStr = `${min}m ago`;

        return {
          id: activity.id,
          paper: activity.title,
          authors: activity.authors,
          time: timeStr,
          type: activity.type,
          abstractViews: activity.abstractViews,
          pdfViews: activity.pdfViews,
        };
      });
      setActivities(converted.slice(0, 6));
    } else {
      setActivities([]);
    }
  }, [apiActivities]);

  const getActivityIcon = (type: 'download' | 'view' | 'citation') => {
    switch (type) {
      case 'download': return <Download className="w-3.5 h-3.5" />;
      case 'view': return <Eye className="w-3.5 h-3.5" />;
      case 'citation': return <Quote className="w-3.5 h-3.5" />;
    }
  };

  const getTypeColor = (type: 'download' | 'view' | 'citation') => {
    switch (type) {
      case 'download': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'view': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'citation': return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[hsl(210,100%,20%)]" />
          <h3 className="font-display text-xl font-semibold text-foreground">
            Recent Publications
          </h3>
        </div>
        <div className="live-indicator">
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-3 overflow-hidden">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No activity data available</p>
            <p className="text-xs mt-1">Connect to OJS API to see live activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className="activity-item animate-slide-in-right"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.paper}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.authors}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getTypeColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                    {activity.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{activity.abstractViews} views</span>
                  <span className="text-xs text-muted-foreground">{activity.pdfViews} downloads</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {activity.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveActivity;
