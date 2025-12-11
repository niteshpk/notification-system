import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Smartphone, CheckCircle, AlertCircle, Eye, EyeOff, Save } from 'lucide-react';
import { getConfigs, createOrUpdateConfig, NotificationConfig } from '../services/configService';
import { toast } from 'sonner';

interface ChannelConfig {
  enabled: boolean;
  verified: boolean;
}

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'fcm'>('email');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const [channelStatus, setChannelStatus] = useState<Record<string, ChannelConfig>>({
    email: { enabled: false, verified: false },
    sms: { enabled: false, verified: false },
    fcm: { enabled: false, verified: false },
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    senderEmail: '',
    senderName: '',
  });

  const [smsConfig, setSmsConfig] = useState({
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    senderId: '',
  });

  const [fcmConfig, setFcmConfig] = useState({
    projectId: '',
    serverKey: '',
    senderId: '',
    serviceAccountJson: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const configs = await getConfigs();
      const status = { ...channelStatus };

      configs.forEach(config => {
        if (config.provider === 'email') {
           setEmailConfig({
             smtpHost: config.credentials.smtpHost || '',
             smtpPort: config.credentials.smtpPort || '587',
             smtpUsername: config.credentials.smtpUsername || '',
             smtpPassword: config.credentials.smtpPassword || '',
             senderEmail: config.credentials.senderEmail || '',
             senderName: config.credentials.senderName || '',
           });
           status.email = { enabled: config.isActive, verified: true };
        } else if (config.provider === 'sms') {
            setSmsConfig({
                provider: config.credentials.provider || 'twilio',
                accountSid: config.credentials.accountSid || '',
                authToken: config.credentials.authToken || '',
                senderId: config.credentials.senderId || '',
            });
            status.sms = { enabled: config.isActive, verified: true };
        } else if (config.provider === 'fcm') {
            setFcmConfig({
                projectId: config.credentials.projectId || '',
                serverKey: config.credentials.serverKey || '',
                senderId: config.credentials.senderId || '',
                serviceAccountJson: config.credentials.serviceAccountJson || '',
            });
            status.fcm = { enabled: config.isActive, verified: true };
        }
      });
      setChannelStatus(status);
    } catch (error: any) {
      toast.error('Failed to load configurations');
    }
  };

  const toggleSecret = (field: string) => {
    setShowSecrets({ ...showSecrets, [field]: !showSecrets[field] });
  };

  const handleSave = async (provider: 'email' | 'sms' | 'fcm') => {
    let credentials = {};
    let providerId = '';

    if (provider === 'email') {
      credentials = emailConfig;
      providerId = 'smtp';
    } else if (provider === 'sms') {
      credentials = smsConfig;
      providerId = smsConfig.provider;
    } else if (provider === 'fcm') {
      credentials = fcmConfig;
      providerId = 'firebase';
    }

    try {
      const config: NotificationConfig = {
        provider,
        providerId,
        credentials,
        isActive: true,
      };
      await createOrUpdateConfig(config);
      toast.success(`${provider.toUpperCase()} configuration saved successfully!`);
      fetchConfigs();
    } catch (error: any) {
      toast.error(`Failed to save ${provider} configuration`);
    }
  };

  const tabs = [
    { id: 'email' as const, label: 'Email (SMTP)', icon: Mail, color: 'text-blue-600' },
    { id: 'sms' as const, label: 'SMS Gateway', icon: MessageSquare, color: 'text-green-600' },
    { id: 'fcm' as const, label: 'Firebase FCM', icon: Smartphone, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Channel Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const status = channelStatus[tab.id];
          return (
            <div key={tab.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${tab.color}`} />
                {status.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="mb-1">{tab.label}</div>
              <div className="text-sm text-gray-500">
                {status.enabled ? (
                  status.verified ? 'Active & Verified' : 'Active - Needs Verification'
                ) : (
                  'Not Configured'
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 flex overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Email Configuration */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">SMTP Server Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">SMTP Host *</label>
                    <input
                      type="text"
                      value={emailConfig.smtpHost}
                      onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">SMTP Port *</label>
                    <select
                      value={emailConfig.smtpPort}
                      onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="587">587 (TLS)</option>
                      <option value="465">465 (SSL)</option>
                      <option value="25">25 (Unencrypted)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Username *</label>
                    <input
                      type="text"
                      value={emailConfig.smtpUsername}
                      onChange={(e) => setEmailConfig({ ...emailConfig, smtpUsername: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Password *</label>
                    <div className="relative">
                      <input
                        type={showSecrets['email-password'] ? 'text' : 'password'}
                        value={emailConfig.smtpPassword}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('email-password')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['email-password'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Sender Email *</label>
                    <input
                      type="email"
                      value={emailConfig.senderEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Sender Name</label>
                    <input
                      type="text"
                      value={emailConfig.senderName}
                      onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSave('email')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {/* SMS Configuration */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">SMS Gateway Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Provider</label>
                    <select
                      value={smsConfig.provider}
                      onChange={(e) => setSmsConfig({ ...smsConfig, provider: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="twilio">Twilio</option>
                      <option value="aws-sns">AWS SNS</option>
                      <option value="nexmo">Nexmo/Vonage</option>
                      <option value="messagebird">MessageBird</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Account SID *</label>
                    <div className="relative">
                      <input
                        type={showSecrets['sms-sid'] ? 'text' : 'password'}
                        value={smsConfig.accountSid}
                        onChange={(e) => setSmsConfig({ ...smsConfig, accountSid: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('sms-sid')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['sms-sid'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Auth Token *</label>
                    <div className="relative">
                      <input
                        type={showSecrets['sms-token'] ? 'text' : 'password'}
                        value={smsConfig.authToken}
                        onChange={(e) => setSmsConfig({ ...smsConfig, authToken: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('sms-token')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['sms-token'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Sender ID / Phone Number *</label>
                    <input
                      type="text"
                      value={smsConfig.senderId}
                      onChange={(e) => setSmsConfig({ ...smsConfig, senderId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="NotifyHub or +1234567890"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSave('sms')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {/* FCM Configuration */}
          {activeTab === 'fcm' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Firebase Cloud Messaging Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Project ID *</label>
                    <input
                      type="text"
                      value={fcmConfig.projectId}
                      onChange={(e) => setFcmConfig({ ...fcmConfig, projectId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your-project-id"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Sender ID *</label>
                    <input
                      type="text"
                      value={fcmConfig.senderId}
                      onChange={(e) => setFcmConfig({ ...fcmConfig, senderId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123456789012"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Server Key *</label>
                    <div className="relative">
                      <input
                        type={showSecrets['fcm-key'] ? 'text' : 'password'}
                        value={fcmConfig.serverKey}
                        onChange={(e) => setFcmConfig({ ...fcmConfig, serverKey: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('fcm-key')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['fcm-key'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Service Account JSON *</label>
                    <textarea
                      value={fcmConfig.serviceAccountJson}
                      onChange={(e) => setFcmConfig({ ...fcmConfig, serviceAccountJson: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Paste your service account JSON here"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Download this from Firebase Console {'>'} Project Settings {'>'} Service Accounts
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSave('fcm')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
