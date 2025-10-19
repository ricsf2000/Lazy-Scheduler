import { useState } from 'react'

function CalendarView({ schedule, availability, setAvailability, settings, onExportCalendar }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [hoveredTask, setHoveredTask] = useState(null)
  const [editingDay, setEditingDay] = useState(null)

  const getDayOfWeekKey = (dayOfWeek) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[dayOfWeek]
  }

  const handleDayClick = (dateStr, isCurrentMonth, event) => {
    if (!isCurrentMonth) return
    
    // If shift-clicking, open custom hours input
    if (event.shiftKey) {
      setEditingDay(dateStr)
      return
    }
    
    const date = new Date(dateStr)
    const dayKey = getDayOfWeekKey(date.getDay())
    const defaultHours = settings[dayKey]
    
    // Cycle through: default hours -> 0 hours (unavailable) -> back to default
    const currentHours = availability[dateStr]
    if (currentHours === undefined) {
      // First click: set to 0 (unavailable)
      setAvailability({...availability, [dateStr]: 0})
    } else if (currentHours === 0) {
      // Second click: set to default hours
      setAvailability({...availability, [dateStr]: defaultHours})
    } else {
      // Third click: remove override (back to default)
      const newAvailability = {...availability}
      delete newAvailability[dateStr]
      setAvailability(newAvailability)
    }
  }

  const handleCustomHours = (dateStr, hours) => {
    const newHours = parseInt(hours)
    if (isNaN(newHours) || newHours < 0) {
      // Remove custom hours if invalid
      const newAvailability = {...availability}
      delete newAvailability[dateStr]
      setAvailability(newAvailability)
    } else {
      setAvailability({...availability, [dateStr]: newHours})
    }
    setEditingDay(null)
  }

  const getAvailableHours = (dateStr, dayOfWeek) => {
    if (availability[dateStr] !== undefined) {
      return availability[dateStr]
    }
    const dayKey = getDayOfWeekKey(dayOfWeek)
    return settings[dayKey]
  }

  // Create a full month calendar grid
  const today = new Date()
  const currentMonth = viewDate.getMonth()
  const currentYear = viewDate.getFullYear()

  const goToPreviousMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const goToToday = () => {
    setViewDate(new Date())
  }
  
  // Get first day of the month and calculate start of calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startOfCalendar = new Date(firstDayOfMonth)
  startOfCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay()) // Start on Sunday
  
  // Create calendar days (6 weeks = 42 days to ensure full month coverage)
  const calendarDays = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startOfCalendar)
    date.setDate(startOfCalendar.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const isCurrentMonth = date.getMonth() === currentMonth
    const isToday = date.toDateString() === today.toDateString()
    
    calendarDays.push({
      date: dateStr,
      dayName: date.toLocaleDateString('en', { weekday: 'short' }),
      dayNum: date.getDate(),
      dayOfWeek: date.getDay(), // Store the original day of week
      isCurrentMonth,
      isToday,
      tasks: schedule[dateStr] || []
    })
  }
  
  // Split into weeks
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  return (
    <div data-calendar className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })} Study Plan
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPreviousMonth}
            className="bg-gray-800 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
          >
            ←
          </button>
          <button 
            onClick={goToToday}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Today
          </button>
          <button 
            onClick={goToNextMonth}
            className="bg-gray-800 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-400">
        Click days to cycle availability • Shift+Click for custom hours
        <br />
        <span className="ml-0 text-red-400">■ Unavailable</span>
        <span className="ml-2 text-green-400">■ Has tasks</span>
        <span className="ml-2 text-yellow-400">■ Custom hours</span>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-gray-400 py-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar weeks */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day) => {
            const availableHours = getAvailableHours(day.date, day.dayOfWeek)
            const isUnavailable = availableHours === 0
            const hasCustomAvailability = availability[day.date] !== undefined
            
            return (
              <div key={day.date} className="text-center">
                <div 
                  className={`rounded-lg p-2 min-h-[90px] transition-colors cursor-pointer ${
                    day.isToday 
                      ? 'bg-blue-600/40' 
                      : isUnavailable
                        ? 'bg-red-900/30 hover:bg-red-900/40'
                        : day.tasks.length > 0 
                          ? 'bg-green-900/30 hover:bg-green-900/40' 
                          : day.isCurrentMonth 
                            ? hasCustomAvailability
                              ? 'bg-yellow-900/30 hover:bg-yellow-900/40'
                              : 'bg-gray-800/20 hover:bg-gray-800/30'
                            : 'bg-gray-900/20'
                  }`}
                  onClick={(e) => handleDayClick(day.date, day.isCurrentMonth, e)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    day.isCurrentMonth 
                      ? day.isToday 
                        ? 'text-blue-200' 
                        : 'text-white'
                      : 'text-gray-500'
                  }`}>
                    {day.dayNum}
                  </div>
                  
                  {day.isCurrentMonth && (
                    <div className="text-xs text-gray-400 mb-1">
                      {editingDay === day.date ? (
                        <input
                          type="number"
                          min="0"
                          max="16"
                          defaultValue={availableHours}
                          className="w-8 bg-gray-700 text-white text-center text-xs rounded border-0 focus:ring-1 focus:ring-blue-500"
                          autoFocus
                          onBlur={(e) => handleCustomHours(day.date, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCustomHours(day.date, e.target.value)
                            } else if (e.key === 'Escape') {
                              setEditingDay(null)
                            }
                          }}
                        />
                      ) : (
                        isUnavailable ? 'Unavailable' : `${availableHours}h`
                      )}
                    </div>
                  )}
                  
                  {day.isCurrentMonth && day.tasks.length > 0 && (
                    <div className="space-y-1">
                      {day.tasks.map((task, idx) => {
                        const taskId = `${day.date}-${idx}`
                        return (
                          <div key={idx} className="relative">
                            <div 
                              className="text-xs text-green-300 truncate px-1 py-0.5 bg-green-900/50 rounded cursor-pointer hover:bg-green-900/70 transition-colors"
                              onMouseEnter={() => setHoveredTask(taskId)}
                              onMouseLeave={() => setHoveredTask(null)}
                            >
                              {task.name} ({task.hours}h)
                            </div>
                            {hoveredTask === taskId && (
                              <div className="absolute top-full left-0 mt-1 bg-gray-900 text-white text-xs p-2 rounded shadow-lg border border-gray-800 z-50 whitespace-nowrap min-w-max">
                                <div className="font-medium">{task.name}</div>
                                <div className="text-gray-400">{task.hours} hours planned</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {Object.keys(schedule).length > 0 && (
        <button 
          onClick={onExportCalendar}
          className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Export to Calendar
        </button>
      )}
    </div>
  )
}

export default CalendarView