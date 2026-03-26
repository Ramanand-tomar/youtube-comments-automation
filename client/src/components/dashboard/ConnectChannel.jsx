import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";

export default function ConnectChannel() {
  const { user, login, logout } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async () => {
    setSigningIn(true);
    try {
      await login();
    } catch {
      setSigningIn(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-warm-border p-8 sm:p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative">
        <Link
          to="/"
          className="absolute top-5 left-5 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-text-muted hover:text-brand transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-7 h-7 text-brand" />
        </div>
        <h2 className="text-[1.5rem] font-bold text-text-primary mb-3">Connect Your YouTube Channel</h2>
        <p className="text-text-secondary text-[0.9375rem] mb-8 max-w-md mx-auto leading-relaxed">
          Sign in with your Google account to link your YouTube channel and start automating comment replies.
        </p>
        <button
          onClick={handleLogin}
          disabled={signingIn}
          className="inline-flex items-center gap-3 bg-white border-2 border-warm-border px-8 py-3.5 rounded-full text-[0.9375rem] font-semibold hover:border-brand hover:shadow-[0_4px_12px_rgba(80,62,189,0.15)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {signingIn ? (
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {signingIn ? "Redirecting..." : "Sign in with Google"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-warm-border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-11 h-11 rounded-full ring-2 ring-brand-bg-deep" />
          ) : (
            <div className="w-11 h-11 bg-brand-bg rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-brand" />
            </div>
          )}
          <div>
            <p className="text-[0.9375rem] font-semibold text-text-primary">{user.name}</p>
            <p className="text-[0.8125rem] text-text-muted">{user.channelName || user.email}</p>
          </div>
          <span className="bg-success-bg text-success text-[0.6875rem] font-semibold px-3 py-1 rounded-full">Connected</span>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-[0.8125rem] text-text-muted hover:text-yt-red transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
}
