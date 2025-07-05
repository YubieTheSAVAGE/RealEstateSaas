// Optimized icon imports to reduce bundle size
import dynamic from 'next/dynamic';

// Lazy load heavy icon libraries
export const BiBuildings = dynamic(() => import('react-icons/bi').then(mod => ({ default: mod.BiBuildings })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});

export const BiBookContent = dynamic(() => import('react-icons/bi').then(mod => ({ default: mod.BiBookContent })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});

export const BiTask = dynamic(() => import('react-icons/bi').then(mod => ({ default: mod.BiTask })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});

export const BiFile = dynamic(() => import('react-icons/bi').then(mod => ({ default: mod.BiFile })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});

export const BiCreditCard = dynamic(() => import('react-icons/bi').then(mod => ({ default: mod.BiCreditCard })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});

export const FaUsers = dynamic(() => import('react-icons/fa').then(mod => ({ default: mod.FaUsers })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});

export const FaEye = dynamic(() => import('react-icons/fa').then(mod => ({ default: mod.FaEye })), {
  ssr: false,
  loading: () => <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
});

export const TbContract = dynamic(() => import('react-icons/tb').then(mod => ({ default: mod.TbContract })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
});
