import React, { useState } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

export function AlertPage({ onNavigate, onLogout }) {
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Oxygen supply low in ICU', priority: 'high', timestamp: '2 minutes ago', location: 'ICU Ward', status: 'active' },
    { id: 2, message: 'ORS shortage in Ward 3', priority: 'medium', timestamp: '15 minutes ago', location: 'Ward 3', status: 'active' },
    { id: 3, message: 'Paracetamol near expiry', priority: 'low', timestamp: '1 hour ago', location: 'Pharmacy', status: 'active' },
    { id: 4, message: 'Blood pressure monitor calibration due', priority: 'medium', timestamp: '2 hours ago', location: 'Emergency', status: 'active' },
    { id: 5, message: 'Insulin shortage resolved', priority: 'high', timestamp: '3 hours ago', location: 'Diabetes Ward', status: 'resolved' },
    { id: 6, message: 'Staff shortage night shift', priority: 'high', timestamp: '4 hours ago', location: 'General Ward', status: 'active' }
  ]);

  const [filter, setFilter] = useState('active');

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-5 h-5" style={{ color: 'var(--destructive)' }} />;
      case 'medium': return <Clock className="w-5 h-5" style={{ color: 'var(--warning)' }} />;
      case 'low': return <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-[var(--destructive-muted)] text-[var(--destructive)]';
      case 'medium': return 'bg-[var(--warning-muted)] text-[var(--warning)]';
      case 'low': return 'bg-[var(--success-muted)] text-[var(--success)]';
      default: return 'bg-[var(--muted)] text-[var(--foreground)]';
    }
  };

  const handleResolveAlert = (id) => {
    setAlerts(alerts.map(alert => alert.id === id ? { ...alert, status: 'resolved' } : alert));
  };

  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = alerts.filter(alert => filter === 'all' ? true : alert.status === filter);
  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high' && alert.status === 'active').length;

  return (
    <ToggleableSidebar currentPage="alerts" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Alerts</h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              {activeAlertsCount} active alerts • {highPriorityCount} high priority
            </p>
          </div>

          <div className="flex space-x-2">
            {['all', 'active', 'resolved'].map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                style={filter === f ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : {}}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <Card key={alert.id} className="p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getPriorityIcon(alert.priority)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority.toUpperCase()}</Badge>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{alert.location}</span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>•</span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{alert.timestamp}</span>
                    </div>
                    <h3 style={{ color: 'var(--foreground)', fontWeight: 500, marginBottom: '0.25rem' }}>
                      {alert.message}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
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
                      style={{ color: 'var(--success)' }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                      style={{ color: 'var(--destructive)' }}
                    >
                      <X className="w-4 h-4 mr-1" /> Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <Card className="p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <h3 style={{ color: 'var(--foreground)', fontWeight: 500, marginBottom: '0.25rem' }}>No alerts found</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              {filter === 'active'
                ? 'All alerts have been resolved. Great job!'
                : 'No alerts match the current filter.'}
            </p>
          </Card>
        )}
      </div>
    </ToggleableSidebar>
  );
}
