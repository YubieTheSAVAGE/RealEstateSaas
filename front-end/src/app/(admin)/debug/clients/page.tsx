"use client"

import React, { useState } from 'react'
import Button from '@/components/ui/button/Button'

export default function ClientsDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchClientsData = async () => {
    setIsLoading(true)
    setMessage('Fetching clients data...')
    
    try {
      // This will trigger the enhanced logging in both frontend and backend
      const response = await fetch('/api/clients', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessage(`✅ Successfully fetched ${data.length} clients. Check the console for detailed logs!`)
        console.log('🎯 [Debug Page] Clients data received:', data)
      } else {
        setMessage(`❌ Error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const openBackendDisplay = () => {
    // Open the backend HTML display in a new tab
    window.open('http://localhost:3001/api/clients/display/all', '_blank')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🔍 Clients Database Debug Panel
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              📊 View All Clients Data
            </h2>
            <p className="text-blue-700 mb-4">
              This will fetch all clients from the database and display comprehensive logging in both frontend and backend consoles.
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={fetchClientsData}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? '🔄 Loading...' : '📋 Fetch Clients Data'}
              </Button>
              
              <Button 
                onClick={openBackendDisplay}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                🌐 Open HTML Display
              </Button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : message.includes('❌')
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-gray-50 border border-gray-200 text-gray-800'
            }`}>
              {message}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              📝 Instructions
            </h3>
            <ul className="text-yellow-700 space-y-2">
              <li>• <strong>Fetch Clients Data:</strong> Triggers the enhanced getClient() function with detailed console logging</li>
              <li>• <strong>Open HTML Display:</strong> Opens a formatted HTML page showing all database content</li>
              <li>• <strong>Console Logs:</strong> Check both browser console (F12) and backend terminal for detailed information</li>
              <li>• <strong>Backend Logs:</strong> The backend will log comprehensive client details including relationships</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🔗 Quick Links
            </h3>
            <div className="space-y-2">
              <div>
                <strong>Backend HTML Display:</strong> 
                <a 
                  href="http://localhost:3001/api/clients/display/all" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  http://localhost:3001/api/clients/display/all
                </a>
              </div>
              <div>
                <strong>API Endpoint:</strong> 
                <span className="ml-2 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                  GET /api/clients
                </span>
              </div>
              <div>
                <strong>Swagger Docs:</strong> 
                <a 
                  href="http://localhost:3001/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  http://localhost:3001/docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
