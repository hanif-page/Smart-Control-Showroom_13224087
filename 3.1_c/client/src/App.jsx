import { useDeviceSocket } from './hooks/useDeviceSocket';
import DeviceCard from './components/DeviceCard';

export default function App() {
  const { devices, states, sendCommand, simulatePhysicalPush } = useDeviceSocket();

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <img src="/Nakayama_RemovedBg.png" alt="Nakayama logo" className="h-8 -ml-2.5" />
          {/* <span className="text-2xl font-bold text-red-600">Nakayama</span> */}
        </div>
        <p className="italic font-bold text-red-600 mb-6 text-left">
          IoT - PLC Team Case Study - ITB de Labo 2026 Recruitment
        </p>

        <div className="border border-black rounded-xl pl-6 pr-6 pb-6">
          <h1 className="text-2xl font-bold text-center">
            Smart Control Showroom Demo (Problem 3.1.c Answer)
          </h1>

          <section className="border border-red-400 rounded-lg p-4 mb-6">
            <h2 className="font-bold mb-4 text-left">Physical devices representation</h2>
            <div className="grid grid-cols-3 gap-4">
              {devices.map((d) => (
                <DeviceCard
                  key={`physical-${d.deviceID}`}
                  device={d}
                  state={states[d.deviceID]}
                  onCommand={(id, command) => simulatePhysicalPush(id, states[id], command)}
                />
              ))}
            </div>
          </section>

          <section className="border border-red-400 rounded-lg p-4">
            <h2 className="font-bold mb-4 text-left">Digital twin (displayed in the web app)</h2>
            <div className="grid grid-cols-3 gap-4">
              {devices.map((d) => (
                <DeviceCard
                  key={`twin-${d.deviceID}`}
                  device={d}
                  state={states[d.deviceID]}
                  onCommand={sendCommand}
                />
              ))}
            </div>
          </section>
        </div>

        <p className="text-center text-sm mt-4">
          Developed by <span className="italic font-bold">Muhammad Ammar Hanif (13224087)</span>
        </p>
      </div>
    </div>
  );
}