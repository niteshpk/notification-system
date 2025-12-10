import { useState } from 'react';
import { Mail, MessageSquare, Smartphone, Bell, Settings, Save, User } from 'lucide-react';

interface NotificationPreference {
  id: string;
  type: string;
  label: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
    inapp: boolean;
  };
}

export function NotificationPreferences() {
  const [selectedUser, setSelectedUser] = useState('1');
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: '1',
      type: 'account',
      label: 'Account Updates',
      description: 'Notifications about account changes, security alerts, and profile updates',
      channels: { email: true, sms: true, push: true, whatsapp: false, inapp: true },
    },
    {
      id: '2',
      type: 'marketing',
      label: 'Marketing & Promotions',
      description: 'Special offers, new features, and promotional content',
      channels: { email: true, sms: false, push: false, whatsapp: false, inapp: false },
    },
    {
      id: '3',
      type: 'transactional',
      label: 'Transactional Notifications',
      description: 'Order confirmations, payment receipts, and delivery updates',
      channels: { email: true, sms: true, push: true, whatsapp: true, inapp: true },
    },
    {
      id: '4',
      type: 'system',
      label: 'System Notifications',
      description: 'Maintenance schedules, system updates, and service announcements',
      channels: { email: true, sms: false, push: true, whatsapp: false, inapp: true },
    },
    {
      id: '5',
      type: 'social',
      label: 'Social Interactions',
      description: 'Comments, mentions, likes, and social activity',
      channels: { email: false, sms: false, push: true, whatsapp: false, inapp: true },
    },
    {
      id: '6',
      type: 'reminders',
      label: 'Reminders & Alerts',
      description: 'Task reminders, deadline alerts, and scheduled notifications',
      channels: { email: true, sms: true, push: true, whatsapp: false, inapp: true },
    },
  ]);

  const users = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com' },
  ];

  const channels = [
    { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-600' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-green-600' },
    { id: 'push', label: 'Push', icon: Smartphone, color: 'text-purple-600' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600' },
    { id: 'inapp', label: 'In-App', icon: Bell, color: 'text-orange-600' },
  ];

  const handleToggleChannel = (preferenceId: string, channelId: keyof NotificationPreference['channels']) => {
    setPreferences(preferences.map(pref =>
      pref.id === preferenceId
        ? {
            ...pref,
            channels: {
              ...pref.channels,
              [channelId]: !pref.channels[channelId],
            },
          }
        : pref
    ));
  };

  const handleToggleAll = (channelId: keyof NotificationPreference['channels'], enabled: boolean) => {
    setPreferences(preferences.map(pref => ({
      ...pref,
      channels: {
        ...pref.channels,
        [channelId]: enabled,
      },
    })));
  };

  const getChannelCount = (channelId: keyof NotificationPreference['channels']) => {
    return preferences.filter(pref => pref.channels[channelId]).length;
  };

  const handleSave = () => {
    alert('Preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* User Selection & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1">
          <label className="block text-sm mb-2">Configure preferences for:</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[300px]"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Preferences
        </button>
      </div>

      {/* Channel Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {channels.map(channel => {
          const Icon = channel.icon;
          const count = getChannelCount(channel.id as keyof NotificationPreference['channels']);
          return (
            <div key={channel.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 ${channel.color}`} />
                <span className="text-sm">{channel.label}</span>
              </div>
              <div className="text-2xl mb-1">{count}</div>
              <div className="text-xs text-gray-500">of {preferences.length} enabled</div>
            </div>
          );
        })}
      </div>

      {/* Preferences Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Notification Type</span>
                  </div>
                </th>
                {channels.map(channel => {
                  const Icon = channel.icon;
                  const count = getChannelCount(channel.id as keyof NotificationPreference['channels']);
                  const allEnabled = count === preferences.length;
                  return (
                    <th key={channel.id} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-5 h-5 ${channel.color}`} />
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{channel.label}</span>
                        <button
                          onClick={() => handleToggleAll(channel.id as keyof NotificationPreference['channels'], !allEnabled)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          {allEnabled ? 'Disable All' : 'Enable All'}
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preferences.map((preference) => (
                <tr key={preference.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="mb-1">{preference.label}</div>
                      <div className="text-sm text-gray-500">{preference.description}</div>
                    </div>
                  </td>
                  {channels.map(channel => (
                    <td key={channel.id} className="px-6 py-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preference.channels[channel.id as keyof NotificationPreference['channels']]}
                          onChange={() => handleToggleChannel(preference.id, channel.id as keyof NotificationPreference['channels'])}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm text-blue-900 mb-1">Notification Preferences Guide</div>
            <div className="text-sm text-blue-700">
              Configure which notification types should be sent through each channel. Users can customize their preferences to receive notifications through their preferred channels. Changes are saved automatically when you click the Save button.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
