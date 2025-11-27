import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Users, Calendar as CalendarIcon } from 'lucide-react';
import { getAuthUser, attendanceApi, medicinesApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Dashboard() {
  const [userHospital, setUserHospital] = useState("");
  const [userCity, setUserCity] = useState("");
  const [staffStats, setStaffStats] = useState({ present: 0, total: 0, absent: 0, onLeave: 0 });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const user = getAuthUser();
    if (user && user.hospital) {
      setUserHospital(user.hospital);
      setUserCity(user.city || "");
    }
    // Load attendance summary
    const load = async () => {
      try {
        const sum = await attendanceApi.today(selectedDate.toISOString());
        const present = sum.present || 0;
        const onLeave = sum.onLeave || 0;
        const total = sum.total || 0;
        // Treat unmarked as absent for the dashboard summary
        // Absent = Total Staff - Present - On Leave
        // This ensures 'Absent' count includes both explicitly marked absent and those who haven't marked attendance
        const absent = Math.max(0, total - present - onLeave);

        setStaffStats({
          present,
          total,
          absent,
          onLeave,
        });
      } catch { }
      try {
        const meds = await medicinesApi.list();
        const items = (meds || [])
          .slice(0, 4)
          .map((m) => ({
            name: m.name,
            stock: m.stock || 0,
            maxStock: 500, // default capacity
          }));
        setInventoryItems(items);
      } catch { }
    };
    load();
  }, [selectedDate]);


  const [alerts, setAlerts] = useState([]);

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
          // Filter for active alerts and map to dashboard format
          const activeAlerts = data
            .filter(alert => alert.status === 'active')
            .map(alert => ({
              text: alert.message,
              priority: alert.priority
            }));
          setAlerts(activeAlerts);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);



  const getAlertBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning'; // Custom variant if available, else default/secondary
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of inventory, alerts, staff attendance, and AI recommendations
          </p>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inventory Overview */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Inventory Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {inventoryItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.stock}/{item.maxStock}</span>
                </div>
                <Progress value={(item.stock / item.maxStock) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${alert.priority === 'high' ? 'bg-destructive' :
                    alert.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                  <span className="text-sm font-medium">{alert.text}</span>
                </div>
                <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                  {alert.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      {/* Bottom Row */}
      <div className="grid lg:grid-cols-1 gap-6">
        {/* Staff Attendance */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Staff Attendance
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date()}
                  required
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-48 h-48">
                {/* Circular progress with Present (Green), On Leave (Yellow), Absent (Red) */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-muted/20 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  {/* Present Segment */}
                  <circle
                    className="text-primary stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${(staffStats.present / (staffStats.total || 1)) * 251.2} 251.2`}
                  ></circle>
                  {/* On Leave Segment */}
                  <circle
                    className="text-yellow-500 stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${(staffStats.onLeave / (staffStats.total || 1)) * 251.2} 251.2`}
                    strokeDashoffset={-((staffStats.present / (staffStats.total || 1)) * 251.2)}
                  ></circle>
                  {/* Absent Segment */}
                  <circle
                    className="text-destructive stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${(staffStats.absent / (staffStats.total || 1)) * 251.2} 251.2`}
                    strokeDashoffset={-(((staffStats.present + staffStats.onLeave) / (staffStats.total || 1)) * 251.2)}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{staffStats.present}</span>
                    <span className="text-xs text-muted-foreground block">Present</span>
                  </div>
                  <div className="w-12 h-px bg-border my-1"></div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-destructive">{staffStats.absent}</span>
                    <span className="text-xs text-muted-foreground block">Absent</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round((staffStats.present / (staffStats.total || 1)) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{Math.round((staffStats.onLeave / (staffStats.total || 1)) * 100)}%</div>
                <div className="text-sm text-muted-foreground">On Leave</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{Math.round((staffStats.absent / (staffStats.total || 1)) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </div>
            </div>
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
