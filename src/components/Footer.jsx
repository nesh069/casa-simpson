import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-[#0d0d1a] border-t border-[#2a2a3e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-[#f1f2f6] text-xl font-bold mb-3 font-['Poppins']">
              Casa <span className="text-[#ff4757]">Simpson</span>
            </h3>
            <p className="text-sm leading-relaxed text-[#a4b0be]">
              Where luxury meets home. Experience world-class hospitality in every detail.
            </p>
            <div className="flex gap-3 mt-4">
              {['🏨', '🍽️', '🚚', '⭐'].map((icon) => (
                <span
                  key={icon}
                  className="w-9 h-9 bg-[#1a1a2e] border border-[#2a2a3e] rounded-full flex items-center justify-center text-sm hover:border-[#ff4757]/50 transition-colors cursor-default"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#f1f2f6] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['/', 'Home'],
                ['/rooms', 'Rooms'],
                ['/restaurant', 'Restaurant & Bar'],
                ['/delivery', 'Delivery'],
                ['/reviews', 'Guest Reviews'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[#a4b0be] hover:text-[#ff4757] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#f1f2f6] font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[#a4b0be]">
                <FiMapPin size={14} className="text-[#ff4757] shrink-0" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2 text-[#a4b0be]">
                <FiPhone size={14} className="text-[#ff4757] shrink-0" />
                +254 700 000 000
              </li>
              <li className="flex items-center gap-2 text-[#a4b0be]">
                <FiMail size={14} className="text-[#ff4757] shrink-0" />
                hello@casasimpson.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a2a3e] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#a4b0be]/60">
            © {new Date().getFullYear()} Casa Simpson. All rights reserved.
          </p>
          <p className="text-xs text-[#a4b0be]/60">
            Built by Simpson
          </p>
        </div>
      </div>
    </footer>
  )
}