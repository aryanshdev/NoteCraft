function SystemMSG({ msg }) {
  return (
    <>
      <div className="w-full h-fit rounded-2xl bg-yellow-700 text-white text-center bg-opacity-35 text-base py-1 px-2">
        <span className="text-amber-400 font-semibold">SYSTEM :</span> {msg}
      </div>
    </>
  );
}

export default SystemMSG;
