var BountyAmount;

var ucashContract,uCurrenciesBountyContract;
var uCurrenciesBountyContractAddress = '0x493b7283593b314653991392946222fCC7D60E3B';
var ucashContractAddress = '0x92e52a1A235d9A103D970901066CE910AAceFD37';
var ucashABI = [{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var uCurrenciesBountiesABI = [{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"release","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"claimed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBountyAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"issuer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"recipient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"UCASHAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
var signer;
var provider;
var ethers;
var utils;

var issuer;
var recipient;
var claimed;

function initialize(_ethers, provider){
  ethers = _ethers;
  utils = ethers.utils;
  provider.listAccounts().then(function(accounts) {
//comment
    signer = provider.getSigner(accounts[0]);

    ucashContract = new _ethers.Contract(ucashContractAddress, ucashABI, signer);
    uCurrenciesBountyContract = new _ethers.Contract(uCurrenciesBountyContractAddress, uCurrenciesBountiesABI, signer);
    console.log(uCurrenciesBountyContract)
    console.log(ucashContract)

    getBountyAmount();

    getusers();
    determineIfClaimed();

    document.getElementById("SmartContractCode").innerHTML = "<a href='https://gist.github.com/antron3000/16cdd3803f8f3d37916c57da0eca2c07'> Smart Contract Code </a>";

});

}

async function updateDapp(){

}

async function claim(){
  await uCurrenciesBountyContract.claim();
}

async function release(){
  await uCurrenciesBountyContract.release();
}

async function send(){
  let amount = document.getElementById("sendAmount").value;
  amount = parseInt(amount*10**8);
  await ucashContract.transfer(uCurrenciesBountyContractAddress,amount);
}

async function getBountyAmount(){
  BountyAmount = await uCurrenciesBountyContract.getBountyAmount();
  BountyAmount = parseFloat(BountyAmount/10**8)
  document.getElementById("BountyAmount").innerHTML = "Bounty Amount: " + BountyAmount + " UCASH";
  document.getElementById("BountyAmount1").innerHTML = "Bounty Amount: " + BountyAmount + " UCASH";

}

async function getusers(){
  issuer = await uCurrenciesBountyContract.issuer();
  recipient = await uCurrenciesBountyContract.recipient();
  document.getElementById("issuer").innerHTML = "<span><B>Issuer: </b><a href='https://etherscan.io/address/"+issuer+"'>" +issuer+ "</a></span>";
  document.getElementById("recipient").innerHTML = "<span><B>Recipient: </b><a href='https://etherscan.io/address/"+recipient+"'>" +recipient+ "</a></span>";
}

async function determineIfClaimed(){
  claimed = await uCurrenciesBountyContract.claimed();
  console.log(claimed)
  if(claimed){
    document.getElementById("isClaimed").innerHTML = "  <B>Bounty is Claimed. You may now release the bounty.</b>";
    document.getElementById("releaseButton").disabled = false;

  } else{
    document.getElementById("isClaimed").innerHTML = "  <B>Bounty has not been Claimed yet. </b>";
    document.getElementById("releaseButton").disabled = true;

  }
}
