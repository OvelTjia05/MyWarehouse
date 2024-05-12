import { useEffect } from "react";

const Confirm: React.FC<{
  text: string;
  isVisible: boolean;
  onClose: Function;
  onConfirm: Function;
}> = ({ text, isVisible, onClose, onConfirm }) => {
  useEffect(() => {
    const handleCloseKey = (e: any) => {
      console.log("sdfsss");
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleCloseKey);
    return () => window.removeEventListener("keydown", handleCloseKey);
  }, []);

  return (
    isVisible && (
      <div className="flex fixed inset-0 z-20 bg-opacity-30 bg-slate-700 shadow backdrop-blur-sm justify-center items-center">
        <div className="flex flex-col gap-3 rounded-lg bg-base-100 min-w-[300px] max-h-[300px] p-3 relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 text-error"
            onClick={() => onClose()}
          >
            ✕
          </button>
          <h3 className="font-bold text-secondary">Confirm Action</h3>
          <p>{text}</p>
          <div className="flex flex-row gap-3 justify-end [&>.btn]:text-white">
            <button className="btn bg-error" onClick={() => onClose()}>
              Cancel
            </button>
            <button className="btn bg-primary" onClick={() => onConfirm()}>
              OK
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Confirm;
