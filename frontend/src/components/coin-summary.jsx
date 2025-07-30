import { Card } from 'react-bootstrap';

const CoinSummary = ({ coin }) => {
  const formatAsCurrency = (number) => {
    const currencyString = number.toString();
    let newCurrency = '';
    let [wholePart, decimalPart] = currencyString.split('.');

    if (!decimalPart) {
      decimalPart = '00';
    } else if (decimalPart.length === 1) {
      decimalPart += '0';
    } else if (decimalPart.length > 2) {
      decimalPart = decimalPart.slice(0, 2);
    }

    wholePart.split('').reverse().forEach((element, index) => {
      if (index > 0 && index % 3 === 0) {
        newCurrency += ' ';
      }
      newCurrency += element;
    });
    return 'R' + newCurrency.split('').reverse().join('') + '.' + decimalPart;
  }

  return (
    <Card style={{ width: '20rem', margin: '1rem', textAlign: 'center' }}>
      <Card.Body>
        <Card.Img
          variant="top"
          src={coin.image}
          alt={`${coin.name} logo`}
          style={{ width: '50px', height: '50px', margin: '0 auto' }}
        />
        <Card.Title>{coin.name} ({coin.symbol.toUpperCase()})</Card.Title>
        <h3>{formatAsCurrency(coin.current_price)}</h3>
        <p>24h Change: {coin.price_change_percentage_24h}%</p>
        <p>Market Cap: {formatAsCurrency(coin.market_cap)}</p>
        <p>24h Volume: {formatAsCurrency(coin.total_volume)}</p>
        <p>24h High: {formatAsCurrency(coin.high_24h)}</p>
        <p>24h Low: {formatAsCurrency(coin.low_24h)}</p>
      </Card.Body>
    </Card>
  );
};

export default CoinSummary;
