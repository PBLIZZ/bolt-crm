import { useState } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, BarChart3, PieChart } from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analyticsData = {
    clientGrowth: [
      { month: 'Jan', clients: 35 },
      { month: 'Feb', clients: 42 },
      { month: 'Mar', clients: 38 },
      { month: 'Apr', clients: 47 },
    ],
    revenueData: [
      { month: 'Jan', revenue: 2850 },
      { month: 'Feb', revenue: 3200 },
      { month: 'Mar', revenue: 2980 },
      { month: 'Apr', revenue: 3240 },
    ],
    serviceDistribution: [
      { service: 'Yoga Sessions', count: 45, percentage: 35 },
      { service: 'Nutritional Consultation', count: 32, percentage: 25 },
      { service: 'Wellness Coaching', count: 28, percentage: 22 },
      { service: 'Fitness Training', count: 23, percentage: 18 },
    ],
    clientRetention: {
      newClients: 12,
      returningClients: 35,
      churnRate: 8.5,
      averageLifetime: 6.2,
    },
  };

  const kpis = [
    {
      title: 'Monthly Revenue',
      value: '$3,240',
      change: '+18%',
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Active Clients',
      value: '47',
      change: '+12%',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Session Completion Rate',
      value: '94%',
      change: '+3%',
      icon: Calendar,
      color: 'purple',
    },
    {
      title: 'Average Session Value',
      value: '$89',
      change: '+7%',
      icon: TrendingUp,
      color: 'amber',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Analytics & Reports</h1>
          <p className='text-gray-600 mt-1'>Track your wellness business performance</p>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className='bg-white rounded-xl p-6 shadow-sm border border-red-100'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-600'>{kpi.title}</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>{kpi.value}</p>
                </div>
                {/* Fixed dynamic classes by using conditional rendering */}
                <div
                  className={`p-3 rounded-lg ${kpi.color === 'emerald' ? 'bg-emerald-100' : kpi.color === 'blue' ? 'bg-blue-100' : kpi.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'}`}
                >
                  <Icon
                    size={24}
                    className={`${kpi.color === 'emerald' ? 'text-emerald-600' : kpi.color === 'blue' ? 'text-blue-600' : kpi.color === 'purple' ? 'text-purple-600' : 'text-amber-600'}`}
                  />
                </div>
              </div>
              <div className='flex items-center mt-4'>
                <span className='text-sm font-semibold text-emerald-600'>{kpi.change}</span>
                <span className='text-sm text-gray-500 ml-2'>vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Revenue Chart */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-red-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Revenue Trend</h2>
            <BarChart3 size={20} className='text-gray-400' />
          </div>
          <div className='h-64 flex items-end justify-between space-x-2'>
            {analyticsData.revenueData.map((data, index) => (
              <div key={index} className='flex-1 flex flex-col items-center'>
                <div
                  className='w-full bg-red-500 rounded-t-lg mb-2 hover:bg-red-600 transition-colors'
                  style={{ height: `${(data.revenue / 4000) * 100}%` }}
                />
                <span className='text-sm text-gray-600'>{data.month}</span>
                <span className='text-xs text-gray-500'>${data.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-red-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Client Growth</h2>
            <TrendingUp size={20} className='text-gray-400' />
          </div>
          <div className='h-64 flex items-end justify-between space-x-2'>
            {analyticsData.clientGrowth.map((data, index) => (
              <div key={index} className='flex-1 flex flex-col items-center'>
                <div
                  className='w-full bg-blue-500 rounded-t-lg mb-2 hover:bg-blue-600 transition-colors'
                  style={{ height: `${(data.clients / 50) * 100}%` }}
                />
                <span className='text-sm text-gray-600'>{data.month}</span>
                <span className='text-xs text-gray-500'>{data.clients}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Distribution and Client Retention */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Service Distribution */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-red-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Service Distribution</h2>
            <PieChart size={20} className='text-gray-400' />
          </div>
          <div className='space-y-4'>
            {analyticsData.serviceDistribution.map((service, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? 'bg-red-500'
                        : index === 1
                          ? 'bg-blue-500'
                          : index === 2
                            ? 'bg-purple-500'
                            : 'bg-amber-500'
                    }`}
                  />
                  <span className='text-sm font-medium text-gray-900'>{service.service}</span>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium text-gray-900'>{service.count}</div>
                  <div className='text-xs text-gray-500'>{service.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Retention Metrics */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-red-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Client Retention</h2>
            <Users size={20} className='text-gray-400' />
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-red-50 rounded-lg'>
              <div>
                <p className='text-sm font-medium text-red-900'>New Clients</p>
                <p className='text-2xl font-bold text-red-700'>
                  {analyticsData.clientRetention.newClients}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-red-600'>This month</p>
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
              <div>
                <p className='text-sm font-medium text-blue-900'>Returning Clients</p>
                <p className='text-2xl font-bold text-blue-700'>
                  {analyticsData.clientRetention.returningClients}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-blue-600'>Active</p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <p className='text-sm text-gray-600'>Churn Rate</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {analyticsData.clientRetention.churnRate}%
                </p>
              </div>
              <div className='text-center'>
                <p className='text-sm text-gray-600'>Avg. Lifetime</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {analyticsData.clientRetention.averageLifetime} months
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-red-100'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>Insights & Recommendations</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='p-4 bg-red-50 rounded-lg'>
            <h3 className='font-semibold text-red-900 mb-2'>🎯 Growth Opportunity</h3>
            <p className='text-sm text-red-700'>
              Your yoga sessions have the highest demand. Consider adding more yoga-focused packages
              or group classes to increase revenue.
            </p>
          </div>
          <div className='p-4 bg-blue-50 rounded-lg'>
            <h3 className='font-semibold text-blue-900 mb-2'>📈 Retention Success</h3>
            <p className='text-sm text-blue-700'>
              Your client retention rate is excellent at 91.5%. Continue focusing on personalized
              care and follow-up communications.
            </p>
          </div>
          <div className='p-4 bg-amber-50 rounded-lg'>
            <h3 className='font-semibold text-amber-900 mb-2'>💡 Pricing Optimization</h3>
            <p className='text-sm text-amber-700'>
              Consider bundling nutritional consultations with fitness training sessions to increase
              average session value.
            </p>
          </div>
          <div className='p-4 bg-purple-50 rounded-lg'>
            <h3 className='font-semibold text-purple-900 mb-2'>🔄 Seasonal Trends</h3>
            <p className='text-sm text-purple-700'>
              Plan for increased demand in January and prepare wellness packages for the New Year
              resolution season.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
