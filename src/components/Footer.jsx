import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-page border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-text text-xl font-bold mb-3 font-['Poppins']">
              Casa <span className="text-brand">Simpson</span>
            </h3>
            <p className="text-base leading-relaxed text-muted">
              Where luxury meets home. Experience world-class hospitality in every detail.
            </p>
          </div>

          <div>
            <h4 className="text-text font-semibold mb-4">Quick Links</h4>
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
                    className="text-muted hover:text-brand transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted">
                <FiMapPin size={14} className="text-brand shrink-0" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2 text-muted">
                <FiPhone size={14} className="text-brand shrink-0" />
                +254723363961
              </li>
              <li className="flex items-center gap-2 text-muted">
                <FiMail size={14} className="text-brand shrink-0" />
                muneneemmanuel953@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} Casa Simpson. All rights reserved.
          </p>
          <p className="text-xs text-muted/60">
            Built by Simpson
          </p>
        </div>
      </div>
    </footer>
  )
}