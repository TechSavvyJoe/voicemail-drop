'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Phone, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react'
import { motion } from 'framer-motion'

interface DNCRecord {
  id: string
  phone_number: string
  added_at: string
  reason: string
}

interface ConsentRecord {
  id: string
  phone_number: string
  consent_given: boolean
  consent_date: string
  consent_method: string
  organization_id: string
}

interface AuditRecord {
  id: string
  phone_number: string
  action: string
  result: boolean
  reason: string
  created_at: string
}

export default function TCPACompliancePage() {
  const [dncRecords, setDncRecords] = useState<DNCRecord[]>([])
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([])
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const [newOptOut, setNewOptOut] = useState({ phoneNumber: '', reason: '' })
  const [checkPhoneNumber, setCheckPhoneNumber] = useState('')
  const [checkResult, setCheckResult] = useState<{ phoneNumber: string; isOnDoNotCallList: boolean; message: string } | null>(null)

  useEffect(() => {
    loadTCPAData()
  }, [])

  const loadTCPAData = async () => {
    setLoading(true)
    try {
      // Load sample data for demo
      setDncRecords([
        {
          id: '1',
          phone_number: '+1234567890',
          added_at: new Date().toISOString(),
          reason: 'User requested opt-out'
        }
      ])
      
      setConsentRecords([
        {
          id: '1',
          phone_number: '+1987654321',
          consent_given: true,
          consent_date: new Date().toISOString(),
          consent_method: 'website',
          organization_id: 'org1'
        }
      ])

      setAuditRecords([
        {
          id: '1',
          phone_number: '+1234567890',
          action: 'opt_out',
          result: true,
          reason: 'User requested opt-out',
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Failed to load TCPA data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOptOut = async () => {
    if (!newOptOut.phoneNumber.trim()) return

    try {
      const response = await fetch('/api/tcpa/opt-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: newOptOut.phoneNumber,
          reason: newOptOut.reason || 'Manual opt-out'
        })
      })

      if (response.ok) {
        setNewOptOut({ phoneNumber: '', reason: '' })
        loadTCPAData()
      }
    } catch (error) {
      console.error('Failed to add opt-out:', error)
    }
  }

  const checkDNCStatus = async () => {
    if (!checkPhoneNumber.trim()) return

    try {
      const response = await fetch(`/api/tcpa/opt-out?phoneNumber=${encodeURIComponent(checkPhoneNumber)}`)
      const result = await response.json()
      setCheckResult(result)
    } catch (error) {
      console.error('Failed to check DNC status:', error)
    }
  }

  const exportReport = () => {
    const data = {
      dncRecords,
      consentRecords,
      auditRecords,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tcpa-compliance-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading TCPA compliance data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TCPA Compliance Center</h1>
                  <p className="text-gray-600">Manage Do Not Call lists and consent tracking</p>
                </div>
              </div>
              <button
                onClick={exportReport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'dnc', label: 'Do Not Call List', icon: Phone },
              { id: 'consent', label: 'Consent Management', icon: CheckCircle },
              { id: 'audit', label: 'Audit Log', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Phone className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Do Not Call List</p>
                    <p className="text-2xl font-bold text-gray-900">{dncRecords.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Consent Records</p>
                    <p className="text-2xl font-bold text-gray-900">{consentRecords.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Audit Entries</p>
                    <p className="text-2xl font-bold text-gray-900">{auditRecords.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add to DNC */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Add to Do Not Call List</h3>
                  <div className="space-y-3">
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={newOptOut.phoneNumber}
                      onChange={(e) => setNewOptOut(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      value={newOptOut.reason}
                      onChange={(e) => setNewOptOut(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleOptOut}
                      className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Add to DNC List
                    </button>
                  </div>
                </div>

                {/* Check DNC Status */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Check DNC Status</h3>
                  <div className="space-y-3">
                    <input
                      type="tel"
                      placeholder="Phone number to check"
                      value={checkPhoneNumber}
                      onChange={(e) => setCheckPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={checkDNCStatus}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Check Status
                    </button>
                    {checkResult && (
                      <div className={`p-3 rounded-md ${
                        checkResult.isOnDoNotCallList 
                          ? 'bg-red-50 text-red-800 border border-red-200' 
                          : 'bg-green-50 text-green-800 border border-green-200'
                      }`}>
                        <div className="flex items-center">
                          {checkResult.isOnDoNotCallList ? (
                            <AlertTriangle className="h-4 w-4 mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm font-medium">{checkResult.message}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* DNC List Tab */}
        {activeTab === 'dnc' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Do Not Call List</h2>
              <p className="text-sm text-gray-600">Phone numbers that have opted out of voicemail campaigns</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dncRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.phone_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.added_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'consent' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Consent Management</h2>
            <p className="text-gray-600">Consent tracking functionality coming soon...</p>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h2>
            <p className="text-gray-600">Audit log functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
