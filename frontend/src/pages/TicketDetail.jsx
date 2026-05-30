import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const statusColors = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-gray-100 text-gray-600',
}

export default function TicketDetail() {
  const { ticket_id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState('')
  const [noteText, setNoteText] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchTicket = useCallback(async () => {
    const res = await axios.get(`/api/tickets/${ticket_id}`)
    setTicket(res.data)
    setStatus(res.data.status)
  }, [ticket_id])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const handleUpdate = async () => {
    setLoading(true)
    setMessage('')
    try {
      await axios.put(`/api/tickets/${ticket_id}`, {
        status,
        note_text: noteText,
      })
      setNoteText('')
      setMessage('Ticket updated successfully!')
      fetchTicket()
    } catch {
      setMessage('Something went wrong.')
    }
    setLoading(false)
  }

  if (!ticket) {
    return <div className="text-center py-20 text-gray-400">Loading ticket...</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/')} className="text-sm text-purple-600 hover:underline">
        Back to all tickets
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="font-mono text-purple-600 text-sm">{ticket.ticket_id}</span>
            <h2 className="text-xl font-bold text-gray-800 mt-1">{ticket.subject}</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-400">Customer</p>
            <p className="font-medium text-gray-800">{ticket.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium text-gray-800">{ticket.customer_email}</p>
          </div>
          <div>
            <p className="text-gray-400">Created</p>
            <p className="font-medium text-gray-800">{new Date(ticket.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400">Last Updated</p>
            <p className="font-medium text-gray-800">{new Date(ticket.updated_at).toLocaleString()}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Description</p>
          <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{ticket.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Update Ticket</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add a Note</label>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={3}
              placeholder="Add an internal note or update..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Ticket'}
          </button>
        </div>
      </div>

      {ticket.notes && ticket.notes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Notes History</h3>
          <div className="space-y-3">
            {ticket.notes.map(note => (
              <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{note.note_text}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(note.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}