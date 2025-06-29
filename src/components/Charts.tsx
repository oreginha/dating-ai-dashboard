import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Color palette para charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  dating: {
    match: '#FD5068',
    compatibility: '#FBBF24',
    opportunity: '#FB923C',
  },
};

// Datos de ejemplo para testing
const compatibilityData = [
  { range: '90-100%', count: 12, color: COLORS.success },
  { range: '80-89%', count: 28, color: COLORS.dating.compatibility },
  { range: '70-79%', count: 45, color: COLORS.warning },
  { range: '60-69%', count: 32, color: COLORS.primary },
  { range: '50-59%', count: 18, color: COLORS.error },
];

const responseRateData = [
  { date: '01/06', responseRate: 65, messagesSet: 24 },
  { date: '02/06', responseRate: 72, messagesSet: 31 },
  { date: '03/06', responseRate: 68, messagesSet: 28 },
  { date: '04/06', responseRate: 78, messagesSet: 35 },
  { date: '05/06', responseRate: 81, messagesSet: 42 },
  { date: '06/06', responseRate: 75, messagesSet: 38 },
  { date: '07/06', responseRate: 83, messagesSet: 45 },
];

const conversationStatesData = [
  { name: 'Activas', value: 23, color: COLORS.success },
  { name: 'Pendientes', value: 15, color: COLORS.warning },
  { name: 'En Pausa', value: 8, color: COLORS.primary },
  { name: 'Cerradas', value: 12, color: COLORS.error },
];

interface ChartProps {
  data?: any[];
  loading?: boolean;
  height?: number;
}

// Componente de distribución de compatibilidad
export const CompatibilityDistribution: React.FC<ChartProps> = ({ 
  data = compatibilityData, 
  loading = false, 
  height = 300 
}) => {
  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Cargando distribución...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="count" 
            fill={COLORS.primary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de tendencia de tasa de respuesta
export const ResponseRateTrend: React.FC<ChartProps> = ({ 
  data = responseRateData, 
  loading = false, 
  height = 300 
}) => {
  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Cargando tendencias...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="responseRate" 
            stroke={COLORS.success} 
            strokeWidth={3}
            dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: COLORS.success }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de estados de conversaciones (pie chart)
export const ConversationStatesChart: React.FC<ChartProps> = ({ 
  data = conversationStatesData, 
  loading = false, 
  height = 300 
}) => {
  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Cargando estados...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de embudo de conversión
interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
}

const funnelData: FunnelData[] = [
  { stage: 'Perfiles Descubiertos', count: 150, percentage: 100 },
  { stage: 'Compatibilidad >70%', count: 95, percentage: 63 },
  { stage: 'Mensajes Enviados', count: 78, percentage: 52 },
  { stage: 'Respuestas Recibidas', count: 58, percentage: 39 },
  { stage: 'Conversaciones Activas', count: 34, percentage: 23 },
  { stage: 'Matches Conseguidos', count: 12, percentage: 8 },
];

export const ConversationFunnel: React.FC<{ data?: FunnelData[] }> = ({ 
  data = funnelData 
}) => {
  return (
    <div className="w-full space-y-2">
      {data.map((stage, _index) => (
        <div key={stage.stage} className="relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
            <span className="text-sm text-gray-500">{stage.count} ({stage.percentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${stage.percentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {stage.count}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de actividad semanal (heatmap simplificado)
interface ActivityData {
  day: string;
  hour: number;
  activity: number;
}

export const ActivityHeatmap: React.FC<{ data?: ActivityData[] }> = ({ data: _data }) => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getActivityLevel = (day: string, hour: number) => {
    // Simulación de datos de actividad
    const baseActivity = Math.random() * 100;
    const isPeakHour = (hour >= 19 && hour <= 23) || (hour >= 12 && hour <= 14);
    const isWeekend = day === 'Sáb' || day === 'Dom';
    
    let activity = baseActivity;
    if (isPeakHour) activity *= 1.5;
    if (isWeekend) activity *= 0.7;
    
    return Math.min(100, activity);
  };

  const getIntensityColor = (activity: number) => {
    if (activity < 25) return 'bg-gray-100';
    if (activity < 50) return 'bg-blue-200';
    if (activity < 75) return 'bg-blue-400';
    return 'bg-blue-600';
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-25 gap-1 text-xs">
        {/* Header con horas */}
        <div></div>
        {hours.map(hour => (
          <div key={hour} className="text-center text-gray-500 p-1">
            {hour % 6 === 0 ? hour : ''}
          </div>
        ))}
        
        {/* Filas por día */}
        {days.map(day => (
          <React.Fragment key={day}>
            <div className="flex items-center justify-end pr-2 text-gray-600 font-medium">
              {day}
            </div>
            {hours.map(hour => {
              const activity = getActivityLevel(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`aspect-square rounded ${getIntensityColor(activity)} hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer`}
                  title={`${day} ${hour}:00 - ${activity.toFixed(0)}% actividad`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Menos activo</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
        </div>
        <span>Más activo</span>
      </div>
    </div>
  );
};
