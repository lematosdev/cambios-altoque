import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import { P2PResponse, searchParams } from './types';

const requests: searchParams[] = [
  {
    page: 1,
    rows: 10,
    publisherType: 'merchant',
    asset: 'USDT',
    fiat: 'CLP',
    tradeType: 'BUY',
    transAmount: '10000',
    payTypes: []
  },
  {
    page: 1,
    rows: 10,
    payTypes: ['PagoMovil'],
    publisherType: 'merchant',
    asset: 'USDT',
    tradeType: 'SELL',
    fiat: 'VES',
    transAmount: '50'
  }
];

const fetchP2P: APIGatewayProxyHandler = async () => {
  let priceVES: string = '';
  let priceCLP: string = '';

  try {
    await Promise.all(
      requests.map(async (req) => {
        const stringData = JSON.stringify(req);
        const res = await fetch(
          'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': String(stringData.length)
            },
            body: stringData
          }
        );
        const { data }: P2PResponse = await res.json();

        switch (req.fiat) {
          case 'CLP':
            priceCLP = data[0].adv.price;
            break;
          case 'VES':
            priceVES = data[0].adv.price;
            break;
          default:
            break;
        }
      })
    );

    if (priceCLP && priceVES) {
      const rate = (
        (parseFloat(priceVES) / parseFloat(priceCLP)) *
        0.96
      ).toFixed(5);

      console.log(`La tasa del dia es: ${rate}`);

      return {
        statusCode: 200,
        body: JSON.stringify(rate)
      };
    } else {
      throw new Error('No se pudo obtener el precio');
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};

export default fetchP2P;
