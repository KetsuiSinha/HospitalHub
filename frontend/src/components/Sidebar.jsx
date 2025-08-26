import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Users, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

// 🎯 MAIN TOGGLEABLE COMPONENT TO IMPORT: Complete sidebar with toggle functionality
export function ToggleableSidebar({ currentPage, onNavigate, onLogout, children }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar Component */}
        <Sidebar className="transition-all duration-300 ease-in-out">
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-700">hospibot</h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onNavigate(item.id)}
                        isActive={currentPage === item.id}
                        className="w-full"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onLogout}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area - Dynamically expands when sidebar is collapsed */}
        <main className="flex-1 w-full min-w-0 flex flex-col">
          <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex-shrink-0">
            <div className="flex items-center space-x-4">
              {/* Toggle Button */}
              <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold capitalize">{currentPage}</h1>
            </div>
          </header>
          
          {/* Content area takes full width and height */}
          <div className="flex-1 w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// 📋 BASIC SIDEBAR COMPONENT: If you prefer to handle layout yourself
export function AppSidebar({ currentPage, onNavigate, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-blue-700">hospibot</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentPage === item.id}
                    className="w-full"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// 🎮 DEMO: Shows how to use the ToggleableSidebar
export default function SidebarDemo() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleLogout = () => {
    alert('Logout clicked!');
  };

  const getPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Total Inventory</h3>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
                <p className="text-3xl font-bold text-orange-600">23</p>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Active Staff</h3>
                <p className="text-3xl font-bold text-green-600">42</p>
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
            <p className="text-gray-600">Manage your hospital inventory items here.</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Alerts</h2>
            <div className="space-y-2">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-800">Low stock: Surgical masks (5 units remaining)</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-800">Critical: ICU bed shortage</p>
              </div>
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
            <p className="text-gray-600">Manage hospital staff and schedules.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600">Configure application settings and preferences.</p>
          </div>
        );
      default:
        return <div className="p-6">Page not found</div>;
    }
  };

  return (
    <ToggleableSidebar 
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {getPageContent()}
    </ToggleableSidebar>
  );
}