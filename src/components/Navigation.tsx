"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/planner', label: 'Planner', icon: '📅' },
    { href: '/progress', label: 'Progress', icon: '📊' },
    { href: '/faq', label: 'FAQ', icon: '❓' },
  ];

  // Hide navigation on onboarding and BMI pages
  if (pathname === '/onboarding' || pathname === '/bmi' || pathname === '/done') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'text-pink-600 bg-pink-50'
                : 'text-gray-600 hover:text-pink-500'
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 