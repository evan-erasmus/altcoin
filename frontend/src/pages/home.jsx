import GlassCard from '../components/glass-card';
import { getCryptoList, getLiveCryptoData } from '../api/requests';
import { useEffect, useState } from 'react';
import CoinChart from '../components/coin-chart';
import CoinSummary from '../components/coin-summary';


const Home = () => {
  const [coins, setCoins] = useState([]);
  const [liveData, setLiveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveCryptoData()
      .then(data => setLiveData(data))
      .catch(console.error);

    getCryptoList()
      .then(data => setCoins(data))
      .catch(console.error)
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      getLiveCryptoData()
        .then(data => setLiveData(data))
        .catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const buttons = coins.map(coin => ({
    name: coin.name,
    endpoint: `/coin/${coin.api_id}`
  }));

  return (
    <div className="d-flex justify-content-center align-items-center h-100 w-100">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <GlassCard
          title="CoinTracker"
          content={liveData.map((coin) => (
            <CoinSummary key={coin.id} coin={coin} />
          ))}
          buttons={buttons}
        />
      )}
    </div>
  );
};

export default Home;
