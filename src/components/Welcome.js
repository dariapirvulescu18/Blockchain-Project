// import '../styles/App.css';

import { useWeb3 } from '../utils/Context';
import { connectWalletMetamask} from '../utils/EthersUtils'
import { useNavigate } from 'react-router-dom';


export const Welcome = () => {
  const { initializeWallet } = useWeb3();
  const navigate = useNavigate();

  const accountChangedHandler = async (signer) => {
    await initializeWallet(signer);
  };

  const handleConnectMetaMaskButtonClick = async () => {
    try {
      await connectWalletMetamask(accountChangedHandler);
      navigate('/Main');
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Job Platform</p>
        <button onClick={handleConnectMetaMaskButtonClick}>
          Connect With Metamask
        </button>  
      </header>
    </div>
  );
};