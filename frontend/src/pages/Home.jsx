import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const statusColors = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-gray-100 text-gray-600',
}

export default function Home() {
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTickets()
  }, [search, status])

  const fetchTickets = async () => {
    const params = {}
    if (search) params.search = search
    if (status) params.status = status
    const res = await axios.get('/api/tickets', { params })
    setTickets(res.data)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-lg">No tickets found</p>
          <p className="text-sm mt-1">Create your first ticket to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr
                  key={ticket.ticket_id}
                  onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                  className="border-b border-gray-100 hover:bg-purple-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-mono text-purple-600">{ticket.ticket_id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{ticket.customer_name}</div>
                    <div className="text-gray-400 text-xs">{ticket.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{ticket.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}