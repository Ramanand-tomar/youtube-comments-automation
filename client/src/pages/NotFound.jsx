import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 relative">
          <h1 className="text-[12rem] font-black text-orange-600/10 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-orange-100 border border-orange-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">Page Not Found</h2>
              <p className="text-neutral-500 text-sm">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md shadow-orange-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white text-orange-700 font-semibold px-8 py-3 rounded-xl border border-orange-200 hover:bg-orange-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
