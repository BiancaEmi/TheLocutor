const { SSL_OP_EPHEMERAL_RSA } = require("constants");

const puppeteer = require("puppeteer");

const running = true;

(async function main() {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    while (running) {

        if (await isLogged(page)) {
            console.log("Logado");
        }
        else {
            await tryLogin(page);
        };

        await sleep(10000);

    };

})();



async function isLogged(page) {

    returnValue = false;

    await page.goto("https://locucaobrasil.com.br/painel/informacoes/termos-de-uso-locutor");

    returnValue = await page.evaluate(() => {
        let el = document.querySelector("input[value='1452']")
        return el ? true : false
    })

    return returnValue;
}



async function tryLogin(page) {

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

  return true;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
