import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkReadMutation } from "../../features/notifications/notificationApi.js";

const NotificationItem = memo(function NotificationItem({ n, onRead }) {
  const navigate = useNavigate();

  const handleClick = useCallback(async () => {
    if (!n.read) await onRead(n._id);
    if (n.link) navigate(n.link);
  }, [n, onRead, navigate]);

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b border-default last:border-0 transition-colors ${
        n.link ? "cursor-pointer hover:bg-accent-soft/20" : "hover:bg-surface-alt/50"
      } ${!n.read ? "bg-accent-soft/10" : ""}`}
    >
      <div className="flex items-start gap-2.5">
        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />}
        <div className="flex-1 min-w-0">
          <p className={`text-xs leading-relaxed ${n.read ? "text-ink-muted" : "text-ink font-medium"}`}>
            {n.message}
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs text-ink-faint">
              {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
            {n.link && (
              <span className="text-xs text-accent font-medium">View →</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useGetNotificationsQuery(undefined, { pollingInterval: 30000 });
  const [markAllRead] = useMarkAllReadMutation();
  const [markRead]    = useMarkReadMutation();

  const notifications = data?.notifications || [];
  const unread        = notifications.filter((n) => !n.read).length;

  const handleToggle  = useCallback(() => setOpen((p) => !p), []);
  const handleClose   = useCallback(() => setOpen(false), []);
  const handleMarkAll = useCallback(() => markAllRead(), [markAllRead]);
  const handleMarkRead = useCallback((id) => markRead(id), [markRead]);

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-alt transition-colors" aria-label="Notifications">
        <span className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleClose} />
          <div className="absolute right-0 top-11 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-default overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-default">
              <p className="font-semibold text-ink text-sm">Notifications</p>
              {unread > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-accent hover:underline font-medium">Mark all read</button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-2xl mb-2">🔔</p>
                  <p className="text-sm text-ink-muted">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem key={n._id} n={n} onRead={handleMarkRead} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}