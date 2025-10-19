import { useState } from 'react'

function AIEstimateModal({ isOpen, onClose, onEstimate, taskName, taskType }) {
  const [requirements, setRequirements] = useState('')
  const [isEstimating, setIsEstimating] = useState(false)

  const handleSubmit = async () => {
    if (!requirements.trim()) {
      alert('Please enter some assignment requirements')
      return
    }

    setIsEstimating(true)
    try {
      await onEstimate(requirements)
      onClose()
      setRequirements('')
    } catch (error) {
      console.error('Estimation failed:', error)
    } finally {
      setIsEstimating(false)
    }
  }

  const handleClose = () => {
    setRequirements('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">AI Time Estimation</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            Paste your assignment/project requirements below for a more accurate time estimate:
          </p>
          <div className="text-xs text-gray-500 mb-3">
            <strong>Task:</strong> {taskName || 'Untitled'} | <strong>Type:</strong> {taskType === 'exam' ? 'Exam' : 'Assignment'}
          </div>
        </div>

        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Paste your assignment requirements, project description, or study materials here...

Example:
- Write a 10-page research paper on climate change
- Include 8+ scholarly sources  
- APA format required
- Due next Friday"
          className="w-full h-48 bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isEstimating || !requirements.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            {isEstimating ? (
              <>
                <span className="animate-spin">✦</span>
                Estimating...
              </>
            ) : (
              <>
                <span>✦</span>
                Get AI Estimate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIEstimateModal