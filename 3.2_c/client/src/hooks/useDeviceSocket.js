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

  return { devices, states, sendCommand };
}