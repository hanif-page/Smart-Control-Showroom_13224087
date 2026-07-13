// client/src/hooks/useDeviceSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:3000';

export function useDeviceSocket() {
  const [devices, setDevices] = useState([]);
  const [states, setStates] = useState({});

  useEffect(() => {
    axios.get(`${SOCKET_URL}/api/devices`)
      .then((res) => {
        console.log('[Frontend] Devices loaded:', res.data);
        setDevices(res.data.devices);
        setStates(res.data.states);
      })
      .catch((err) => {
        console.error('[Frontend] Failed to load devices: ', err);
      });

    const socket = io(SOCKET_URL);

    socket.on('deviceStateChanged', ({ deviceID, state }) => {
      setStates((prev) => ({ ...prev, [deviceID]: state }));
    });

    return () => socket.disconnect();
  }, []);

  const sendCommand = async (deviceID, command) => {
    await axios.post(`${SOCKET_URL}/api/devices/command`, { deviceID, command });
  };

  // Physical Device -> Webhook/MQTT -> Web App
  const simulatePhysicalPush = async (deviceID, currentState, command) => {
    // Generate the state payload that the physical device would send via MQTT/Webhook
    const simulatedState = { 
        ...currentState,
        power: command === 'turnOn' ? 'on' : 'off' 
    };

    // If it's the Roomba, simulate its specific MQTT status payload changing
    if (deviceID.toLowerCase().includes('roomba')) {
        simulatedState.status = command === 'turnOn' ? 'cleaning' : 'idle';
    }

    // Push directly to the backend simulation webhook
    await axios.post(`${SOCKET_URL}/api/webhooks/simulate`, { 
        deviceID, 
        state: simulatedState 
    });

    console.log(`[Frontend] Updated device state from the physical device!`)
  };

  return { devices, states, sendCommand, simulatePhysicalPush };
}