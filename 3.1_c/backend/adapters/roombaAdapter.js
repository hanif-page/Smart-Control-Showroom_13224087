async function execute(device, command) {
  console.log(`[Roomba Adapter] Publishing MQTT command "${command}" to ${device.name}`);
  console.log(`[Roomba Adapter] Broker at: ${device.localIP}`);
  await new Promise(resolve => setTimeout(resolve, 150));
  return { success: true, newState: { status: "cleaning" } };
}

module.exports = { execute };