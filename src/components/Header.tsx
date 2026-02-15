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
              <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 p-1">
                <img 
                  src="/udsm-logo.png" 
                  alt="UDSM Coat of Arms" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-udsm-blue">
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
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-udsm-blue to-udsm-blue-light text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-udsm-gold" />
              <span>Insights</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2 className="w-4 h-4 text-udsm-blue" />
              <span className="font-medium">University of Dar es Salaam</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 text-udsm-gold" />
              <span>OJS Analytics</span>
            </div>
            <div className="live-indicator px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
