const { SSL_OP_EPHEMERAL_RSA } = require("constants");

const puppeteer = require("puppeteer");
const running = true;
const currentCourse = 'check_record_list';

var sleepTime = 10000;
var lastUpdate = -1;


(async function main() {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://locucaobrasil.com.br/painel/informacoes/termos-de-uso-locutor");

  while (running) {

        if (await isLogged(page)) {

          console.log('==========================');
          //console.log(element);
          //console.log(value);
          //let element = await page.$('div selector')
          //let value = await page.evaluate(el => el.textContent, element)
          //const element = await page.$('.top-bar div[data-notificacoes]');
          //console.log(element);
          /*
          for(var i = 0; i < elements.length;i++)
          {
            console.log(elements[i]);
            //const textProp = await elements[i].getProperty('updates');
            //var text = await textProp.jsonValue();
            //console.log("Text Result ",text);
          }*/          

          //.top-bar div[data-notificacoes] div.dropdown 

          //const recordCount = await page.$eval("span[controlenews]", el => el.getAttribute("gravar"));

          //console.log(recordCount);


          switch (currentCourse) {
            case 'check_record_list':
              await checkRecordTable(page);
              break;

            case 'Mangoes':

            case 'Papayas':
              console.log('Mangoes and papayas are $2.79 a pound.');
              // expected output: "Mangoes and papayas are $2.79 a pound."
              break;
            default:
              //console.log(`Sorry, we are out of ${currentCourse}.`);
          }
          
          await sleep(30000);
        }
        else {
            await tryLogin(page);
            await sleep(10000);
        };

        console.log('-------------------');
        console.log(`currentCourse : ${currentCourse}.`);
        let date_ob = new Date();
        console.log(date_ob.toTimeString());
        

        
    };

})();



async function isLogged(page) {

    var returnValue = false;
    //await page.waitForNavigation({ waitUntil: "load" });

    // Isso aqui está executando o javascript na pagina...ahahahahhahahahahahahhahhah
    returnValue = await page.evaluate(() => {
        let el = document.querySelector("input[value='1452']")
        return el ? true : false
    })

    return returnValue;
}


async function checkRecordTable(page) {

  console.log('Staring checkRecordTable');

  await page.goto("https://locucaobrasil.com.br/painel/gravar");
  await page.waitForNavigation({ waitUntil: "load" });
  console.log('------2');

  await page.waitForSelector('#tGravar', { timeout: 5000 } );
  
  console.log('------3');

  const tableArray = await page.$$eval('#tGravar tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  });


  console.log(tableArray);

  

}





async function tryLogin(page) {

  await page.goto("https://locucaobrasil.com.br/painel/");
  //await page.screenshot({ path: "example.png" });

  // Type our query into the form
  let input = await page.waitForSelector(
    'input.intro-x.login__input.input.input--lg.border.border-gray-300.block[type="text"]'
  );
  await input.type("aureolopes");
  input = await page.waitForSelector(
    'input.intro-x.login__input.input.input--lg.border.border-gray-300.block.mt-4[type="password"]'
  );
  await input.type("indio6678");
  //await page.screenshot({ path: "example2.png" });

  // Submit form
  page.keyboard.press("Enter");

  // Wait for search results page to load
  await page.waitForNavigation({ waitUntil: "load" });
  //await page.screenshot({ path: "example3.png" });

  return true;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
