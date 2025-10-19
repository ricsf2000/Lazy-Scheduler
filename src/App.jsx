import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import CalendarView from './components/CalendarView'
import { generateDailySchedule, exportToCalendar } from './utils/scheduler'

function App() {
  const [tasks, setTasks] = useState([])
  const [schedule, setSchedule] = useState({})
  const [settings, setSettings] = useState({
    sunday: 6,
    monday: 3,
    tuesday: 3,
    wednesday: 3,
    thursday: 3,
    friday: 3,
    saturday: 6
  })
  const [availability, setAvailability] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [scheduleErrors, setScheduleErrors] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('lock-in-settings')
      const savedTasks = localStorage.getItem('lock-in-tasks')
      const savedAvailability = localStorage.getItem('lock-in-availability')
      
      console.log('Loading from localStorage:', { savedSettings, savedTasks, savedAvailability })
      
      let loadedSettings = settings
      let loadedTasks = []
      let loadedAvailability = {}
      
      if (savedSettings) {
        loadedSettings = JSON.parse(savedSettings)
        setSettings(loadedSettings)
      }
      if (savedTasks) {
        loadedTasks = JSON.parse(savedTasks)
        setTasks(loadedTasks)
      }
      if (savedAvailability) {
        loadedAvailability = JSON.parse(savedAvailability)
        setAvailability(loadedAvailability)
      }
      
      // Auto-generate schedule if tasks exist
      if (loadedTasks.length > 0) {
        console.log('Auto-generating schedule from saved data')
        const result = generateDailySchedule(loadedSettings, loadedTasks, loadedAvailability)
        setSchedule(result.schedule)
        setScheduleErrors(result.errors)
      }
      
      setIsLoaded(true)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage when they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving settings to localStorage:', settings)
      localStorage.setItem('lock-in-settings', JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  // Save tasks to localStorage when they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving tasks to localStorage:', tasks)
      localStorage.setItem('lock-in-tasks', JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  // Save availability to localStorage when it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving availability to localStorage:', availability)
      localStorage.setItem('lock-in-availability', JSON.stringify(availability))
    }
  }, [availability, isLoaded])

  const handleGenerateSchedule = () => {
    if (tasks.length === 0) {
      alert('Please add at least one task')
      return
    }
    
    const result = generateDailySchedule(settings, tasks, availability)
    setSchedule(result.schedule)
    setScheduleErrors(result.errors)
    
    // Only scroll if no errors
    if (result.errors.length === 0) {
      setTimeout(() => {
        const calendarElement = document.querySelector('[data-calendar]')
        if (calendarElement) {
          calendarElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 200)
    }
  }

  const handleExportCalendar = () => {
    if (Object.keys(schedule).length === 0) {
      alert('Please generate a schedule first')
      return
    }
    exportToCalendar(schedule)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lazy Scheduler</h1>
          <p className="text-gray-400">Scheduling made easy.</p>
        </header>
        
        <div className="space-y-8">
          <TaskInput 
            tasks={tasks}
            setTasks={setTasks}
            settings={settings}
            setSettings={setSettings}
            onGenerateSchedule={handleGenerateSchedule}
            scheduleErrors={scheduleErrors}
          />
          
          <CalendarView 
            schedule={schedule}
            availability={availability}
            setAvailability={setAvailability}
            settings={settings}
            onExportCalendar={handleExportCalendar}
          />
        </div>
      </div>
    </div>
  )
}

export default App