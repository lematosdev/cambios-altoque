import { APIGatewayProxyHandler } from 'aws-lambda';
import { Lambda, S3 } from 'aws-sdk';
import {
  createCanvas,
  loadImage,
  registerFont
} from 'canvas';
import { join } from 'path';

const lambda = new Lambda({
  region: 'us-east-1'
});

const params: Lambda.InvocationRequest = {
  FunctionName: 'cambios-altoque-dev-fetch',
  InvocationType: 'RequestResponse'
};

const s3 = new S3();

const createImage: APIGatewayProxyHandler = async () => {
  const { Payload } = await lambda.invoke(params).promise();

  const { body } = JSON.parse(Payload as string);

  const rate = Number(JSON.parse(body));

  const { Body: s3img } = await s3
    .getObject({
      Bucket: 'cambios-altoque',
      Key: 'base/base.png'
    })
    .promise();

  if (!s3img)
    return { statusCode: 500, body: 'No image found' };

  const date = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long'
  })
    .format(new Date())
    .replace(/\sde\s/g, '-')
    .toUpperCase();

  const currentYear = String(new Date().getFullYear());

  registerFont(
    join(
      __dirname,
      '..',
      'assets',
      'fonts',
      'GlacialIndifference-Bold.otf'
    ),
    { family: 'Glacial Indifference Bold' }
  );

  registerFont(
    join(
      __dirname,
      '..',
      'assets',
      'fonts',
      'GlacialIndifference-Regular.otf'
    ),
    { family: 'Glacial Indifference' }
  );
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext('2d');

  const img = await loadImage(s3img as Buffer);

  ctx.drawImage(img, 0, 0);

  ctx.font = '158px "Glacial Indifference Bold"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(
    String(rate),
    canvas.width / 2,
    canvas.height / 2 - 20
  );

  ctx.font = '50px "Glacial Indifference"';
  ctx.textAlign = 'center';
  ctx.fillText(
    date,
    canvas.width / 2,
    canvas.height / 2 + 180
  );

  ctx.textAlign = 'center';
  ctx.fillText(
    currentYear,
    canvas.width / 2,
    canvas.height / 2 + 225
  );
  try {
    await s3
      .putObject({
        Bucket: 'cambios-altoque',
        Key: 'output/output.png',
        Body: canvas.toBuffer()
      })
      .promise();
    return { statusCode: 200, body: canvas.toBuffer() };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};

export default createImage;
