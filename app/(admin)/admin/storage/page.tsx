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
import defaultImg from "@/assets/logo.png"
import { apiFetch, TOKEN_EXPIRED  } from "@/utils/api"
import { apiFetchFormData } from "@/utils/formData"
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Log = {
  id: number
  title: string
  storage_image: string | StaticImageData
  quantity: number
}

export default function StorageComponent() {
  const [viewType, setViewType] = useState("table")
  const [logsData, setLogsData] = useState<Log[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newItem, setNewItem] = useState<{ title: string; quantity: number; imageUrl: string; file: File | null }>({
    title: "",
    quantity: 0,
    imageUrl: "",
    file: null,
  })

  const { push } = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const result = await apiFetch<Log[]>("/api/storages/");
        
        if (result === TOKEN_EXPIRED) {
          push("/login");
        } else {
          setLogsData(result); // Set the fetched logs data
          toast.success('Data fetched successfully!');
        }
      } catch (err: any) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong");   
        }
      }
    };

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
      const response = await apiFetch(`/api/storages/${id}/`, "PATCH", { quantity: newQuantity })
      if (response === TOKEN_EXPIRED) {
        push("/login")
      } else {
        toast.success('item changed successfully!');
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");   
      }
    }
    }

  const discardQuantity = async (id: number) => {
    const log = logsData.find((log) => log.id === id)
    const newQuantity = Math.max((log?.quantity ?? 0) - 1, 0)
    handleQuantityChange(id, newQuantity)

    try {
      const response = await apiFetch(`/api/storages/${id}/`, "PATCH", { quantity: newQuantity })
      if (response === TOKEN_EXPIRED) {
        push("/login")
      } else {
        toast.success('item changed successfully!');
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");   
      }
    }
  }

  const saveChanges = async () => {
    setIsEditing(false)
    try {
      const data = await apiFetch<Log[]>("/api/storages/")
      if (data === TOKEN_EXPIRED) {
        push("/login")
      } else {
        setLogsData(data)
        toast.success('Data saved successfully!');
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");   
      }
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
      const file = e.target.files[0];
      setNewItem((prevItem) => ({
        ...prevItem,
        imageUrl: URL.createObjectURL(file), // Preview image
        file: file, // Store file for FormData
      }));
    } else {
      setNewItem((prevItem) => ({
        ...prevItem,
        imageUrl: "",
        file: null,
      }));
    }
  }

  type LogResponse = {
    id: number
    title: string
    storage_image: string | StaticImageData
    quantity: number
  }

  const addNewItem = async () => {
    if (!newItem.title || newItem.quantity <= 0) {
      toast.error("Please provide a valid title and quantity.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newItem.title);
    formData.append("quantity", newItem.quantity.toString());

    if (newItem.file) {
      formData.append("storage_image", newItem.file); // Only append if file exists
    }

    try {
      const data = await apiFetchFormData<LogResponse>("/api/storages/", "POST", formData);
      if (data === TOKEN_EXPIRED) {
        push("/login");
      } else {
        setLogsData((prevData) => [
          ...prevData,
          { id: data.id, title: data.title, storage_image: data.storage_image || defaultImg, quantity: data.quantity },
        ]);
        toast.success("Item added successfully!");
        setNewItem({ title: "", quantity: 0, imageUrl: "", file: null }); // Reset state
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
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
                            src={log.storage_image || defaultImg}
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
                          src={log.storage_image || defaultImg}
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
                    src={newItem.imageUrl || defaultImg}
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

