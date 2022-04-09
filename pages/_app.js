import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  //npm install web3 --save  
  const Web3 = require("web3");
  const myWallet = "0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5";

  function scanBalance(walletAddress) {

    //создал проект в Infura и оттуда добавил ID проекта
    //const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/YOUR_PROJECT_ID")
    const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/8c1d65765fbe49eab889cca49c4906c4"))

    web3.eth.getBalance(walletAddress, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
  }

  //изначально просканировать баланс
  scanBalance(myWallet);

  //1 здесь будет функция перевода денег на другой адрес, если баланс > 0 

  //если баланс изменился, снова просканировать

  //scanBalance(myWallet);

  //1 здесь будет функция перевода денег на другой адрес, если баланс > 0 

  return <Component {...pageProps} />
}

export default MyApp
