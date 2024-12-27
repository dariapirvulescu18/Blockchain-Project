import { useEffect, useState } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

function EventMonitor({ contract }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (contract) {
      // Listen for JobCreated events
      contract.on('JobCreated', (jobAddress, owner, description, price, event) => {
        setEvents(prev => [...prev, {
          type: 'JobCreated',
          jobAddress,
          owner,
          description,
          price: price.toString(),
          blockNumber: event.blockNumber
        }]);
      });

      // Listen for other events...
      contract.on('Applied', (applicant, event) => {
        setEvents(prev => [...prev, {
          type: 'Applied',
          applicant,
          blockNumber: event.blockNumber
        }]);
      });
    }

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [contract]);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      <Text fontSize="xl">Event Log</Text>
      <VStack align="stretch">
        {events.map((event, index) => (
          <Box key={index} p={2} bg="gray.50">
            <Text>Type: {event.type}</Text>
            <Text>Block: {event.blockNumber}</Text>
            {event.type === 'JobCreated' && (
              <>
                <Text>Job Address: {event.jobAddress}</Text>
                <Text>Owner: {event.owner}</Text>
                <Text>Price: {ethers.utils.formatEther(event.price)} ETH</Text>
              </>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default EventMonitor;