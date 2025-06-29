import React, { useState, useEffect, useRef } from 'react';
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useNotifications } from '../hooks/useNotifications';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Discovery Pipeline', href: '/discovery', icon: MagnifyingGlassIcon },
  { name: 'Conversation Manager', href: '/conversations', icon: ChatBubbleLeftRightIcon, badge: 3 },
  { name: 'Opportunity Detector', href: '/opportunities', icon: SparklesIcon, badge: 7 },
  { name: 'Auto-Response System', href: '/auto-response', icon: RocketLaunchIcon, badge: 2 },
  { name: 'Analytics Dashboard', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPath = '/' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    unreadCount
  } = useNotifications([
    { id: 1, message: 'Nueva oportunidad detectada', time: '2 min', type: 'opportunity', read: false },
    { id: 2, message: 'Mensaje enviado exitosamente', time: '5 min', type: 'success', read: false },
    { id: 3, message: 'Respuesta recibida de @maria_23', time: '8 min', type: 'message', read: false },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  // Agregar animación a nuevas notificaciones
  useEffect(() => {
    if (notifications.length > 3) {
      const timer = setTimeout(() => {
        addNotification('Nueva actividad detectada', 'info');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [notifications.length, addNotification]);

  const isCurrentPath = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className={clsx(
        'fixed inset-0 z-40 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💕</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">Dating AI</h1>
                <p className="text-xs text-gray-500">v3.0</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isCurrentPath(item.href)
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💕</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">Dating AI Agent</h1>
                <p className="text-xs text-blue-100">v3.0 - Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                  isCurrentPath(item.href)
                    ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon 
                  className={clsx(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isCurrentPath(item.href) ? 'text-blue-600' : 'text-gray-400'
                  )} 
                />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Status info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Sistema Activo</p>
                <p className="text-xs text-gray-500">Última actualización: hace 2 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Botón menú móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Breadcrumb o título de página */}
            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                  {navigation.find(item => isCurrentPath(item.href))?.name || 'Dashboard'}
                </h2>
              </div>

              {/* Acciones del header */}
              <div className="flex items-center space-x-4">
                {/* Botón de prueba para agregar notificaciones (temporal) */}
                <button
                  onClick={() => {
                    const types: Array<'opportunity' | 'success' | 'message' | 'info'> = ['opportunity', 'success', 'message', 'info'];
                    const messages = [
                      'Nueva oportunidad detectada',
                      'Mensaje enviado con éxito',
                      'Respuesta recibida',
                      'Sistema actualizado'
                    ];
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    addNotification(randomMessage, randomType);
                  }}
                  className="hidden lg:block px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  + Notificación
                </button>

                {/* Notificaciones */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-gray-400 hover:text-gray-600 relative"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de notificaciones */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transform transition-all duration-200 ease-out opacity-100 scale-100">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                          <button
                            onClick={() => {
                              clearAll();
                              setNotificationsOpen(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Limpiar todo
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  {notification.type === 'opportunity' && (
                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                                  )}
                                  {notification.type === 'success' && (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                                  )}
                                  {notification.type === 'message' && (
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                                  )}
                                  {notification.type === 'info' && (
                                    <InformationCircleIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">hace {notification.time}</p>
                                </div>
                                <button
                                  onClick={() => removeNotification(notification.id)}
                                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-gray-500">No hay notificaciones nuevas</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <button
                            onClick={() => {
                              setNotificationsOpen(false);
                              // Aquí se podría navegar a una página de notificaciones completa
                              console.log('Navegando a página de notificaciones...');
                            }}
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            Ver historial completo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Perfil de usuario */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">Usuario</p>
                    <p className="text-xs text-gray-500">Activo</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <UserIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>

        {/* Barra de notificaciones inferior */}
        {notifications.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">
                      {notifications[0].message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{notifications[0].time}</span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Ver todas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
