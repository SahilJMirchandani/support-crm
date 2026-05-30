import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'

function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-600">🎫 Support CRM</h1>
        <button
          onClick={() => navigate('/create')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + New Ticket
        </button>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/tickets/:ticket_id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App