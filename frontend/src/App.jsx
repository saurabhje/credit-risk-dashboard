import SummaryStats from "./components/summaryStats"
import ClientTable from "./components/ClientTable"
function App() {
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Credit Risk Management</h1>
      <SummaryStats />
      <ClientTable />
    </div>
  )
}

export default App
