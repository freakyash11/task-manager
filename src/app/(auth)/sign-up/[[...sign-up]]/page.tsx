import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="w-full p-4 md:p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign up to start organizing your tasks
        </p>
      </div>
      <SignUp appearance={{
        elements: {
          rootBox: "mx-auto w-full",
          card: "shadow-lg rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden",
          header: "text-center",
          headerTitle: "text-xl font-semibold",
          headerSubtitle: "text-sm text-gray-500 dark:text-gray-400",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg",
          footerAction: "text-sm text-gray-500 dark:text-gray-400",
          formFieldInput: "rounded-lg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
          socialButtonsBlockButton: "border border-gray-300 dark:border-gray-700 rounded-lg",
          socialButtonsProviderIcon: "h-5 w-5",
        }
      }} />
    </div>
  )
} 