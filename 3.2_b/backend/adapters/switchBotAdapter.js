async function execute(device, command, currentState) {
  console.log(`[SwitchBot Adapter] Sending Cloud API command "${command}" to ${device.name}`);

  // added to support the usage of React Frontend
  const power = command === 'turnOn' ? 'on' : command === 'turnOff' ? 'off' : currentState.power;

  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true, newState: { power } };
}

module.exports = { execute };