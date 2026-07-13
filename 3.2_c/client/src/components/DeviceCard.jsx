import StatusDot from './StatusDot';

export default function DeviceCard({ device, state, onCommand }) {
  const isOn = state?.power === 'on';

  return (
    <div className="border rounded-lg p-4 relative w-full">
      <div className="absolute top-3 right-3">
        <StatusDot isOn={isOn} />
      </div>
      <h3 className="font-bold text-sm mb-3">{device.name}</h3>

      <div className="flex border rounded overflow-hidden mb-2">
        <button
          onClick={() => {
            if(isOn) onCommand(device.deviceID, 'turnOff')
          }}
          className={`flex-1 py-2 text-sm font-bold ${
            isOn ? 'text-black' : 'text-gray-300'
          }`}
        >
          Turn OFF
        </button>
        <button
          onClick={() => {
            if(!isOn) onCommand(device.deviceID, 'turnOn')
          }}
          className={`flex-1 py-2 text-sm font-bold ${
            !isOn ? 'text-black' : 'text-gray-300'
          }`}
        >
          Turn ON
        </button>
      </div>

      {device.type === 'Roomba' && (
        <div className="text-sm mt-2 text-gray-400 text-left capitalize">
          Status: 
          <span className={`font-bold italic ${
            isOn ? 'text-green-600' : 'text-red-600'
          }`} 
          > {state?.status ?? 'idle'}</span>
        </div>
      )}
    </div>
  );
}