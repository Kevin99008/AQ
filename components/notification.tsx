"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, AlertTriangle, Info, X } from "lucide-react"

type NotificationType = "success" | "error" | "info"

interface NotificationProps {
  type: NotificationType
  message: string
  description?: string
  duration?: number
  onClose?: () => void
}

interface NotificationState extends NotificationProps {
  id: string
  visible: boolean
}

// Global state for notifications
let notifications: NotificationState[] = []
let listeners: (() => void)[] = []

// Function to notify listeners of state changes
const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

// Function to show a notification
export const showNotification = (props: NotificationProps) => {
  const id = Math.random().toString(36).substring(2, 9)
  const notification: NotificationState = {
    ...props,
    id,
    visible: true,
    duration: props.duration || 3000,
  }

  notifications = [...notifications, notification]
  notifyListeners()

  // Auto-dismiss after duration
  setTimeout(() => {
    dismissNotification(id)
  }, notification.duration)

  return id
}

// Function to dismiss a notification
export const dismissNotification = (id: string) => {
  notifications = notifications.map((n) => (n.id === id ? { ...n, visible: false } : n))
  notifyListeners()

  // Remove from array after animation completes
  setTimeout(() => {
    notifications = notifications.filter((n) => n.id !== id)
    notifyListeners()
  }, 300)
}

// Hook to subscribe to notifications
export const useNotifications = () => {
  const [state, setState] = useState<NotificationState[]>(notifications)

  useEffect(() => {
    const handleChange = () => {
      setState([...notifications])
    }

    listeners.push(handleChange)
    return () => {
      listeners = listeners.filter((l) => l !== handleChange)
    }
  }, [])

  return state
}

// Notification component
const Notification: React.FC<NotificationState> = ({ id, type, message, description, visible }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-white" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-white" />
      case "info":
        return <Info className="h-5 w-5 text-white" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "info":
        return "bg-blue-500"
    }
  }

  return (
    <div
      className={`fixed right-4 transition-all duration-300 ease-in-out flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-md ${getColor()} text-white ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="font-medium">{message}</h4>
        {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
      </div>
      <button onClick={() => dismissNotification(id)} className="shrink-0 text-white/80 hover:text-white">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

// NotificationContainer component
export const NotificationContainer: React.FC = () => {
  const notifications = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            position: "fixed",
            top: `${4 + index * 80}px`,
            right: "16px",
            zIndex: 9999,
          }}
        >
          <Notification {...notification} />
        </div>
      ))}
    </div>
  )
}
