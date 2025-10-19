
import { useState } from 'react'
import { estimateTaskHours } from '../utils/aiEstimation'
import AIEstimateModal from './AIEstimateModal'

function TaskInput({ tasks, setTasks, settings, setSettings, onGenerateSchedule, scheduleErrors }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [estimatingTasks, setEstimatingTasks] = useState(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTaskForEstimate, setSelectedTaskForEstimate] = useState(null)
  const addTask = () => {
    const newTask = {
      id: Date.now(),
      name: '',
      hours: '',
      deadline: '',
      type: 'task'
    }
    setTasks([...tasks, newTask])
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ))
  }

  const updateSettings = (field, value) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleAIEstimate = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task.name.trim()) {
      alert('Please enter a task name first')
      return
    }
    setSelectedTaskForEstimate(task)
    setModalOpen(true)
  }

  const handleModalEstimate = async (requirements) => {
    if (!selectedTaskForEstimate) return

    setEstimatingTasks(prev => new Set([...prev, selectedTaskForEstimate.id]))
    
    try {
      const estimatedHours = await estimateTaskHours(
        selectedTaskForEstimate.name, 
        selectedTaskForEstimate.type, 
        selectedTaskForEstimate.deadline,
        requirements
      )
      updateTask(selectedTaskForEstimate.id, 'hours', estimatedHours)
    } catch (error) {
      console.error('AI estimation failed:', error)
      alert('AI estimation failed. Please try again.')
    } finally {
      setEstimatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(selectedTaskForEstimate.id)
        return newSet
      })
    }
  }

  const handleGenerateClick = () => {
    setIsGenerating(true)
    onGenerateSchedule()
    
    // Quick snappy animation
    setTimeout(() => {
      setIsGenerating(false)
    }, 400)
  }

  const getButtonContent = () => {
    if (isGenerating) return '⚡ Generating...'
    if (scheduleErrors && scheduleErrors.length > 0) {
      const totalMissingHours = scheduleErrors.reduce((sum, error) => sum + error.missingHours, 0)
      return `Need ${totalMissingHours}h more time!`
    }
    return '⚡ Generate Schedule'
  }

  const getButtonStyles = () => {
    if (isGenerating) {
      return 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105 shadow-2xl'
    }
    if (scheduleErrors && scheduleErrors.length > 0) {
      return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-[1.02] hover:shadow-xl active:scale-95'
    }
    return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-[1.02] hover:shadow-xl active:scale-95'
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Plan Your Session</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Default Daily Hours</label>
          <div className="grid grid-cols-7 gap-1">
            {[
              { key: 'sunday', label: 'Sun' },
              { key: 'monday', label: 'Mon' },
              { key: 'tuesday', label: 'Tue' },
              { key: 'wednesday', label: 'Wed' },
              { key: 'thursday', label: 'Thu' },
              { key: 'friday', label: 'Fri' },
              { key: 'saturday', label: 'Sat' }
            ].map(day => (
              <div key={day.key}>
                <label className="block text-xs text-gray-400 mb-1 text-center">{day.label}</label>
                <input 
                  type="number" 
                  value={settings[day.key]}
                  onChange={(e) => updateSettings(day.key, parseInt(e.target.value))}
                  className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-2 w-full text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0" max="16" step="1"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Hours available each day of the week</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Work To-Do</label>
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Task name" 
                  value={task.name}
                  onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={task.type || 'task'}
                  onChange={(e) => updateTask(task.id, 'type', e.target.value)}
                  className="w-24 bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="task">Task</option>
                  <option value="exam">Exam</option>
                </select>
                <div className="relative flex">
                  <input 
                    type="number" 
                    placeholder="Hours" 
                    value={task.hours}
                    onChange={(e) => updateTask(task.id, 'hours', parseFloat(e.target.value))}
                    className="w-20 bg-gray-800 border border-gray-700 text-white rounded pr-8 pl-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    min="1" 
                    step="1"
                  />
                  <button
                    onClick={() => handleAIEstimate(task.id)}
                    disabled={estimatingTasks.has(task.id) || !task.name.trim()}
                    className="absolute right-0 top-0 bottom-0 w-8 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-r text-sm font-medium transition-colors flex items-center justify-center"
                    title="AI Estimate"
                  >
                    {estimatingTasks.has(task.id) ? '⏳' : '✦'}
                  </button>
                </div>
                <input 
                  type="date" 
                  value={task.deadline}
                  onChange={(e) => updateTask(task.id, 'deadline', e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={() => removeTask(task.id)}
                  className="text-gray-400 hover:text-red-400 w-8 h-8 rounded-full hover:bg-red-900/20 transition-colors flex items-center justify-center text-lg font-light"
                  title="Remove Task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6 mb-4">
            <button 
              onClick={addTask}
              className="border border-white text-white w-8 h-8 rounded-full hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center text-lg font-light"
              title="Add Task"
            >
              +
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className={`w-full px-6 py-4 rounded-lg font-medium shadow-lg transition-all duration-150 transform text-white ${getButtonStyles()}`}
        >
          {getButtonContent()}
        </button>
      </div>

      <AIEstimateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEstimate={handleModalEstimate}
        taskName={selectedTaskForEstimate?.name}
        taskType={selectedTaskForEstimate?.type}
      />
    </div>
  )
}

export default TaskInput