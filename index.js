const {remote}  =  require('webdriverio');
const fs = require('fs');

async function getElementByPath (cssSelector){
  return await this.browser.waitUntil(async () => {
      const webElement = await this.browser.$(cssSelector);
      return webElement;
  }, {
      timeout: 60 * 1000, // 60 seconds
      timeoutMsg: 'Web Element extraction failed'
  });
}

async function getElementsByPath (cssSelector){
  return await this.browser.waitUntil(async () => {
      const webElements = await this.browser.$$(cssSelector);
      return webElements;
  }, {
      timeout: 60 * 1000, // 60 seconds
      timeoutMsg: 'Web Element extraction failed'
  });
}

async function clickElement (webElement){
  await webElement.click();
}

async function openPage(URL){
  await this.browser.url(URL);

  await this.browser.waitUntil(
  async () => await this.browser.execute(() => this.document.readyState === 'complete'),//in fact doesn't work need to be fixed
  {
    timeout: 60 * 1000, // 60 seconds
    timeoutMsg: 'Message on failure'
  });
}

async function readFileAndSplitByLines(filePath){
  let file = fs.readFileSync(filePath).toString();
  return file.split('\r\n');
}

async function performAsyncTask() {//function that will start execution after "node index.js"
  this.browser = await remote({
  capabilities: { browserName: 'chrome' }
  });//start chrome browser

  let linksFromFile = await readFileAndSplitByLines("links.txt");

  for(const link of linksFromFile){//for each link from file links.txt
    await openPage(link);

    let elements = await getElementsByPath("//body//a");//extract all links on page by xpath 
    
    for(const element of elements){
      let a = await element.getAttribute("href");//extract the link text itself "href value"
      if(a.includes("https")){//onlt for links containing https
        fs.appendFileSync('answer.txt', "\n"+a);//append into file with new line
      }
    }
  }

  await this.browser.deleteSession();//close chrome after extraction 
}

performAsyncTask();//main function call 