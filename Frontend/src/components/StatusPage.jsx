import { Link } from "react-router-dom";

export default function StatusPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6 md:mb-8">Service Status</h1>
        <h2 className="text-lg font-semibold mb-5"> Status Page For <Link to={'/'} className="italic text-sky-400">NoteCraft</Link> Services</h2>
        <div className="overflow-x-auto rounded-lg border border-gray">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black bg-opacity-65">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-lg font-medium text-white uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-medium text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-700 bg-opacity-45  text-lg">
              <tr className="hover:bg-black hover:bg-opacity-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-300">
                  Sharing
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-green-400">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    Operational
                  </span>
                </td>
              </tr>
              
              <tr className="hover:bg-black hover:bg-opacity-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-300">
                  Login-Auth
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-green-400">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    Operational
                  </span>
                </td>
              </tr>
              
              <tr className="hover:bg-black hover:bg-opacity-50 transition-colors">
                <td className="px-6 py-4 text-lg font-medium text-gray-300">
                  Notes And Groups (Creation, Managing, Updating, Deleting)
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-green-400">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    Operational
                  </span>
                </td>
              </tr>
              
              <tr className="hover:bg-black hover:bg-opacity-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-300">
                  AI Chat
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-green-400">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    Operational
                  </span>
                </td>
              </tr>
              
              <tr className="hover:bg-black hover:bg-opacity-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-300">
                  Compilers
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-yellow-400">
                    <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
                    Partially Down
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="bg-green-500 w-3 h-3 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Operational</span>
          </div>
          <div className="flex items-center">
            <div className="bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Partially Down</span>
          </div>
          <div className="flex items-center">
            <div className="bg-red-500 w-3 h-3 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Down</span>
          </div>
        </div>
        <Link to={'/dashboard'}><button className="border-white border-2 px-10 py-2 text-lg rounded-lg bg-black bg-opacity-15 my-10 flex mx-auto hover:text-black hover:bg-white font-semibold">Back To Dashboard </button></Link>
      </div>
    </div>
  );
}