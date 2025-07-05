import React from 'react'
import SettingsTab from '../ui/tabs/SettingsTab'



export default function Settings() {
  return (
    <>
      <div className="flex flex-col gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Paramètres
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Modifier les paramètres de l'application
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <SettingsTab />
      </div>
    </>
  )
}