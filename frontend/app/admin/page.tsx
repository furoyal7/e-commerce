'use client';

import React, { useState } from 'react';
import { Home, Package, Users, FileText, CreditCard, BarChart3, Settings, TrendingUp, ShoppingCart, DollarSign, Plus, Search, Bell, User, Moon, Sun, Menu, ChevronDown } from 'lucide-react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { id: 'products', label: 'Products', icon: <Package className="h-5 w-5" /> },
    { id: 'orders', label: 'Orders', icon: <FileText className="h-5 w-5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  const renderSidebar = () => {
    return (
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
              <Package className="h-6 w-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-xl font-bold text-gray-900">AdminX</span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                {item.icon}
                {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  const renderTopNavbar = () => {
    return (
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-xl border text-sm w-96 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className={`relative p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">5</span>
              </button>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button className={`flex items-center p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Revenue', value: '$124,563', icon: <DollarSign className="h-6 w-6" />, color: 'bg-emerald-500' },
                { title: 'Total Orders', value: '1,234', icon: <ShoppingCart className="h-6 w-6" />, color: 'bg-blue-500' },
                { title: 'Total Customers', value: '892', icon: <Users className="h-6 w-6" />, color: 'bg-purple-500' },
                { title: 'Conversion Rate', value: '3.2%', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-orange-500' }
              ].map((stat, index) => {
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <div className="text-white">{stat.icon}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {renderSidebar()}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {renderTopNavbar()}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
