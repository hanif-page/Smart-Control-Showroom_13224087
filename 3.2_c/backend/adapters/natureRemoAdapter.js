async function execute(device, command, currentState) {
  console.log(`[NatureRemo Adapter] Sending Local API command "${command}" to ${device.name}`);

  // added to support the usage of React Frontend
  let power = currentState.power || 'off';
  if (command === 'turnOn') power = 'on';
  if (command === 'turnOff') power = 'off';

  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, newState: { power } };
}

module.exports = { execute };