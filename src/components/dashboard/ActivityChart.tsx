import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';

interface ActivityChartProps {
  data: { name: string; habits: number }[];
  isLoading: boolean;
}

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  if (isLoading) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <div className="text-gold animate-pulse">Carregando gráfico...</div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="h-[300px] flex items-center justify-center text-charcoal-light">
        Sem dados suficientes para exibir o gráfico.
      </Card>
    );
  }

  return (
    <Card className="p-6 h-[350px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-charcoal">Consistência Semanal</h3>
        <p className="text-xs text-charcoal-light">Hábitos concluídos nos últimos 7 dias</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: '#F7F3EA' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-charcoal text-white text-xs p-2 rounded-lg shadow-xl border border-gold/30">
                      <p className="font-bold mb-1">{payload[0].payload.name}</p>
                      <p>Concluídos: <span className="text-gold font-bold">{payload[0].value}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="habits" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.habits > 0 ? '#C9A86A' : '#E5E7EB'} // Dourado se tiver hábito, Cinza se 0
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}