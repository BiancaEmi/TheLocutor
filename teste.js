const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const puppeteer = require("puppeteer");

async function tryLogin() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://locucaobrasil.com.br/painel/");
  await page.screenshot({ path: "example.png" });

  // Type our query into the form
  let input = await page.waitForSelector(
    'input.intro-x.login__input.input.input--lg.border.border-gray-300.block[type="text"]'
  );
  await input.type("aureolopes");
  input = await page.waitForSelector(
    'input.intro-x.login__input.input.input--lg.border.border-gray-300.block.mt-4[type="password"]'
  );
  await input.type("indio6678");
  await page.screenshot({ path: "example2.png" });

  // Submit form
  page.keyboard.press("Enter");

  // Wait for search results page to load
  await page.waitForNavigation({ waitUntil: "load" });
  await page.screenshot({ path: "example3.png" });

  return { browser, page };
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async function keepAlive() {
  let alive = true;

  while (alive) {
    const { browser, page } = await tryLogin();
    await page.goto("https://locucaobrasil.com.br/painel/gravar");

    const loaded = await page.waitForSelector("#tGravar");
    const toRecord = await page.waitForSelector("#tGravar tbody tr");
    const result = await page.$$eval("#tGravar tbody tr", (rows) => {
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("td");
        return columns[1].innerText;
      });
    });
    console.log(result);

    await sleep(1800000);

    page.close();
  }
})();
