const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
  const slapid = event.path.split("/").pop()

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 4 });
  await page.goto("https://slapper.io/s/" + slapid);


  const screenshot = await page.screenshot({ encoding: "base64", clip: { 'x': 200, 'y': 170, 'width': 1200/2, 'height': 630/2 }});

  await browser.close();

  return {
    statusCode: 200,
    body: screenshot,
    isBase64Encoded: true,
  }

}