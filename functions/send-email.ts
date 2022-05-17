import { APIGatewayProxyHandler } from 'aws-lambda';
import { Lambda, SES, config } from 'aws-sdk';
import * as aws from 'aws-sdk/clients/ses';
import { createTransport } from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');

config.update({ region: 'us-east-1' });

const lambda = new Lambda();

const ses = new SES();

const params: Lambda.InvocationRequest = {
  FunctionName: 'cambios-altoque-dev-create',
  InvocationType: 'RequestResponse'
};

const transport = createTransport({ SES: { ses, aws } });

const sendEmail: APIGatewayProxyHandler = async () => {
  const { Payload } = await lambda.invoke(params).promise();

  const { body } = JSON.parse(Payload as string);

  const buffer = Buffer.from(body, 'base64');

  const msg: Mail.Options = {
    from: 'carlosmatos13@gmail.com',
    to: 'lematosdev@gmail.com',
    subject: 'Message ✓ ' + Date.now(),
    text: 'I hope this message gets sent! ✓',
    attachments: [
      { filename: 'output.png', content: buffer }
    ]
  };

  try {
    await transport.sendMail(msg);
  } catch (e) {
    console.log(JSON.stringify(e, null, 2));
    return {
      statusCode: 500,
      body: 'Error sending email',
      message: JSON.stringify(e)
    };
  }

  return {
    statusCode: 200,
    body: 'Email sent'
  };
};

export default sendEmail;
