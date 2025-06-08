export default function StatusPage() {
  return (
    <div className="flex flex-col items-start px-10 py-5 justify-start h-screen w-screen   text-white ">
      <h1 className="text-4xl font-semibold mb-4">Service Status</h1>
      <table className="cell-">
        <thead className="text-2xl font-semibold mb-2 ">
          <tr className="text-left w-40">
            <th className="font-semibold pl-0 pr-40 bg-white bg-opacity-5 py-2 text-left">Service</th>
            <th className="font-semibold pl-0 pr-40 bg-white bg-opacity-5 py-2 text-left">Status</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
