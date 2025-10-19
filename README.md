# Lazy Scheduler

An AI-powered study planner that makes scheduling easy by stripping away complexity and streamlining the scheduling experience through the use of clever algorithms, AI, and a simple user interface.

## Features

### AI Time Estimation
- Paste your assignment requirements into our modal for accurate hour estimates
- Powered by Google Gemini API for intelligent analysis
- Considers task complexity, research needs, and realistic student work pace

### Smart Scheduling Algorithm
- **Exam Priority**: Exams get first pick of available time slots
- **Optimal Timing**: Exam studying scheduled closer to test dates for better retention
- **Anti-Cramming**: Assignments distributed to avoid deadline-day stress
- **Backward Scheduling**: Exams fill from deadline backwards, assignments spread forward

### Visual Calendar Planning
- Interactive monthly calendar with easy availability setting
- Click days to cycle through availability options
- Shift+click for custom hour input
- Color-coded days: red (unavailable), green (has tasks), yellow (custom hours)
- Multi-month navigation

### Task Management
- Task vs Exam type selection for different scheduling strategies
- Individual daily hour settings for each day of the week
- Real-time error feedback when schedules don't fit
- Dynamic button states showing missing hours

### Calendar Export
- Export to .ics format compatible with Google Calendar, Outlook, Apple Calendar
- All-day events with hours in task names for flexible scheduling
- Transparent events that don't block your calendar

### Data Persistence
- Automatic localStorage saving of tasks, settings, and availability
- No account required - your data stays on your device

## Quick Start

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd lazy-scheduler
   npm install
   ```

2. **Set up environment:**
   ```bash
   # Create .env file
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

3. **Get a Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a free API key
   - Add it to your `.env` file

4. **Run the app:**
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS (CDN)
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Storage**: localStorage (client-side)
- **Calendar**: iCalendar (.ics) export format

## How It Works

1. **Plan Your Session**: Set your daily availability for each day of the week
2. **Add Tasks**: Enter task names, select type (Task/Exam), and set deadlines
3. **Get AI Estimates**: Click the star button to get AI-powered time estimates based on detailed requirements
4. **Generate Schedule**: The algorithm automatically distributes tasks with smart prioritization
5. **Export**: Download your schedule as an .ics file for your favorite calendar app

## Key Design Decisions

- **Frontend-only**: No backend required, easy deployment
- **AI Enhancement**: AI improves estimates but doesn't replace good algorithms
- **Student-Focused**: Built specifically for academic workload management
- **Mobile-Friendly**: Responsive design for planning on the go

## Perfect For

- College students juggling multiple assignments
- High school students managing coursework
- Anyone with multiple deadlines and time constraints

---

*Built during a hackathon to solve the universal student problem of poor time estimation and last-minute cramming.*
