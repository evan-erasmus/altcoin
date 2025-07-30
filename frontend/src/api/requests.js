import axios from 'axios';

const API_URL = 'http://localhost:5000/api/crypto';

export const getCryptoList = async () => {
  try {
    const response = await axios.get(`${API_URL}/coins`);
    return response.data;
  } catch (error) {
    console.error('Api err:', error);
    throw error;
  }
}

export const getLiveCryptoData = async () => {
  try {
    const response = await axios.get(`${API_URL}/live`);
    return response.data;
  } catch (error) {
    console.error('Api err:', error);
    throw error;
  }
}

export const getCryptoHistory = async (cryptoId) => {
  try {
    const response = await axios.get(`${API_URL}/history/${cryptoId}`);
    return response.data;
  } catch (error) {
    console.error(`Api err - ${cryptoId}:`, error);
    throw error;
  }
}
