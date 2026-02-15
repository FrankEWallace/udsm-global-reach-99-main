import { Users, FileCheck, Clock, UserCheck, Pencil, BookMarked } from "lucide-react";
import { OJSEditorialStat, OJSUserStat } from "@/services/ojsApi";

interface JournalStatsProps {
  editorialStats?: OJSEditorialStat[];
  userStats?: OJSUserStat[];
  daysToDecision?: number;
  submissionsAccepted?: number;
  submissionsDeclined?: number;
}

const statIcons: Record<string, React.ReactNode> = {
  reader: <Users className="w-4 h-4" />,
  author: <Pencil className="w-4 h-4" />,
  reviewer: <UserCheck className="w-4 h-4" />,
  editor: <FileCheck className="w-4 h-4" />,
  manager: <BookMarked className="w-4 h-4" />,
};

const JournalStats = ({ editorialStats, userStats, daysToDecision, submissionsAccepted, submissionsDeclined }: JournalStatsProps) => {
  const editorial = editorialStats || [];
  const users = userStats || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editorial Statistics */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileCheck className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-xl font-semibold text-foreground">
            Editorial Statistics
          </h3>
        </div>

        {editorial.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No editorial data available</p>
            <p className="text-xs mt-1">Connect to OJS API to see editorial statistics</p>
          </div>
        ) : (
          <div className="space-y-4">
            {editorial.map((stat, idx) => (
              <div key={stat.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{stat.name}</span>
                <span className="text-sm font-semibold text-foreground">
                  {typeof stat.value === 'number' && stat.key.includes('days')
                    ? `${stat.value.toFixed(1)} days`
                    : stat.value.toLocaleString()}
                </span>
              </div>
            ))}

            {/* Acceptance rate */}
            {submissionsAccepted !== undefined && submissionsDeclined !== undefined && (submissionsAccepted + submissionsDeclined) > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Acceptance Rate</span>
                  <span className="text-sm font-bold text-green-600">
                    {((submissionsAccepted / (submissionsAccepted + submissionsDeclined)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(submissionsAccepted / (submissionsAccepted + submissionsDeclined)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Statistics */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-xl font-semibold text-foreground">
            User Statistics
          </h3>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No user data available</p>
            <p className="text-xs mt-1">Connect to OJS API to see user statistics</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user, idx) => {
              const maxVal = Math.max(...users.map(u => u.value), 1);
              return (
                <div key={user.key} className="animate-fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{statIcons[user.key] || <Users className="w-4 h-4" />}</span>
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{user.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(user.value / maxVal) * 100}%`,
                        background: "linear-gradient(90deg, hsl(var(--udsm-blue-light)), hsl(var(--udsm-blue)))",
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Users</span>
              <span className="text-lg font-bold text-primary">
                {users.reduce((s, u) => s + u.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalStats;
