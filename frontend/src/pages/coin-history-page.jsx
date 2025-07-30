import React from 'react';
import { useParams } from 'react-router-dom';
import GlassCard from '../components/glass-card';
import { getCryptoHistory, getCryptoList } from '../api/requests';
import { useEffect, useState } from 'react';
import CoinChart from '../components/coin-chart';


const CoinPage = () => {
  const { id } = useParams();
  const [coinHistory, setCoinHistory] = useState(null);
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCryptoList().then(data => {
      const selectedCoin = data.find(coin => coin.api_id === id);
      setCoin(selectedCoin);
    }).catch(error => {
      console.error('Api err:', error);
    });

    getCryptoHistory(id).then(data => {
      setCoinHistory(data);
      setLoading(false);
    }).catch(error => {
      console.error('Api err:', error);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100 w-100">
      <GlassCard
        title={coin.name}
        content={<CoinChart title={coin.name} data={coinHistory} />}
        footer={`Market Cap: $${coinHistory.market_cap}`}
        buttons={[{ name: 'Back to Home', endpoint: '/' }]}
      />
    </div>
  );
}

export default CoinPage;
