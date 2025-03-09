"use client"

import { useEffect, useState } from "react"
import { UserSearch } from "@/components/userList/user-search"
import { UserList } from "@/components/userList/user-list"
import { UserDetails } from "@/components/userList/user-details"
import type { User } from "@/types/user"
import { fetchUsers, fetchUser } from "@/services/api"
import { toast } from "react-toastify"

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Fetch all users on initial load
  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true)
        const data = await fetchUsers()
        setUsers(data)

        if (users.length > 0 && !selectedUser) {
          setSelectedUser(users[0])
        }
      } catch (error) {
        toast.error("Failed to load users. Please refresh the page.")
        console.error("Failed to fetch users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Handle selecting a user
  const handleSelectUser = async (user: User) => {
    try {
      // Fetch the full user data with students
      const userData = await fetchUser(user.id)
      setSelectedUser(userData)

      // Update the user in the users array
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === userData.id ? userData : u)))
    } catch (error) {
      toast.error("Failed to load user details.")
      console.error("Failed to fetch user details:", error)
    }
  }

  // Handle refreshing user data after adding a student
  const handleStudentAdded = async () => {
    if (selectedUser) {
      try {
        const updatedUser = await fetchUser(selectedUser.id)
        setSelectedUser(updatedUser)

        // Update the user in the users array
        setUsers((prevUsers) => prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      } catch (error) {
        toast.error("Failed to refresh user data.")
        console.error("Failed to refresh user data:", error)
      }
    }
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Left side - User list with search */}
      <div className="w-full border-r md:w-1/3 lg:w-1/4">
        <UserSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-73px)]">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <UserList users={filteredUsers} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
        )}
      </div>

      {/* Right side - User details */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        ) : selectedUser ? (
          <UserDetails user={selectedUser} onStudentAdded={handleStudentAdded} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select a user to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
