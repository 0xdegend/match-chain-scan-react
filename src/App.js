import "./App.css";
import { useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import Explorer from "./Components/Explorer/Explorer";
import LiveData from "./Components/LiveData/LiveData";
import {
  WalletContext,
  BalanceContext,
  TranSactionsContext,
} from "./Context/WalletContext";
import { useState } from "react";
import LiveBlock from "./Components/LiveBlock/LiveBlock";
import { sepolia } from "viem/chains";
import Footer from "./Components/Footer/Footer";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, http } from "wagmi";

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tranLists, setTranLists] = useState([]);
  useEffect(() => {
    if (!window.ethereum) {
      alert("Kindly Install Metamask Extension");
    }
  }, []);
  return (
    <PrivyProvider
      appId={`${process.env.REACT_APP_PRIVY_KEY_APP_ID}`}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <TranSactionsContext.Provider value={[tranLists, setTranLists]}>
          <BalanceContext.Provider value={[balance, setBalance]}>
            <WalletContext.Provider value={[wallet, setWallet]}>
              <NavBar />
              <Explorer />
              <LiveData />
              <LiveBlock />
              <Footer />
            </WalletContext.Provider>{" "}
          </BalanceContext.Provider>{" "}
        </TranSactionsContext.Provider>
      </WagmiProvider>
    </PrivyProvider>
  );
}

export default App;
