import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

export function AlertPage({ onNavigate, onLogout }) {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      message: 'Oxygen supply low in ICU',
      priority: 'high',
      timestamp: '2 minutes ago',
      location: 'ICU Ward',
      status: 'active'
    },
    {
      id: 2,
      message: 'ORS shortage in Ward 3',
      priority: 'medium',
      timestamp: '15 minutes ago',
      location: 'Ward 3',
      status: 'active'
    },
    {
      id: 3,
      message: 'Paracetamol near expiry',
      priority: 'low',
      timestamp: '1 hour ago',
      location: 'Pharmacy',
      status: 'active'
    },
    {
      id: 4,
      message: 'Blood pressure monitor calibration due',
      priority: 'medium',
      timestamp: '2 hours ago',
      location: 'Emergency',
      status: 'active'
    },
    {
      id: 5,
      message: 'Insulin shortage resolved',
      priority: 'high',
      timestamp: '3 hours ago',
      location: 'Diabetes Ward',
      status: 'resolved'
    },
    {
      id: 6,
      message: 'Staff shortage night shift',
      priority: 'high',
      timestamp: '4 hours ago',
      location: 'General Ward',
      status: 'active'
    }
  ]);

  const [filter, setFilter] = useState('active');

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolveAlert = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const activeAlertsCount = alerts.filter((alert) => alert.status === 'active').length;
  const highPriorityCount = alerts.filter((alert) => alert.priority === 'high' && alert.status === 'active').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="alerts" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
            <p className="text-gray-600 mt-1">
              {activeAlertsCount} active alerts • {highPriorityCount} high priority
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-blue-700 hover:bg-blue-800' : ''}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'bg-blue-700 hover:bg-blue-800' : ''}
            >
              Active
            </Button>
            <Button
              variant={filter === 'resolved' ? 'default' : 'outline'}
              onClick={() => setFilter('resolved')}
              className={filter === 'resolved' ? 'bg-blue-700 hover:bg-blue-800' : ''}
            >
              Resolved
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getPriorityIcon(alert.priority)}</div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{alert.location}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{alert.timestamp}</span>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-1">
                      {alert.message}
                    </h3>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={alert.status === 'active' ? 'destructive' : 'secondary'}
                      >
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {alert.status === 'active' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600">
              {filter === 'active'
                ? 'All alerts have been resolved. Great job!'
                : 'No alerts match the current filter.'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
