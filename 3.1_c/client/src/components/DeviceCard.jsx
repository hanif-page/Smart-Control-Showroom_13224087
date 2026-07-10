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

      {device.type === 'NatureRemo' && (
        <div className={`flex items-center gap-2 text-sm mt-2 ${
            isOn ? 'opacity-100' : 'opacity-20'
        }`} 
        >
          <span className="text-gray-400">Temperature:</span>
          <span className="font-bold text-green-600">{state?.temp ?? '--'}° C</span>
          <button
            onClick={() => {
              if(isOn) onCommand(device.deviceID, 'decreaseTemp');
            }}
            className={`px-2 border rounded ${
              !isOn ? 'cursor-none' : ''
            }`}
          >
            -
          </button>
          <button
            onClick={() => {
              if(isOn) onCommand(device.deviceID, 'increaseTemp');
            }}
            className={`px-2 border rounded ${
              !isOn ? 'cursor-none' : ''
            }`}
          >
            +
          </button>
        </div>
      )}

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