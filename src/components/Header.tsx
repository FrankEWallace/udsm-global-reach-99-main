import { BookOpen, Globe2, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[hsl(210,100%,20%)] shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-[hsl(210,100%,20%)]">
                  UDSM <span className="text-gradient-gold">Journals</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">
                  Global Readership Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <Link
              to="/insights"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[hsl(210,100%,20%)] to-[hsl(210,70%,30%)] text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-[hsl(42,100%,65%)]" />
              <span>Insights</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2 className="w-4 h-4 text-[hsl(210,100%,20%)]" />
              <span className="font-medium">University of Dar es Salaam</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 text-[hsl(42,100%,50%)]" />
              <span>OJS Analytics</span>
            </div>
            <div className="live-indicator px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
