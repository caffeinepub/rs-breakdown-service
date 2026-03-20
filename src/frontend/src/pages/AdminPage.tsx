import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetRequests,
  useIsAdmin,
  useUpdateStatus,
} from "@/hooks/useQueries";
import type { ServiceRequest } from "@/hooks/useQueries";
import {
  Clock,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  Truck,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_OPTIONS = ["Pending", "Accepted", "Completed"];

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    case "accepted":
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/40";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function RequestCard({ req }: { req: ServiceRequest }) {
  const updateStatus = useUpdateStatus();

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black uppercase text-foreground text-base">
            {req.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">
              {formatTimestamp(req.timestamp)}
            </span>
          </div>
        </div>
        <Badge
          className={`border font-bold uppercase text-xs px-2.5 py-1 ${statusStyle(req.status)}`}
        >
          {req.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
          <a
            href={`tel:${req.phone}`}
            className="text-foreground hover:text-primary transition-colors truncate"
          >
            {req.phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-foreground font-bold">{req.service}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-muted-foreground truncate">{req.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
        <span className="text-primary font-black text-xl">{req.price}</span>
        <Select
          value={req.status}
          onValueChange={(val) =>
            updateStatus.mutate({ id: req.id, status: val })
          }
        >
          <SelectTrigger
            data-ocid="admin.select"
            className="w-40 h-10 bg-secondary border-border text-foreground text-sm font-bold"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="font-bold">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: requests, isLoading, refetch } = useGetRequests(true);

  const pending =
    requests?.filter((r) => r.status.toLowerCase() === "pending").length ?? 0;
  const accepted =
    requests?.filter((r) => r.status.toLowerCase() === "accepted").length ?? 0;
  const completed =
    requests?.filter((r) => r.status.toLowerCase() === "completed").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: pending, color: "text-yellow-400" },
          { label: "Accepted", value: accepted, color: "text-blue-400" },
          { label: "Completed", value: completed, color: "text-green-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 text-center"
          >
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-muted-foreground text-xs uppercase font-bold mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black uppercase text-foreground">
          All Requests
          {requests && (
            <span className="text-muted-foreground font-normal ml-2 text-sm">
              ({requests.length})
            </span>
          )}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          data-ocid="admin.secondary_button"
          className="border-border text-foreground hover:text-primary"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="admin.loading_state"
          className="text-center py-12 text-muted-foreground"
        >
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          Loading requests...
        </div>
      ) : requests?.length === 0 ? (
        <div
          data-ocid="admin.empty_state"
          className="bg-card border border-dashed border-border rounded-xl p-12 text-center"
        >
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-bold">No requests yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Requests will appear here once customers submit them.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-ocid="admin.list"
        >
          {requests?.map((req) => (
            <RequestCard key={req.id.toString()} req={req} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-black text-sm uppercase tracking-wide">
              RS <span className="text-primary">Breakdown</span> — Admin
            </span>
          </div>
          {isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clear()}
              data-ocid="admin.close_button"
              className="border-border text-foreground hover:text-destructive hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-sm mx-auto pt-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-black uppercase text-foreground mb-1">
                  Admin Login
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign in to manage breakdown requests
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <Button
                  onClick={() => login()}
                  disabled={isLoggingIn}
                  data-ocid="admin.primary_button"
                  className="w-full bg-primary text-primary-foreground font-black uppercase min-h-[56px] hover:opacity-90 transition-all"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In to Admin Panel"
                  )}
                </Button>
                {loginStatus === "loginError" && (
                  <p
                    className="text-destructive text-xs text-center mt-3"
                    data-ocid="admin.error_state"
                  >
                    Login failed. Please try again.
                  </p>
                )}
              </div>
            </motion.div>
          ) : !isAdmin ? (
            <motion.div
              key="no-access"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-sm mx-auto pt-8 text-center"
              data-ocid="admin.error_state"
            >
              <div className="bg-card border border-destructive/40 rounded-xl p-8">
                <h2 className="text-xl font-black uppercase text-foreground mb-2">
                  Access Denied
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Your account does not have admin privileges.
                </p>
                <Button
                  onClick={() => clear()}
                  variant="outline"
                  data-ocid="admin.cancel_button"
                  className="border-border"
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RS Breakdown Service. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
