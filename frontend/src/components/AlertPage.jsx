import React, { useState } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, X, Calendar, MapPin, Users, TrendingUp, Zap } from 'lucide-react';

export function AlertPage({ onNavigate, onLogout }) {
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      message: 'Oxygen supply low in ICU', 
      priority: 'high', 
      timestamp: '2 minutes ago', 
      location: 'ICU Ward', 
      status: 'active',
      dateTime: '2024-09-10 14:35:22',
      predictions: 'Critical supply depletion expected within 4 hours. Immediate restocking required.',
      affectedPatients: 12,
      estimatedImpact: 'High - Patient safety at risk',
      recommendedAction: 'Contact supplier immediately, deploy backup oxygen tanks',
      description: 'Critical oxygen shortage detected in ICU Ward. Current levels at 15% capacity with complete depletion expected within 4 hours if no action is taken. Caused by increased patient demand and delayed supplier delivery.'
    },
    { 
      id: 2, 
      message: 'ORS shortage in Ward 3', 
      priority: 'medium', 
      timestamp: '15 minutes ago', 
      location: 'Ward 3', 
      status: 'active',
      dateTime: '2024-09-10 14:22:15',
      predictions: 'Stock depletion in 24 hours based on current usage patterns.',
      affectedPatients: 8,
      estimatedImpact: 'Medium - Treatment delays possible',
      recommendedAction: 'Schedule emergency procurement within 12 hours',
      description: 'ORS supplies critically low with only 12% of standard stock remaining. Shortage caused by 40% surge in gastrointestinal cases this week, exceeding normal consumption patterns.'
    },
    { 
      id: 3, 
      message: 'Paracetamol near expiry', 
      priority: 'low', 
      timestamp: '1 hour ago', 
      location: 'Pharmacy', 
      status: 'active',
      dateTime: '2024-09-10 13:37:08',
      predictions: 'Medication expires in 7 days. Usage rate suggests 40% wastage.',
      affectedPatients: 0,
      estimatedImpact: 'Low - No immediate patient impact',
      recommendedAction: 'Redistribute to high-usage wards or return to supplier',
      description: '2,400 Paracetamol tablets ($180 value) approaching expiration in 7 days. Current usage patterns indicate 40% will go to waste if not redistributed promptly.'
    },
    { 
      id: 4, 
      message: 'Blood pressure monitor calibration due', 
      priority: 'medium', 
      timestamp: '2 hours ago', 
      location: 'Emergency', 
      status: 'active',
      dateTime: '2024-09-10 12:37:45',
      predictions: 'Device accuracy may degrade, affecting diagnosis reliability.',
      affectedPatients: 15,
      estimatedImpact: 'Medium - Potential diagnostic errors',
      recommendedAction: 'Schedule calibration within 24 hours, use backup device',
      description: 'Primary BP monitor in Emergency exceeded 90-day calibration interval. Device serves 15+ patients daily. Delayed calibration may cause 5mmHg reading errors affecting emergency decisions.'
    },
    { 
      id: 5, 
      message: 'Insulin shortage resolved', 
      priority: 'high', 
      timestamp: '3 hours ago', 
      location: 'Diabetes Ward', 
      status: 'resolved',
      dateTime: '2024-09-10 11:45:12',
      predictions: 'Supply restored to normal levels. No further shortages expected.',
      affectedPatients: 25,
      estimatedImpact: 'Resolved - Normal operations resumed',
      recommendedAction: 'Continue monitoring stock levels',
      description: 'Critical insulin shortage affecting 25 diabetic patients successfully resolved through emergency procurement from partner facility. Cold-chain transportation issue caused initial delay.'
    },
    { 
      id: 6, 
      message: 'Staff shortage night shift', 
      priority: 'high', 
      timestamp: '4 hours ago', 
      location: 'General Ward', 
      status: 'active',
      dateTime: '2024-09-10 10:52:33',
      predictions: 'Nurse-to-patient ratio below safe standards. Overtime costs increasing.',
      affectedPatients: 30,
      estimatedImpact: 'High - Patient care quality compromised',
      recommendedAction: 'Deploy on-call staff, consider temporary agency nurses',
      description: 'Severe nursing shortage with only 4 nurses for 30 patients (below 1:6 safe ratio). Two nurses sick, one on emergency leave. Increased risk of medication errors and delayed response times.'
    }
  ]);

  const [filter, setFilter] = useState('active');

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
            <p className="text-gray-600 mt-1">
              {activeAlertsCount} active alerts • {highPriorityCount} high priority
            </p>
          </div>

          <div className="flex space-x-2">
            {['all', 'active', 'resolved'].map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className={filter === f ? 'bg-blue-600 text-white' : ''}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Alert Cards */}
        <div className="grid gap-6">
          {filteredAlerts.map(alert => (
            <Card key={alert.id} className="bg-white border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {getPriorityIcon(alert.priority)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getPriorityColor(alert.priority)} px-3 py-1 text-sm font-semibold border`}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {alert.message}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {alert.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {alert.affectedPatients} affected
                        </span>
                      </div>
                    </div>
                  </div>

                  {alert.status === 'active' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="text-green-700 border-green-300 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Situation Overview</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Key Info Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Forecast</span>
                    </div>
                    <p className="text-blue-800 text-sm">{alert.predictions}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">Action Required</span>
                    </div>
                    <p className="text-green-800 text-sm">{alert.recommendedAction}</p>
                  </div>
                </div>

                {/* Impact Badge */}
                <div className="flex justify-between items-center">
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                      Impact: {alert.estimatedImpact}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Alert #{alert.id.toString().padStart(4, '0')}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <Card className="p-12 text-center bg-white">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No alerts found</h3>
            <p className="text-gray-600">
              {filter === 'active'
                ? 'All alerts resolved! System running smoothly.'
                : 'No alerts match your current filter.'}
            </p>
          </Card>
        )}
      </div>
    </ToggleableSidebar>
  );
}

export default AlertPage;