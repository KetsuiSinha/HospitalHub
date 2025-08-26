import React from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function Dashboard({ onNavigate, onLogout }) {
  const inventoryItems = [
    { name: 'Paracetamol 500mg', stock: 320, maxStock: 500 },
    { name: 'Amoxicillin 250mg', stock: 180, maxStock: 300 },
    { name: 'ORS Sachets', stock: 45, maxStock: 200 },
    { name: 'Vitamin D3 60k IU', stock: 85, maxStock: 150 },
  ];

  const alerts = [
    { text: '[High] Oxygen supply low in ICU', priority: 'high' },
    { text: '[Medium] ORS shortage in Ward 3', priority: 'medium' },
    { text: '[Low] Paracetamol near expiry', priority: 'low' },
  ];

  const staffStats = { present: 24, total: 30, doctors: 8, nurses: 16 };
  const recommendations = [
    'Order 200 ORS sachets',
    'Increase stock: Amoxicillin 250mg',
    'Reorder: Vitamin D3 60k IU',
  ];

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--destructive)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--muted)';
    }
  };

  return (
    <ToggleableSidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              Overview of inventory, alerts, staff attendance, and AI recommendations
            </p>
          </div>
        </div>

        {/* Top Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inventory Overview */}
          <Card className="p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Inventory Overview</h2>
            <div className="space-y-4">
              {inventoryItems.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--foreground)' }}>{item.name}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{item.stock}/{item.maxStock}</span>
                  </div>
                  <Progress value={(item.stock / item.maxStock) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Active Alerts */}
          <Card className="p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Active Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mt-1 mr-3"
                    style={{ backgroundColor: getAlertColor(alert.priority) }}
                  ></div>
                  <span style={{ color: 'var(--foreground)' }}>{alert.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Staff Attendance */}
          <Card className="p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Staff Attendance</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--muted)' , borderRadius: '50%'}}></div>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary) 0deg ${(staffStats.present / staffStats.total) * 360}deg, transparent ${(staffStats.present / staffStats.total) * 360}deg 360deg)`
                  }}
                ></div>
                <div className="absolute inset-4 bg-[var(--card)] rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{staffStats.present}</div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>of {staffStats.total}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{staffStats.doctors}</div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Doctors</div>
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{staffStats.nurses}</div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nurses</div>
              </div>
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>AI Recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <span style={{ color: 'var(--foreground)' }}>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ToggleableSidebar>
  );
}
