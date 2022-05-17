import { APIGatewayProxyHandler } from 'aws-lambda';
import { Lambda } from 'aws-sdk';
import * as sgMail from '@sendgrid/mail';

const lambda = new Lambda({
  region: 'us-east-1'
});

const params: Lambda.InvocationRequest = {
  FunctionName: 'cambios-altoque-dev-create',
  InvocationType: 'RequestResponse'
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail: APIGatewayProxyHandler = async () => {
  const { Payload } = await lambda.invoke(params).promise();

  const { body } = JSON.parse(Payload as string);

  const buffer = Buffer.from(body, 'base64');

  const msg: sgMail.MailDataRequired = {
    to: 'lematosdev@gmail.com',
    from: 'carlosmatos13@gmail.com', // Use the email address or domain you verified above
    subject: 'Prueba envio de Tasa automatico',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    attachments: [
      {
        content: buffer.toString('base64'),
        filename: 'output.png',
        type: 'image/png',
        disposition: 'attachment'
      }
    ]
  };

  try {
    await sgMail.send(msg, false);
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
