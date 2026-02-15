import { TrendingUp, BarChart3, Eye, Download } from "lucide-react";
import { TopPublication } from "@/services/ojsApi";

interface TopCountriesProps {
  publications?: TopPublication[];
}

const TopCountries = ({ publications }: TopCountriesProps) => {
  const items = publications || [];
  // Calculate total views for bar width calculation
  const maxViews = Math.max(...items.map((p) => (p.abstractViews || 0) + (p.galleyViews || 0)), 1);

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[hsl(210,100%,20%)]" />
          <h3 className="font-display text-xl font-semibold text-foreground">
            Top Publications
          </h3>
        </div>
        <TrendingUp className="w-5 h-5 text-[hsl(42,100%,50%)]" />
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No publication data available</p>
            <p className="text-xs mt-1">Connect to OJS API to see top publications</p>
          </div>
        ) : (
          items.slice(0, 6).map((pub, index) => {
            const totalViews = (pub.abstractViews || 0) + (pub.galleyViews || 0);
            return (
              <div
                key={pub.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-1.5 gap-4">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="text-xs font-bold text-[hsl(210,100%,20%)] bg-[hsl(210,100%,20%,0.08)] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{pub.title}</p>
                      {pub.authors && (
                        <p className="text-xs text-muted-foreground">{pub.authors}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-foreground">{totalViews.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">total views</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1" title="Abstract Views">
                        <Eye className="w-3 h-3" />
                        {(pub.abstractViews || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1" title="Downloads">
                        <Download className="w-3 h-3" />
                        {(pub.galleyViews || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden ml-8">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(totalViews / maxViews) * 100}%`,
                      background: index === 0
                        ? "linear-gradient(90deg, hsl(var(--udsm-gold)) 0%, hsl(var(--udsm-gold-light)) 100%)"
                        : "linear-gradient(90deg, hsl(var(--udsm-blue-light)) 0%, hsl(var(--heat-low)) 100%)",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopCountries;
