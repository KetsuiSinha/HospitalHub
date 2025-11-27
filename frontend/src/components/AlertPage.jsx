import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, X, Calendar, MapPin, Users, TrendingUp, Zap, Info, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AlertPage() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('active');
  const [date, setDate] = useState();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch alerts on mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:5000/api/alerts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleGenerateAlert = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/alerts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error(`Failed to generate alerts: ${response.status} ${errorText}`);
      }

      const newAlerts = await response.json();

      // Backend now returns the saved alert objects, so we can just prepend them
      const formattedAlerts = Array.isArray(newAlerts) ? newAlerts : [newAlerts];

      setAlerts(prev => [...formattedAlerts, ...prev]);
    } catch (error) {
      console.error('Error generating alerts:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const updateAlertStatus = async (id, newStatus) => {
    // Optimistic update
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        (alert._id === id || alert.id === id) ? { ...alert, status: newStatus } : alert
      )
    );

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/alerts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  const handleResolveAlert = (id) => {
    updateAlertStatus(id, 'resolved');
  };

  const handleDismissAlert = (id) => {
    updateAlertStatus(id, 'dismissed');
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filter === 'all' ? true : alert.status === filter;

    if (!date) return matchesStatus;

    // Filter by date if selected
    // Use createdAt if available, otherwise fallback to parsing timestamp/dateTime if possible
    // Assuming createdAt is an ISO string or Date object from backend
    const alertDate = new Date(alert.createdAt || alert.dateTime);
    const isSameDay =
      alertDate.getDate() === date.getDate() &&
      alertDate.getMonth() === date.getMonth() &&
      alertDate.getFullYear() === date.getFullYear();

    return matchesStatus && isSameDay;
  });

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

        {/* Only show Generate Alert button if no date is selected OR if selected date is today */}
        {(!date || (date && date.toDateString() === new Date().toDateString())) && (
          <Button
            onClick={handleGenerateAlert}
            disabled={isGenerating}
            className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Alert
              </>
            )}
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

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
      </div>

      {/* Alert Cards */}
      <div className="grid gap-6">
        {filteredAlerts.map(alert => (
          <Card key={alert._id || alert.id} className="transition-all hover:shadow-md border-border/60">
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
                      onClick={() => handleResolveAlert(alert._id || alert.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissAlert(alert._id || alert.id)}
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
                  ID: #{alert._id ? alert._id.toString().substring(alert._id.toString().length - 4) : (alert.id || '').toString().padStart(4, '0')}
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