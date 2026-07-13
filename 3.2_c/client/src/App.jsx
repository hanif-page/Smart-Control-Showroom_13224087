import { useDeviceSocket } from './hooks/useDeviceSocket';
import { useState, useEffect } from "react"; // new, for loader
import { useProgress } from "@react-three/drei"; // new, for loader
import DeviceCard from './components/DeviceCard';
import Scene3D from './components/Scene3D';
import CCTVViewer from './components/CCTVViewer';

function GlobalLoader() {
    const { progress } = useProgress();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (progress === 100) {
            // Add a tiny 500ms delay before hiding to ensure the canvas has fully painted
            const timer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
            
            <img 
                src="/Nakayama_Logo.png" 
                alt="Nakayama Logo" 
                className="h-16 mb-6 object-contain"
            />
            
            <span className="text-lg font-medium text-gray-800 mb-4">
                Loading Nakayama Smart Control Showroom...
            </span>
            
            <div className="w-72 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <span className="text-sm mt-3 text-gray-500 font-bold tracking-wider">
                {progress.toFixed(0)}%
            </span>
        </div>
    );
}

export default function App() {
  const { devices, states, sendCommand } = useDeviceSocket();

  return (
    <>    
    <GlobalLoader />

    <div className="min-h-screen py-4 px-4">
      <div className="max-w-7xl w-[90%] mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <img src="/Nakayama_RemovedBg.png" alt="Nakayama logo" className="h-8 -ml-2.5" />
        </div>
        <p className="italic font-bold text-red-600 mb-6 text-left">
          IoT - PLC Team Case Study - ITB de Labo 2026 Recruitment
        </p>

        <div className="border border-black rounded-xl pl-3 pr-3 pb-6">
          <h1 className="text-2xl font-bold text-center">
            Smart Control Showroom Demo (Problem 3.2.c Answer)
          </h1>

          <section className="flex gap-2">
            <section className="w-[45%] border border-red-400 rounded-lg p-4 mb-2">
              <h2 className="font-bold mb-4 text-left">3D Digital Twin</h2>
              <Scene3D states={states} />
            </section>

            <section className="w-[55%] mb-2 flex flex-col justify-center">
              <section className="w-[100%] border border-red-400 rounded-lg p-4 mb-2">
                  <h2 className="font-bold mb-4 text-left">3D Digital Twin Control</h2>
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

              <section className="w-[100%] border border-red-400 rounded-lg p-4 mb-2">
                <h2 className="font-bold mb-4 text-left">Physical Devices Control</h2>
                <div className="grid grid-cols-3 gap-4">
                  {devices.map((d) => (
                    <DeviceCard
                      key={`physical-${d.deviceID}`}
                      device={d}
                      state={states[d.deviceID]}
                      onCommand={sendCommand}
                    />
                  ))}
                </div>
              </section>
            </section>
  
          </section>

          <section className="border border-red-400 rounded-lg p-4 mb-6">
            <h2 className="font-bold mb-4 text-left">CCTV Live Stream</h2>
            <CCTVViewer />
          </section>

        </div>

        <p className="text-center text-sm mt-4">
          Developed by <span className="italic font-bold">Muhammad Ammar Hanif (13224087)</span>
        </p>
      </div>
    </div>
    </>
  );
}