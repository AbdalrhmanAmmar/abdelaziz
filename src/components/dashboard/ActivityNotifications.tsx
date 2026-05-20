import { useEffect, useState } from "react";
import { Bell, Activity as ActivityIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useActivityStore } from "@/store/useActivityStore";

export const ActivityNotifications = () => {
  const { activities, unreadCount, resetUnread } = useActivityStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) resetUnread();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
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

      <PopoverContent
        className="w-96 p-0 mr-4 shadow-xl border-border/50 bg-background/95 backdrop-blur-sm"
        align="end"
      >
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-primary" />
            <h4 className="font-semibold leading-none">Notifications</h4>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {activities.map((activity: any) => (
                <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <span className="font-semibold text-sm">
                      {activity.user?.username ?? "System"}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {activity.description}
                  </p>
                  {activity.actionType && (
                    <div className="mt-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                        {activity.actionType}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
