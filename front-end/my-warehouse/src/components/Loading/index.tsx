const Loading: React.FC<{ status: boolean }> = ({ status }) => {
  return (
    status === true && (
      <div
        id="loading-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-base-300 bg-opacity-60"
      >
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    )
  );
};

export default Loading;
