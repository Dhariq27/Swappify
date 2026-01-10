import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, MessageCircle, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "message" | "request" | "achievement";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  userName?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "request",
    title: "New Barter Request",
    message: "monish wants to exchange Guitar Lessons for your Web Development skills",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=monish",
    userName: "monish",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "asif sent you a message about Photography Workshop",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=asif",
    userName: "asif",
  },
  {
    id: "3",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You've completed 5 skill exchanges! Keep up the great work!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageCircle className="h-5 w-5" />;
      case "request": return <Bell className="h-5 w-5" />;
      case "achievement": return <Trophy className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      When you get notifications, they'll show up here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {notification.avatar ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={notification.avatar} alt={notification.userName} />
                          <AvatarFallback>{notification.userName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                          {getIcon(notification.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(notification.timestamp)}
                        </div>
                        {!notification.read && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto mt-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notifications;
