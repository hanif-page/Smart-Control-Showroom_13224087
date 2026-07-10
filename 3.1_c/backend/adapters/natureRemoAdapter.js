async function execute(device, command) {
  console.log(`[NatureRemo Adapter] Sending Local API command "${command}" to ${device.name}`);
  console.log(`[NatureRemo Adapter] Target local IP: ${device.localIP}`);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, newState: { power: "on", temp: 24 } };
}

module.exports = { execute };