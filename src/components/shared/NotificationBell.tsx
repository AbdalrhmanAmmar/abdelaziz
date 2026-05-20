import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationBell = ({ target }: { target: string }) => {
  const { notifications, unreadCount, handleMarkAllRead } = useNotifications(target);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-muted transition-all"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex min-w-[20px] h-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white px-1 animate-in zoom-in ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-xl border-border/50" align="end">
        <div className="p-3 border-b flex items-center justify-between bg-muted/20">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 transition-colors ${n.isRead ? "opacity-50" : "bg-primary/[0.03]"}`}
                >
                  {!n.isRead && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2 mb-0.5 align-middle" />
                  )}
                  <span className="text-sm text-foreground leading-snug">{n.message}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
