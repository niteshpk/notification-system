import { useState } from 'react';
import { Key, Copy, Plus, Trash2, RefreshCw, Code, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
  requests: number;
}

export function ApiManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'nh_prod_k8s9d7f6g5h4j3k2l1m0n9o8p7q6r5s4',
      permissions: ['send:email', 'send:sms', 'send:push', 'read:status'],
      createdAt: '2024-01-15',
      lastUsed: '2024-12-09 10:30:45',
      status: 'active',
      requests: 45231,
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'nh_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      permissions: ['send:email', 'send:sms'],
      createdAt: '2024-03-20',
      lastUsed: '2024-12-08 15:22:10',
      status: 'active',
      requests: 1247,
    },
    {
      id: '3',
      name: 'Old API Key',
      key: 'nh_old_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4',
      permissions: ['send:email'],
      createdAt: '2023-11-05',
      lastUsed: '2024-10-15 09:12:33',
      status: 'revoked',
      requests: 8932,
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('send-email');

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('API key copied to clipboard!');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, status: 'revoked' as const } : key
      ));
    }
  };

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  };

  const endpoints = [
    {
      id: 'send-email',
      method: 'POST',
      path: '/api/v1/notifications/email',
      description: 'Send email notifications',
    },
    {
      id: 'send-sms',
      method: 'POST',
      path: '/api/v1/notifications/sms',
      description: 'Send SMS notifications',
    },
    {
      id: 'send-push',
      method: 'POST',
      path: '/api/v1/notifications/push',
      description: 'Send push notifications',
    },
    {
      id: 'send-whatsapp',
      method: 'POST',
      path: '/api/v1/notifications/whatsapp',
      description: 'Send WhatsApp messages',
    },
    {
      id: 'get-status',
      method: 'GET',
      path: '/api/v1/notifications/:id/status',
      description: 'Get notification delivery status',
    },
  ];

  const codeExamples: Record<string, string> = {
    'send-email': `// Send Email Notification
const response = await fetch('https://api.notifyhub.com/api/v1/notifications/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Your Subject Here',
    body: 'Your message content',
    template_id: 'optional-template-id'
  })
});

const data = await response.json();
console.log(data);`,
    'send-sms': `// Send SMS Notification
const response = await fetch('https://api.notifyhub.com/api/v1/notifications/sms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Your SMS message here'
  })
});

const data = await response.json();
console.log(data);`,
    'send-push': `// Send Push Notification
const response = await fetch('https://api.notifyhub.com/api/v1/notifications/push', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    device_token: 'user-device-token',
    title: 'Notification Title',
    body: 'Notification message',
    data: { key: 'value' }
  })
});

const data = await response.json();
console.log(data);`,
    'send-whatsapp': `// Send WhatsApp Message
const response = await fetch('https://api.notifyhub.com/api/v1/notifications/whatsapp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Your WhatsApp message',
    template_id: 'optional-template-id'
  })
});

const data = await response.json();
console.log(data);`,
    'get-status': `// Get Notification Status
const notificationId = 'notification-id-here';
const response = await fetch(\`https://api.notifyhub.com/api/v1/notifications/\${notificationId}/status\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data);`,
  };

  const selectedEndpointData = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="space-y-6">
      {/* API Keys Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1">API Keys</h2>
              <p className="text-sm text-gray-500">Manage your API keys for third-party integrations</p>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create API Key
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">API Key</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="mb-1">{apiKey.name}</div>
                      <div className="text-xs text-gray-500">Created: {new Date(apiKey.createdAt).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {apiKey.status === 'revoked' ? '••••••••••••••••' : apiKey.key.substring(0, 20) + '...'}
                      </code>
                      {apiKey.status === 'active' && (
                        <button
                          onClick={() => handleCopyKey(apiKey.key)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy API Key"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm">{apiKey.requests.toLocaleString()} requests</div>
                      <div className="text-xs text-gray-500">Last used: {apiKey.lastUsed}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      apiKey.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {apiKey.status === 'active' && (
                        <button
                          onClick={() => handleRevokeKey(apiKey.id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Revoke Key"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3>API Endpoints</h3>
          </div>
          <div className="space-y-2">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.id}
                onClick={() => setSelectedEndpoint(endpoint.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedEndpoint === endpoint.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    endpoint.method === 'GET' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-xs font-mono">{endpoint.path}</code>
                </div>
                <div className="text-xs text-gray-500">{endpoint.description}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Documentation
            </a>
          </div>
        </div>

        {/* Code Example */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-600" />
              <h3>Code Example</h3>
            </div>
            <button
              onClick={() => handleCopyCode(codeExamples[selectedEndpoint] || '')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          {selectedEndpointData && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  selectedEndpointData.method === 'GET' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedEndpointData.method}
                </span>
                <code className="text-sm font-mono">
                  https://api.notifyhub.com{selectedEndpointData.path}
                </code>
              </div>
              <p className="text-sm text-gray-600">{selectedEndpointData.description}</p>
            </div>
          )}

          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono">
              <code>{codeExamples[selectedEndpoint]}</code>
            </pre>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-blue-900 mb-1">Authentication</div>
                <div className="text-sm text-blue-700">
                  All API requests must include your API key in the Authorization header as a Bearer token. Keep your API keys secure and never expose them in client-side code.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2>Create New API Key</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2">Key Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Production API Key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Permissions</label>
                <div className="space-y-2">
                  {['send:email', 'send:sms', 'send:push', 'send:whatsapp', 'read:status'].map(permission => (
                    <label key={permission} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('API key created successfully!');
                  setShowCreateDialog(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
