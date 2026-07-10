async function execute(device, command) {
  console.log(`[SwitchBot Adapter] Sending Cloud API command "${command}" to ${device.name}`);
  await new Promise(resolve => setTimeout(resolve, 200));
  newState = {
    power: "on"
  }
  if(command == "turnOff"){
    newState.power = "off"
  }
  return { success: true, newState: newState };
}

module.exports = { execute };