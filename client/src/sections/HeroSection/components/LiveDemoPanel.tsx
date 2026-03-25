export const LiveDemoPanel = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-12 rounded-2xl border border-neutral-200 shadow-xl overflow-hidden bg-black">
      <video
        className="w-full h-auto block"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/demo-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
