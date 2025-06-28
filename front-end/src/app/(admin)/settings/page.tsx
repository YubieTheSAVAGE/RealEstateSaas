
import { Metadata } from 'next';
import React from 'react'
import SettingsTab from '@/components/ui/tabs/SettingsTab'
import Settings from '@/components/settings/Settings'

export const metadata: Metadata = {
  title: "Paramètres - Immo 360",
  description: "Paramètres",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function SettingsPage() {
  return (
    <Settings />
  )
}