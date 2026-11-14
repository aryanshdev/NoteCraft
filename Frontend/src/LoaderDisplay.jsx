function LoaderDisplay() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 z-10">
      <div className="relative h-16 w-14">
        <div className="absolute inset-0 rotate-[-6deg] rounded-sm bg-[#a2cdec] animate-pulse"></div>
        <div className="absolute inset-0 rotate-[4deg] rounded-sm bg-[#f6d860] shadow-lg animate-bounce"></div>
      </div>
      <p className="eyebrow">Fetching your notes</p>
    </div>
  );
}

export default LoaderDisplay;
