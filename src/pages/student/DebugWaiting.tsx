import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Déclaration globale pour l'API Jitsi
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function DebugWaiting() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const jitsiContainer = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const loadJitsiScript = () => {
    return new Promise<void>((resolve, reject) => {
      addLog("🔍 Checking if Jitsi script already loaded...");

      if (window.JitsiMeetExternalAPI) {
        addLog("✅ Jitsi script already available");
        resolve();
        return;
      }

      addLog("📥 Loading Jitsi script from CDN...");
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.onload = () => {
        addLog("✅ Jitsi script loaded successfully");
        setIsJitsiLoaded(true);
        resolve();
      };
      script.onerror = (error) => {
        addLog(`❌ Failed to load Jitsi script: ${error}`);
        reject(new Error("Failed to load Jitsi Meet script"));
      };
      document.head.appendChild(script);
    });
  };

  const initializeJitsi = async () => {
    addLog("🎥 Starting Jitsi initialization...");

    const roomName = `debug-room-${Date.now()}`;
    const teacherName = "Prof. Debug";

    addLog(`📡 Room name: ${roomName}`);
    addLog(`👨‍🏫 Teacher name: ${teacherName}`);

    try {
      addLog("📜 Loading Jitsi script...");
      await loadJitsiScript();
      addLog("✅ Jitsi script loaded successfully");

      if (jitsiContainer.current && window.JitsiMeetExternalAPI) {
        addLog("🏗️ Creating Jitsi instance...");

        const options = {
          roomName: roomName,
          width: "100%",
          height: "400px",
          parentNode: jitsiContainer.current,
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: true,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
          userInfo: {
            displayName: "Debug User",
          },
        };

        addLog("⚙️ Creating Jitsi API with options...");
        const api = new window.JitsiMeetExternalAPI("meet.jit.si", options);
        addLog("🎉 Jitsi API created successfully!");

        // Event listeners
        api.addEventListeners({
          readyToClose: () => {
            addLog("🚪 Jitsi ready to close");
            api.dispose();
            setJitsiApi(null);
          },
          videoConferenceJoined: () => {
            addLog("🎊 Successfully joined the video conference!");
          },
          videoConferenceLeft: () => {
            addLog("👋 Left the video conference");
          },
        });

        setJitsiApi(api);
        addLog("💾 Jitsi API saved to state");
      } else {
        addLog("❌ Missing jitsiContainer or JitsiMeetExternalAPI");
        addLog(`Container ref: ${jitsiContainer.current ? "Available" : "Missing"}`);
        addLog(`JitsiMeetExternalAPI: ${window.JitsiMeetExternalAPI ? "Available" : "Missing"}`);
      }
    } catch (error) {
      addLog(`💥 Error initializing Jitsi: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const destroyJitsi = () => {
    if (jitsiApi) {
      addLog("🗑️ Destroying Jitsi instance...");
      jitsiApi.dispose();
      setJitsiApi(null);
      addLog("✅ Jitsi instance destroyed");
    }
  };

  useEffect(() => {
    addLog("🚀 Debug page loaded");
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🐛 Debug Jitsi Integration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>🎛️ Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={initializeJitsi} disabled={!!jitsiApi} className="w-full">
                🎥 Initialize Jitsi
              </Button>

              <Button onClick={destroyJitsi} disabled={!jitsiApi} variant="destructive" className="w-full">
                🗑️ Destroy Jitsi
              </Button>

              <Button onClick={clearLogs} variant="outline" className="w-full">
                🧹 Clear Logs
              </Button>

              <div className="text-sm space-y-2">
                <div>
                  <strong>Status:</strong>
                  <div className="mt-1">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isJitsiLoaded ? "bg-green-500" : "bg-red-500"}`}></span>
                    Jitsi Script: {isJitsiLoaded ? "Loaded" : "Not Loaded"}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${jitsiApi ? "bg-green-500" : "bg-red-500"}`}></span>
                    Jitsi API: {jitsiApi ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Debug Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg h-80 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jitsi Container */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🎥 Jitsi Meet Container</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={jitsiContainer} className="w-full bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: "400px" }}>
              {!jitsiApi && (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🎥</div>
                    <p>Click "Initialize Jitsi" to start</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
