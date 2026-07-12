async function execute(device, command, currentState) {
  console.log(`[NatureRemo Adapter] Sending Local API command "${command}" to ${device.name}`);
  // console.log(`[NatureRemo Adapter] Target local IP: ${device.localIP}`);

  // added to support the usage of React Frontend
  let power = currentState.power || 'off';
  let temp = currentState.temp || 24;
  if (command === 'turnOn') power = 'on';
  if (command === 'turnOff') power = 'off';
  if (command === 'increaseTemp') temp += 1;
  if (command === 'decreaseTemp') temp -= 1;

  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, newState: { power, temp } };
}

module.exports = { execute };