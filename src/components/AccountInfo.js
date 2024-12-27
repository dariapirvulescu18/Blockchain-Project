import { Box, Text, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useState } from 'react';

function AccountInfo({ account, balance }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
    setIsConnecting(false);
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      {account ? (
        <>
          <Text>Account: {account}</Text>
          <Text>Balance: {balance} ETH</Text>
        </>
      ) : (
        <Button
          onClick={connectWallet}
          isLoading={isConnecting}
          loadingText="Connecting..."
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}

export default AccountInfo;