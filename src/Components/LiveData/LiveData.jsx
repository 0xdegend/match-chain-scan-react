import React, { useState, useEffect, useContext } from "react";
import transactionImage from "../../Assets/images/icon_transaction.png";
import blockImage from "../../Assets/images/icon_block.png";
import { WalletContext } from "../../Context/WalletContext";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./LiveData.css";
import { ethers } from "ethers";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LiveData = () => {
  //let [wallet, setWallet] = useContext(WalletContext);
  let newWallet = localStorage.getItem("walletKey");
  //let [mainBalance, setBalance] = useContext(WalletContext);
  let [gasPrice, setGasPrice] = useState();
  let [ethLatestBlock, setEthLatestBlock] = useState("");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNumber = new Date();
  const labels = [
    "January",
    `${months[monthNumber.getMonth() - 2]}`,
    `${months[monthNumber.getMonth() - 1]}`,
    `${months[monthNumber.getMonth()]}`,
  ];
  let [price, setPrice] = useState("");
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const getEtherPrice = async () => {
    //console.log(dec1);
    try {
      const data = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_API_KEY}`
      );
      let convertedPrice = data.data.result.ethusd;
      //console.log(`${convertedPrice.toLocaleString()}`);
      setPrice(convertedPrice);
      // setPrice(data.data.result.ethusd);
    } catch (e) {
      console.error(e);
    }
  };
  const data = {
    labels,
    datasets: [
      {
        label: "ETH Price",
        data: [1200, 1350, 1550, `${price}`],
        borderColor: " #FE891B",
      },
    ],
  };
  const getGasPrice = async () => {
    try {
      const eth_gasPrice_Data = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${process.env.REACT_APP_API_KEY}`
      );
      const hexValue = eth_gasPrice_Data.data.result;
      const gweiValue = ethers.utils.formatUnits(hexValue, "gwei");
      const roundedValue = Math.round(Number(gweiValue));
      setGasPrice(roundedValue);
    } catch (e) {
      console.error(e);
      setGasPrice("N/A");
    }
  };
  const getBlockNumber = async () => {
    const ethBlockNumber = await axios.get(
      `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${process.env.REACT_APP_API_KEY}`
    );
    const hexTodecimal = (hex) => parseInt(hex, 16);
    const ethConvertedBlockNumber = hexTodecimal(ethBlockNumber.data.result);
    ethLatestBlock = `${ethConvertedBlockNumber.toLocaleString()}`;
    //console.log(`${ethConvertedBlockNumber.toLocaleString()}`);
    setEthLatestBlock(ethLatestBlock);
    console.log(ethLatestBlock);
  };

  useEffect(() => {
    getEtherPrice();
    getGasPrice();
    getBlockNumber();
  }, [price]);
  return (
    <>
      <div className="live-data-container">
        <div className="personal-details">
          <h5 className="eth-price">ETH Price: {price}</h5>
          <h5 className="wallet-top">
            Address: {newWallet ? `${newWallet}` : "Wallet Not Connected"}
          </h5>
        </div>
        <div className="data-container">
          <div className="blocks-data">
            <div className="transactions">
              <div className="image-text">
                <img src={transactionImage} alt="" />
                <div>
                  <h5 className="title">TRANSACTIONS</h5>
                  <p>646</p>
                </div>
              </div>
              <div className="gas-fee">
                <h5 className="title">GAS PRICE</h5>
                <p>{gasPrice} Gwei</p>
              </div>
            </div>
            <hr />
            <div className="transactions">
              <div className="image-text">
                <img src={blockImage} alt="" />
                <div>
                  <h5 className="title">LATEST BLOCK</h5>
                  <p>{ethLatestBlock}</p>
                </div>
              </div>
              <div className="gas-fee">
                <h5 className="title">WALLET ADDRESS</h5>
                <p className="wallet-address">
                  {newWallet ? `${newWallet}` : "Wallet not Connected"}
                </p>
              </div>
            </div>
          </div>
          <div className="graph">
            <Line options={options} data={data} className="line-graph" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveData;
