import { FiCheck } from 'react-icons/fi'

const steps = [
  { id: 1, label: 'Order Placed', icon: '📋' },
  { id: 2, label: 'Preparing', icon: '👨‍🍳' },
  { id: 3, label: 'On the Way', icon: '🚗' },
  { id: 4, label: 'Delivered', icon: '✅' },
]

export default function DeliveryTracker({ currentStep = 1 }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-[#2a2a3e] z-0">
          <div
            className="h-full bg-[#ff4757] transition-all duration-700 shadow-[0_0_8px_rgba(255,71,87,0.6)]"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        {steps.map((step) => {
          const isComplete = step.id < currentStep
          const isActive = step.id === currentStep
          return (
            <div key={step.id} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                isComplete
                  ? 'bg-[#ff4757] border-[#ff4757] shadow-[0_0_12px_rgba(255,71,87,0.5)]'
                  : isActive
                  ? 'bg-[#1a1a2e] border-[#ff4757] shadow-[0_0_12px_rgba(255,71,87,0.3)]'
                  : 'bg-[#12122a] border-[#2a2a3e]'
              }`}>
                {isComplete
                  ? <FiCheck size={18} className="text-white" />
                  : step.icon}
              </div>
              <p className={`text-xs mt-2 font-medium text-center ${
                isActive
                  ? 'text-[#ff4757]'
                  : isComplete
                  ? 'text-[#f1f2f6]'
                  : 'text-[#a4b0be]'
              }`}>
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}