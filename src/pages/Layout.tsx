import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    Trophy,
    Users,
    Settings,
    Crown,
    Shield,
    type LucideIcon,
} from "lucide-react";
import {createPageUrl} from "@/utils";
import {User} from "@/api/auth";

type LayoutProps = {
    children: React.ReactNode;
    currentPageName?: string;
};

type AuthUser = {
    full_name: string;
    role?: "admin" | "user";
};

type NavigationItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    public: boolean;
};

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await User.me();
                setUser(userData as AuthUser);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const isAdmin = user?.role === "admin";

    const navigationItems: NavigationItem[] = [
        {
            title: "Leaderboard",
            url: createPageUrl("Leaderboard"),
            icon: Trophy,
            public: true,
        },
        {
            title: "Players",
            url: createPageUrl("Players"),
            icon: Users,
            public: true,
        },
        ...(isAdmin
            ? [
                {
                    title: "Admin",
                    url: createPageUrl("Admin"),
                    icon: Shield,
                    public: false,
                } as NavigationItem,
            ]
            : []),
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <style>{`
        :root {
          --gaming-purple: #8b5cf6;
          --gaming-gold: #fbbf24;
          --gaming-cyan: #06b6d4;
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
        }
        
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
        
        .gold-glow {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.7); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-50">
                <div className="glass-card border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse-glow">
                                        <Crown className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                                        iGaming Leaderboard
                                    </h1>
                                    <p className="text-sm text-gray-400">Elite Gaming Championship</p>
                                </div>
                            </div>

                            <nav className="hidden md:flex space-x-6">
                                {navigationItems.map((item) => {
                                    const ActiveIcon = item.icon;
                                    const active = location.pathname === item.url;
                                    return (
                                        <Link
                                            key={item.title}
                                            to={item.url}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                                active
                                                    ? "glass-card text-white neon-glow"
                                                    : "text-gray-300 hover:text-white hover:glass-card"
                                            }`}
                                        >
                                            <ActiveIcon className="w-5 h-5" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="flex items-center space-x-4">
                                {loading ? (
                                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                                ) : user ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="glass-card px-3 py-2 rounded-lg">
                      <span className="text-sm text-white font-medium">
                        {user.full_name}
                      </span>
                                            {isAdmin && (
                                                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                          ADMIN
                        </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => User.logout()}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            aria-label="Logout"
                                        >
                                            <Settings className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => navigate("/Login")}
                                        className="glass-card px-6 py-2 rounded-lg text-white font-medium hover:neon-glow transition-all duration-300"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="glass-card border-t border-white/20">
                    <div className="flex justify-around py-2">
                        {navigationItems.map((item) => {
                            const ActiveIcon = item.icon;
                            const active = location.pathname === item.url;
                            return (
                                <Link
                                    key={item.title}
                                    to={item.url}
                                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-300 ${
                                        active ? "text-purple-400" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <ActiveIcon className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">{item.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 pb-20 md:pb-8">{children}</main>
        </div>
    );
}
