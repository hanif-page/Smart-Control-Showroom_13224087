async function execute(device, command, currentState) {
  console.log(`[Roomba Adapter] Publishing MQTT command "${command}" to ${device.name}`);

  // added to support the usage of React Frontend
  let status = currentState.status || 'idle';
  let power = currentState.power || 'off';
  if (command === 'turnOn') { power = 'on'; status = 'cleaning'; }
  if (command === 'turnOff') { power = 'off'; status = 'idle'; }

  await new Promise(resolve => setTimeout(resolve, 150));
  return { success: true, newState: { power, status } };
}

module.exports = { execute };