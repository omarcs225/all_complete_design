import React, { useEffect } from 'react';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import SnapshotViewer from './SnapshotViewer'; 
import { setSnapshots, clearSnapshots, setLoading } from '../features/snapshots/snapshotsSlice';
import { normalizeSnapshot, calculateTotalSize, shouldAutoCollapse } from '../utils/snapshotSafetyUtils';

const CircuitPage= () => {
  const dispatch = useDispatch();
  const flexDirection = useBreakpointValue<'row' | 'column'>({
    base: 'column',
    md: 'row',
  });

const snapshotWidth = useBreakpointValue({
    base: '100%',
    md: '400px', // Fixed width for sidebar looks cleaner than percentage
    lg: '450px',
  });
  
const handleSimulationComplete = (simulationResult: any) => {
  const rawSnapshots = simulationResult.intermediateStates || [];

    if (rawSnapshots.length > 0) {
      const normalizedSnapshots = rawSnapshots.map((raw: any, index: number) =>
        normalizeSnapshot(raw, index)
      );
      
      const totalChars = calculateTotalSize(normalizedSnapshots);
      const shouldCollapse = shouldAutoCollapse(normalizedSnapshots);

      dispatch(setSnapshots({
        snapshots: normalizedSnapshots,
        totalCharacterCount: totalChars,
        autoCollapsed: shouldCollapse,
      }));
    } else {
      dispatch(clearSnapshots());
    }
    // --- NEW CODE END ---
  };
}
 // Change the layout to a Flex container that holds both the Editor and the SnapshotViewer
  return (
    <Flex direction="column" h="100vh" overflow="hidden">
       {/* Your Toolbar usually goes at the top */}
       <Toolbar onRunSimulation={handleSimulationComplete} />

       {/* Main Content Area */}
       <Flex direction={flexDirection} flex="1" overflow="hidden">
          
          {/* LEFT SIDE: Your Existing Circuit Editor */}
          <Box flex="1" position="relative" overflow="hidden">
             <CircuitEditor />
          </Box>

          {/* RIGHT SIDE: The New Snapshot Viewer */}
          <Box 
            borderLeft="1px solid" 
            borderColor="gray.200"
            bg="gray.50"
            display={{ base: 'none', md: 'block' }} // Optional: Hide on tiny screens if needed
          >
             <SnapshotViewer />
          </Box>

       </Flex>
    </Flex>
  );

export default CircuitPage;