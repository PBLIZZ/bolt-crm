import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Clients', value: '47', change: '+12%', icon: Users, color: 'bg-blue-500' },
    {
      title: "This Month's Revenue",
      value: '$3,240',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-teal-500',
    },
    {
      title: 'Appointments Today',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Session Completion Rate',
      value: '94%',
      change: '+3%',
      icon: CheckCircle,
      color: 'bg-cyan-500',
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      client: 'Sarah Johnson',
      service: 'Yoga Session',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      client: 'Michael Chen',
      service: 'Nutritional Consultation',
      time: '2:00 PM',
      status: 'pending',
    },
    {
      id: 3,
      client: 'Emma Wilson',
      service: 'Wellness Coaching',
      time: '4:30 PM',
      status: 'confirmed',
    },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Follow up with Sarah about meal plan', due: 'Today', priority: 'high' },
    { id: 2, task: 'Prepare wellness workshop materials', due: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Update client progress reports', due: 'Friday', priority: 'low' },
  ];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-cyan-900'>Dashboard</h1>
          <p className='text-cyan-600 mt-1'>
            Welcome back! Here's your wellness practice overview.
          </p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-cyan-500'>Today</p>
          <p className='text-lg font-semibold text-cyan-900'>{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className='bg-white rounded-xl p-6 shadow-sm border border-cyan-100 hover:shadow-md transition-shadow duration-200'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-cyan-600'>{stat.title}</p>
                  <p className='text-2xl font-bold text-cyan-900 mt-1'>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className='text-white' />
                </div>
              </div>
              <div className='flex items-center mt-4'>
                <span className='text-sm font-semibold text-teal-600'>{stat.change}</span>
                <span className='text-sm text-cyan-500 ml-2'>vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Appointments */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-cyan-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-cyan-900'>Today's Appointments</h2>
            <Clock size={20} className='text-cyan-400' />
          </div>
          <div className='space-y-4'>
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className='flex items-center justify-between p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-200'
              >
                <div className='flex-1'>
                  <h3 className='font-medium text-cyan-900'>{appointment.client}</h3>
                  <p className='text-sm text-cyan-600'>{appointment.service}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-cyan-900'>{appointment.time}</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-cyan-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-cyan-900'>Upcoming Tasks</h2>
            <TrendingUp size={20} className='text-cyan-400' />
          </div>
          <div className='space-y-4'>
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className='flex items-center justify-between p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-200'
              >
                <div className='flex-1'>
                  <h3 className='font-medium text-cyan-900'>{task.task}</h3>
                  <p className='text-sm text-cyan-600'>Due: {task.due}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-cyan-100'>
        <h2 className='text-xl font-semibold text-cyan-900 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <button className='flex items-center justify-center p-4 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors duration-200'>
            <Users size={20} className='mr-2' />
            Add New Client
          </button>
          <button className='flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200'>
            <Calendar size={20} className='mr-2' />
            Schedule Appointment
          </button>
          <button className='flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200'>
            <FileText size={20} className='mr-2' />
            Create Session Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
