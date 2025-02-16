"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Minus, Edit, Save, X } from "lucide-react"

type Log = {
  id: number
  title: string
  imageUrl: string | StaticImageData
  quantity: number
}

const initialLogsData: Log[] = [
  { id: 1, title: "Swimming Glasses", imageUrl: "/placeholder.svg", quantity: 10 },
  { id: 2, title: "Float Board", imageUrl: "/placeholder.svg", quantity: 1 },
]

export default function StorageComponent() {
  const [viewType, setViewType] = useState("table")
  const [logsData, setLogsData] = useState<Log[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newItem, setNewItem] = useState<{ title: string; quantity: number; imageUrl: string | StaticImageData }>({
    title: "",
    quantity: 0,
    imageUrl: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/storages/")
        if (!response.ok) throw new Error("Failed to fetch data")
        
        const data = await response.json()
        setLogsData(data)
      } catch (err) {
        setError("Error loading data")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setLogsData((prevData) => prevData.map((log) => (log.id === id ? { ...log, quantity: newQuantity } : log)))
  }

  const addQuantity = async (id: number) => {
    const log = logsData.find((log) => log.id === id)
    const newQuantity = (log?.quantity ?? 0) + 1
    handleQuantityChange(id, newQuantity)

    try {
      const response = await fetch(`http://localhost:8000/api/storages/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
  
      // Optionally, handle the response from the server
      const data = await response.json();
      // console.log("Updated data:", data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  const discardQuantity = async (id: number) => {
    const log = logsData.find((log) => log.id === id)
    const newQuantity = Math.max((log?.quantity ?? 0) - 1, 0)
    handleQuantityChange(id, newQuantity)

    try {
      const response = await fetch(`http://localhost:8000/api/storages/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
  
      // Optionally, handle the response from the server
      const data = await response.json();
      // console.log("Updated data:", data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  const saveChanges = async () => {
    setIsEditing(false)
    try {
      // Fetch the updated list of logs from the API
      const response = await fetch("http://localhost:8000/api/storages/");
      if (!response.ok) {
        throw new Error("Failed to fetch updated data");
      }
  
      const data = await response.json();
      
      // Update the state with the new data
      setLogsData(data);
  
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  }

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: name === "quantity" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewItem((prevItem) => ({ ...prevItem, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addNewItem = async () => {
    if (!newItem.title || newItem.quantity <= 0) return

    try {
      const response = await fetch("http://localhost:8000/api/storages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newItem.title,
          quantity: newItem.quantity,
        }),
      });

    if (!response.ok) {
      throw new Error("Failed to add item");
    }

    const data = await response.json();

    setLogsData((prevData) => [
      ...prevData,
      { id: data.id, title: data.title, imageUrl: data.storage_image, quantity: data.quantity },
    ]);

    setNewItem({ title: "", quantity: 0, imageUrl: "" });

    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Storage Management</h1>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="add-item">Add New Item</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Inventory {viewType === "table" ? "Table" : "Grid"}
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setViewType(viewType === "table" ? "grid" : "table")}>
                    Switch to {viewType === "table" ? "Grid" : "Table"}
                  </Button>
                  <Button variant={isEditing ? "destructive" : "default"} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                      <>
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewType === "table" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Quantity</TableHead>
                      {isEditing && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logsData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Image
                            src={log.imageUrl || "/placeholder.svg"}
                            alt={log.title}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        </TableCell>
                        <TableCell>{log.title}</TableCell>
                        <TableCell>{log.quantity}</TableCell>
                        {isEditing && (
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="icon" variant="outline" onClick={() => discardQuantity(log.id)}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="outline" onClick={() => addQuantity(log.id)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {logsData.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <Image
                          src={log.imageUrl || "/placeholder.svg"}
                          alt={log.title}
                          width={100}
                          height={100}
                          className="rounded-md mb-2"
                        />
                        <h3 className="font-semibold">{log.title}</h3>
                        <p>Quantity: {log.quantity}</p>
                        {isEditing && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => discardQuantity(log.id)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => addQuantity(log.id)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter>
                <Button onClick={saveChanges}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="add-item">
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="text"
                  name="title"
                  placeholder="Item Name"
                  value={newItem.title}
                  onChange={handleNewItemChange}
                />
                <Input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={handleNewItemChange}
                  min="0"
                />
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {newItem.imageUrl && (
                  <Image
                    src={newItem.imageUrl || "/placeholder.svg"}
                    alt="Uploaded Image"
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addNewItem}>Add Item</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

