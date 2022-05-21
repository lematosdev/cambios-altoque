import { APIGatewayProxyHandler } from 'aws-lambda';
import { Lambda } from 'aws-sdk';
import fetch from 'node-fetch';

const lambda = new Lambda({
  region: 'us-east-1'
});

const params: Lambda.InvocationRequest = {
  FunctionName: 'cambios-altoque-dev-fetch',
  InvocationType: 'RequestResponse'
};

const verify: APIGatewayProxyHandler = async (e, _ctx) => {
  const VERIFY_TOKEN = 'prueba';

  const mode = e.queryStringParameters!['hub.mode'];
  const token =
    e.queryStringParameters!['hub.verify_token'];
  const challenge =
    e.queryStringParameters!['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return {
        statusCode: 200,
        body: challenge || ''
      };
    }
  }

  return {
    statusCode: 403,
    body: 'ok'
  };
};

export const events: APIGatewayProxyHandler = async (
  e,
  _ctx
) => {
  const { Payload } = await lambda.invoke(params).promise();
  const { body: fetchBody } = JSON.parse(Payload as string);

  const rate = Number(JSON.parse(fetchBody));

  const body = JSON.parse(e.body || 'null');

  console.log(JSON.stringify(body, null, 2));

  const toPhoneNumber =
    body.entry[0].changes[0].value.contacts[0].wa_id;

  const fromPhoneNumberId =
    body.entry[0].changes[0].value.metadata.phone_number_id;

  const receivedMessage =
    body.entry[0].changes[0].value.messages[0].text.body;

  const sendMessage =
    receivedMessage === '!tasa'
      ? `Tasa Bs. ${rate} 🇨🇱🇻🇪 ¡Consulta!
    Cambia rápido y confiable.`
      : 'No se entiende';

  const request = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: toPhoneNumber,
    type: 'text',
    text: {
      preview_url: false,
      body: sendMessage
    }
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v13.0/${fromPhoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        },
        body: JSON.stringify(request)
      }
    );
    const data = await res.json();
    console.log(`Data: ${JSON.stringify(data, null, 2)}`);
    console.log(`Message sent to ${toPhoneNumber}`);
  } catch (e) {
    console.log(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(e.body)
  };
};

export default verify;
