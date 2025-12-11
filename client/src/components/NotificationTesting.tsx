import { useState, useEffect } from 'react';
import { Send, Mail, MessageSquare, Smartphone, Bell, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { sendTestNotification, getNotificationLogs, NotificationLog } from '../services/notificationService';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  channel: string;
  recipient: string;
  status: 'pending' | 'success' | 'failed';
  message: string;
  timestamp: string;
  duration?: number;
  error?: string;
}

export function NotificationTesting() {
  const [selectedChannel, setSelectedChannel] = useState<string>('email');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const logs = await getNotificationLogs();
      const formattedLogs: TestResult[] = logs.map(log => ({
        id: log._id,
        channel: log.channel,
        recipient: log.recipient,
        status: log.status === 'sent' ? 'success' : 'failed',
        message: log.content,
        timestamp: new Date(log.createdAt).toLocaleString(),
        error: log.error,
      }));
      setTestResults(formattedLogs);
    } catch (error) {
      toast.error('Failed to load logs');
    }
  };

  const channels = [
    { id: 'email', label: 'Email', icon: Mail, color: 'bg-blue-500', placeholder: 'recipient@example.com' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'bg-green-500', placeholder: '+1 234 567 8900' },
    { id: 'fcm', label: 'Push Notification (FCM)', icon: Smartphone, color: 'bg-purple-500', placeholder: 'Device Token or User ID' },
  ];

  const handleSendTest = async () => {
    if (!recipient || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    const startTime = Date.now();

    try {
      // @ts-ignore
      await sendTestNotification({
        channel: selectedChannel as any,
        recipient,
        subject,
        content: message,
      });

      const duration = (Date.now() - startTime) / 1000;
      toast.success('Notification sent successfully');
      
      // Refresh logs
      fetchLogs();
      
      // Clear form
      setRecipient('');
      setSubject('');
      setMessage('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleBulkTest = () => {
    toast.info('Bulk testing feature coming soon');
  };

  const selectedChannelData = channels.find(c => c.id === selectedChannel);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="mb-6">Send Test Notification</h2>
          
          <div className="space-y-4">
            {/* Channel Selection */}
            <div>
              <label className="block text-sm mb-3">Select Channel</label>
              <div className="grid grid-cols-2 gap-3">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = selectedChannel === channel.id;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`${channel.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm">{channel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-sm mb-2">Recipient *</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={selectedChannelData?.placeholder}
              />
            </div>

            {/* Subject (Email only) */}
            {selectedChannel === 'email' && (
              <div>
                <label className="block text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Test Notification"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm mb-2">Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your test message here..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSendTest}
                disabled={isSending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Test
                  </>
                )}
              </button>
              <button
                onClick={handleBulkTest}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bulk Test
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4">Test Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl text-green-600 mb-1">{testResults.filter(r => r.status === 'success').length}</div>
                <div className="text-sm text-gray-500">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-red-600 mb-1">{testResults.filter(r => r.status === 'failed').length}</div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-gray-900 mb-1">{testResults.length}</div>
                <div className="text-sm text-gray-500">Total Tests</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-blue-900 mb-1">Testing Best Practices</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Test each channel before going live</li>
                  <li>• Verify delivery to multiple recipients</li>
                  <li>• Check spam folders for email tests</li>
                  <li>• Monitor response times and errors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2>Test Results</h2>
            <button
              onClick={() => setTestResults([])}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No test results yet. Send a test notification to see results here.
                  </td>
                </tr>
              ) : (
                testResults.map((result) => {
                  const channelData = channels.find(c => c.id === result.channel);
                  const ChannelIcon = channelData?.icon || Bell;
                  return (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(result.status)}`}>
                            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`${channelData?.color} w-8 h-8 rounded flex items-center justify-center`}>
                            <ChannelIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="capitalize">{result.channel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono">{result.recipient}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm">{result.message}</div>
                          {result.error && (
                            <div className="text-xs text-red-600 mt-1">{result.error}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.duration ? `${result.duration.toFixed(2)}s` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
