export default function MetricCard({ title, value, icon: Icon, onClick, isActive, colorScheme = 'blue', subtext }) {
    const schemes = {
        teal: {
            bg: 'bg-teal-50',
            border: 'border-teal-200',
            text: 'text-teal-900',
            accent: 'text-teal-600',
            active: 'bg-white border-[#2FA4A9] ring-2 ring-[#2FA4A9]/20',
            activeText: 'text-[#2FA4A9]',
            activeAccent: 'text-[#2FA4A9]/80',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
            activeIconColor: 'text-[#2FA4A9]'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-900',
            accent: 'text-blue-600',
            active: 'bg-blue-600 text-white border-blue-600',
            activeText: 'text-white',
            activeAccent: 'text-white/80',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            activeIconColor: 'text-white'
        },
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-900',
            accent: 'text-orange-600',
            active: 'bg-orange-500 text-white border-orange-500',
            activeText: 'text-white',
            activeAccent: 'text-white/80',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            activeIconColor: 'text-white'
        },
        purple: {
            bg: 'bg-[#B197FC]',
            border: 'border-purple-200',
            text: 'text-white',
            accent: 'text-white/90',
            active: 'bg-[#9775FA] text-white border-[#9775FA] scale-105',
            activeText: 'text-white',
            activeAccent: 'text-white/80',
            iconBg: 'bg-white/20',
            iconColor: 'text-white',
            activeIconColor: 'text-white'
        },
        red: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-900',
            accent: 'text-red-600',
            active: 'bg-red-600 text-white border-red-600',
            activeText: 'text-white',
            activeAccent: 'text-white/80',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            activeIconColor: 'text-white'
        },
        yellow: {
            bg: 'bg-[#FFD43B]',
            border: 'border-yellow-200',
            text: 'text-gray-900',
            accent: 'text-gray-700',
            active: 'bg-[#FAB005] text-gray-900 border-[#FAB005] scale-105',
            activeText: 'text-gray-900',
            activeAccent: 'text-gray-800',
            iconBg: 'bg-black/10',
            iconColor: 'text-gray-900',
            activeIconColor: 'text-gray-900'
        },
        gray: {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-900',
            accent: 'text-gray-600',
            active: 'bg-gray-800 text-white border-gray-800',
            activeText: 'text-white',
            activeAccent: 'text-white/80',
            iconBg: 'bg-gray-200',
            iconColor: 'text-gray-600',
            activeIconColor: 'text-white'
        }
    }

    const s = schemes[colorScheme] || schemes.blue

    return (
        <div
            onClick={onClick}
            className={`relative overflow-hidden rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${isActive
                ? s.active
                : `${s.bg} ${s.border}`
                }`}
        >
            <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-black/5' : s.iconBg}`}>
                        {Icon && <Icon size={20} className={isActive ? s.activeIconColor : s.iconColor} />}
                    </div>
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? s.activeText : s.accent}`}>
                        {title}
                    </p>
                </div>

                <div className="text-center mt-2">
                    <p className={`text-4xl font-black ${isActive ? s.activeText : 'text-gray-900'}`}>
                        {value}
                    </p>
                    {subtext && (
                        <p className={`text-[10px] font-medium mt-1 ${isActive ? s.activeAccent : 'text-gray-500'}`}>
                            {subtext}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
