import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, X, Calendar, MapPin, Users, TrendingUp, Zap, Info } from 'lucide-react';

export function AlertPage() {
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
      case 'high': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'medium': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary'; // Using secondary for medium as warning isn't standard
      case 'low': return 'outline';
      default: return 'outline';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Alert Management</h1>
          <p className="text-muted-foreground mt-1">
            {activeAlertsCount} active alerts • {highPriorityCount} high priority
          </p>
        </div>

        <div className="flex space-x-2 bg-muted p-1 rounded-lg">
          {['all', 'active', 'resolved'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid gap-6">
        {filteredAlerts.map(alert => (
          <Card key={alert.id} className="transition-all hover:shadow-md border-border/60">
            <CardContent className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${alert.priority === 'high' ? 'bg-destructive/10' :
                    alert.priority === 'medium' ? 'bg-orange-500/10' : 'bg-blue-500/10'
                    }`}>
                    {getPriorityIcon(alert.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getPriorityBadgeVariant(alert.priority)} className="uppercase">
                        {alert.priority}
                      </Badge>
                      <Badge variant={alert.status === 'active' ? 'outline' : 'secondary'} className="capitalize">
                        {alert.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {alert.message}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6 pl-14">
                <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">Situation Overview</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Key Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 pl-14">
                <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-900 dark:text-blue-300">Forecast</span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{alert.predictions}</p>
                </div>

                <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-900 dark:text-green-300">Action Required</span>
                  </div>
                  <p className="text-green-800 dark:text-green-200 text-sm">{alert.recommendedAction}</p>
                </div>
              </div>

              {/* Impact Badge */}
              <div className="flex justify-between items-center mt-6 pl-14 pt-4 border-t border-border/50">
                <div className="bg-muted px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    Impact: {alert.estimatedImpact}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: #{alert.id.toString().padStart(4, '0')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <CheckCircle className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">No alerts found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {filter === 'active'
              ? 'All alerts resolved! System running smoothly.'
              : 'No alerts match your current filter.'}
          </p>
        </Card>
      )}
    </div>
  );
}

export default AlertPage;