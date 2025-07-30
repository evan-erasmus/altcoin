import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const CoinChart = ({ title, data }) => {

  const formattedData = data.map(item => ({
    ...item,
    timestamp: new Date(item.timestamp).getTime(),
    price: parseFloat(item.price),
  }));

  const prices = formattedData.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const formatTime = (miliseconds, prefix='') => {
    return `${prefix}${new Date(miliseconds).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return (
    <div className="w-100 h-100">
      <div className="w-100 h-100">
        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(data) => formatTime(data)} />
            <YAxis domain={[minPrice, maxPrice]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
              labelFormatter={(data) => formatTime(data, 'Time: ')}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#fff"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CoinChart;
