import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

export function Sidebar({ currentPage, onNavigate, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen p-6 border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-blue-700">hospibot</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
