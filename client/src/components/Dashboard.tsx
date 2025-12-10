import { Bell, Users, CheckCircle, AlertCircle, TrendingUp, Mail, MessageSquare, Smartphone } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Notifications Sent',
      value: '45,231',
      change: '+23.1%',
      icon: Bell,
      color: 'bg-green-500',
    },
    {
      name: 'Success Rate',
      value: '98.4%',
      change: '+2.3%',
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      name: 'Failed Deliveries',
      value: '143',
      change: '-5.2%',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  const channelStats = [
    { name: 'Email', sent: 18420, success: 18103, icon: Mail, color: 'bg-blue-500' },
    { name: 'SMS', sent: 12850, success: 12695, icon: MessageSquare, color: 'bg-green-500' },
    { name: 'Push', sent: 9841, success: 9724, icon: Smartphone, color: 'bg-purple-500' },
    { name: 'WhatsApp', sent: 4120, success: 4057, icon: MessageSquare, color: 'bg-emerald-500' },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Updated notification preferences', time: '2 minutes ago', type: 'update' },
    { id: 2, user: 'Sarah Smith', action: 'Test notification sent via Email', time: '15 minutes ago', type: 'test' },
    { id: 3, user: 'Mike Johnson', action: 'New user created', time: '1 hour ago', type: 'create' },
    { id: 4, user: 'Emily Brown', action: 'SMS gateway configuration updated', time: '2 hours ago', type: 'config' },
    { id: 5, user: 'System', action: 'Bulk notifications sent (1,250 users)', time: '3 hours ago', type: 'bulk' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-gray-500 text-sm mb-1">{stat.name}</div>
              <div className="text-2xl">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Channel Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="mb-6">Channel Performance</h2>
        <div className="space-y-6">
          {channelStats.map((channel) => {
            const Icon = channel.icon;
            const successRate = ((channel.success / channel.sent) * 100).toFixed(1);
            return (
              <div key={channel.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`${channel.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div>{channel.name}</div>
                      <div className="text-sm text-gray-500">
                        {channel.success.toLocaleString()} / {channel.sent.toLocaleString()} delivered
                      </div>
                    </div>
                  </div>
                  <div className="text-green-600">{successRate}%</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${channel.color} h-2 rounded-full transition-all`}
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'update' ? 'bg-blue-500' :
                activity.type === 'test' ? 'bg-purple-500' :
                activity.type === 'create' ? 'bg-green-500' :
                activity.type === 'config' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              <div className="flex-1">
                <div>{activity.action}</div>
                <div className="text-sm text-gray-500">{activity.user} • {activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
