function ScheduleDisplay({ schedule, onExportCalendar }) {
  if (schedule.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Your Schedule</h2>
        <div className="text-gray-400">
          Add tasks and generate your schedule to see the plan here.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Schedule</h2>
      
      <div className="space-y-3 mb-4">
        {schedule.map((item, index) => {
          const bgColor = item.type === 'task' 
            ? 'bg-blue-900/30 border-blue-500/50' 
            : 'bg-green-900/30 border-green-500/50'
          const textColor = item.type === 'task' 
            ? 'text-blue-300' 
            : 'text-green-300'
          
          return (
            <div key={index} className={`p-3 rounded border ${bgColor}`}>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${textColor}`}>{item.name}</span>
                <span className="text-sm text-gray-400">{item.duration}h</span>
              </div>
              <div className="text-sm text-gray-400">
                {item.startTime} - {item.endTime}
              </div>
            </div>
          )
        })}
      </div>
      
      <button 
        onClick={onExportCalendar}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
      >
        Export to Calendar
      </button>
    </div>
  )
}

export default ScheduleDisplay