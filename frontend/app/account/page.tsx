// app/dashboard/profile/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  User,
  Lock,
  Camera,
  Info,
  MessageSquare,
  Settings,
  ChevronRight,
  Mail,
  Shield,
  Package,
  CreditCard,
  MapPin,
  Bell,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Estados locales
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  // ✅ Render principal
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
            Your Account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your profile, orders, and account settings
          </p>
        </header>

        {/* Quick Access Grid - Amazon Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <QuickAccessCard
            onClick={() => router.push('/orders')}
            icon={<Package className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            title="Your Orders"
            subtitle="Track, return, or buy things again"
          />
          <QuickAccessCard
            onClick={() => router.push('/account/security')}
            icon={<Shield className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            title="Login & security"
            subtitle="Edit login, name, and mobile number"
          />
          <QuickAccessCard
            onClick={() => router.push('/account/addresses')}
            icon={<MapPin className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            title="Your Addresses"
            subtitle="Edit addresses for orders and gifts"
          />
          <QuickAccessCard
            onClick={() => router.push('/account/payment')}
            icon={<CreditCard className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            title="Payment options"
            subtitle="Edit or add payment methods"
          />
          <QuickAccessCard
            onClick={() => router.push('/account/notifications')}
            icon={<Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            title="Notifications"
            subtitle="Message center and email preferences"
          />
          <QuickAccessCard
            onClick={() => router.push('/support')}
            icon={<MessageSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            title="Customer Service"
            subtitle="Contact us for help"
          />
        </div>

        {/* Profile Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Profile Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <ProfilePicture username={user?.username || 'User'} />
            
            {/* Account Details */}
            <div className="space-y-4">
              <UsernameSection
                username={user?.username || 'User'}
                isEditing={isEditingUsername}
                onEdit={() => setIsEditingUsername(true)}
                onCancel={() => setIsEditingUsername(false)}
              />
              
              <InfoCard
                title="Email"
                icon={<Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.email || 'No email provided'}
                </span>
              </InfoCard>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security Settings
          </h2>
          
          <PasswordSection
            isEditing={isEditingPassword}
            onEdit={() => setIsEditingPassword(true)}
            onCancel={() => setIsEditingPassword(false)}
          />
        </div>

        {/* Security Tip */}
        <SecurityTip />
      </div>
    </div>
  )
}

// Quick Access Cards - Amazon Style
function QuickAccessCard({
  onClick,
  icon,
  title,
  subtitle,
}: {
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <button
      onClick={onClick}
      className="group p-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-all text-left hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-base font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  )
}

// Profile Picture
function ProfilePicture({ username }: { username: string }) {
  const initial = username.charAt(0).toUpperCase()
  
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Profile Picture
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-semibold">
            {initial}
          </div>
          <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors">
            Change Photo
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            JPG or PNG, max 2MB
          </p>
        </div>
      </div>
    </div>
  )
}

// Username Section
function UsernameSection({
  username,
  isEditing,
  onEdit,
  onCancel,
}: {
  username: string
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
}) {
  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</h3>
      {!isEditing ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-gray-100">{formattedUsername}</span>
          </div>
          <button
            onClick={onEdit}
            className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            defaultValue={formattedUsername}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Password Section
function PasswordSection({
  isEditing,
  onEdit,
  onCancel,
}: {
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
}) {
  return (
    <div>
      {!isEditing ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">
              Update Password
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Info Card
function InfoCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <div className="flex items-center gap-2">
        {icon}
        {children}
      </div>
    </div>
  )
}

// Security Tip
function SecurityTip() {
  return (
    <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
          Protect your account
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
          Enable two-factor authentication and use a strong, unique password to keep your account secure.
        </p>
      </div>
    </div>
  )
}
