import { RiWifiOffLine } from "react-icons/ri";
const OfflineStatus = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="text-center bg-[#0a0f1c] border border-cyan-500 shadow-[0_0_20px_#00FFF7] rounded-2xl p-8 max-w-md w-full animate-fade-in transition-all">
        <div className="mb-4">
          <RiWifiOffLine
            size={60}
            className="text-sky-500 mx-auto animate-pulse"
          />
        </div>
        <h1 className="text-3xl font-bold text-pink-500 mb-2 tracking-wide">
          ⚠️ You Are Offline
        </h1>
        <p className="text-cyan-300 mb-6 text-sm">
          Lost connection to the Matrix. Please check your network to return.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="py-2 px-6 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          Reconnect 🔁
        </button>
      </div>
    </div>
  );
};

export default OfflineStatus;
