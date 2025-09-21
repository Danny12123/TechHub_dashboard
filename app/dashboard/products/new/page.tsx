"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MultiImageUpload } from "@/components/multi-image-upload"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadMedia } from "@/lib/utils"
import useFetchData from "@/hooks/useFetchData"
import axios from "axios"

import Cookies from "js-cookie"
interface FormData {
  name: string;
  brand: string;
  description: string;
  tags: string;
  price: string;
  comparePrice: string;
  sku: string;
  stock: string;
  category: string;
  weight: string;
  shipping_length_cm: number;
  shipping_width_cm: number;
  shipping_height_cm: number;
  dimensions: string;
  isActive: boolean;
  isFeatured: boolean;
  specifications: { key: string; value: string }[];
}
export type Category = {
  id: string
  name: string
  description: string
  parent_id: string | null
  is_active: boolean
  created_at: string
  created_by: string | null
}
interface UploadedImage {
  file: File
  preview: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    brand: "",
    sku: "",
    stock: "",
    weight: "",
    shipping_length_cm: 0,
    shipping_width_cm: 0,
    shipping_height_cm: 0,
    dimensions: "",
    isActive: true,
    isFeatured: false,
    tags: "",
    specifications: [] as { key: string; value: string }[],

  })

  const [images, setImages] = useState<UploadedImage[]>([])
  console.log(images)
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }


  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    handleInputChange("specifications", updatedSpecs);
  };

  const addSpecification = () => {
    handleInputChange("specifications", [...formData.specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    const updatedSpecs = formData.specifications.filter((_, i) => i !== index);
    handleInputChange("specifications", updatedSpecs);
  };

  const url = `${process.env.NEXT_PUBLIC_API_BASE}/products/categories`
  const {data} = useFetchData(url)
  console.log(data)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate required fields
    if (!formData.name || !formData.price || !formData.category || images.length < 4) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and upload at least 4 images",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }
    // 2. Upload images/videos to Supabase
    const uploadedMedia = []

    for (let i = 0; i < images.length; i++) {
      const img = images[i] as UploadedImage
      console.log("Processing image", i, img);
      
      if (!img.file || !(img.file instanceof File)) {
        console.error("Invalid file at index", i, img);
        toast({
          title: "Image Upload Error",
          description: `Image ${i + 1} is not a valid file. Please re-upload.`,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      try {
        console.log("Uploading image", i, img.file.name);
        const url = await uploadMedia(img.file)
        console.log("Upload successful, URL:", url);
        uploadedMedia.push({
          media_url: url,
          media_type: img.file.type.startsWith("video") ? "video" : "image",
          alt_text: formData.name,
          sort_order: i,
          is_primary: i === 0,
        })
      } catch (err) {
        console.error("Upload failed for image", i, err);
        toast({
          title: "Image Upload Error",
          description: `Failed to upload image ${i + 1}`,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }
    console.log("Starting upload of images:", uploadMedia)
    const token = Cookies.get("access_token");
    // 3. Transform data to backend shape
    const payload = {
      name: formData.name,
      description: formData.description,
      specifications:  formData.specifications 
    ? Object.fromEntries(
        formData.specifications.map((spec: { key: string; value: string }) => [
          spec.key.trim(),
          spec.value
        ])
      )
    : {}, // you can extend this
      brand: formData.brand,
      tags: formData.tags,
      price: parseFloat(formData.price),
      compare_at_price: parseFloat(formData.comparePrice || "0"),
      category_id: formData.category, // ensure it matches backend UUID
      sku: formData.sku,
      stock_quantity: parseInt(formData.stock || "0"),
      status: formData.isActive ? "active" : "inactive",
      is_featured: formData.isFeatured,
      shipping_weight_kg: parseFloat(formData.weight || "0"),
      shipping_length_cm: 0, // parse from dimensions if needed
      shipping_width_cm: 0,
      shipping_height_cm: 0,
      media: uploadedMedia,
    }

    try {
      // Simulate API call
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/products/`, payload ,{
      headers: {
      Authorization: `Bearer ${token}`,
      }
    })
      
    // router.push("/dashboard/products")
    setIsLoading(false)

    toast({
      title: "Product Created",
      description: `${formData.name} has been successfully added to your inventory`,
    })
    } catch (error) {
    setIsLoading(false)
      console.error("Product creation error:", error)
    }
    

  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product listing for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="Enter brand name"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specifications</Label>
                  <div className="space-y-3">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Key (e.g., Condition)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                        />
                        <Input
                          placeholder="Value (e.g., New)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeSpecification(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addSpecification}>
                    + Add Specification
                  </Button>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload high-quality images of your product (minimum 4 required)</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiImageUpload
                  images={images}
                  onImagesChange={setImages}
                  minImages={4}
                  maxImages={10}
                />
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>Set pricing and manage inventory levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare at Price</Label>
                    <Input
                      id="comparePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.comparePrice}
                      onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
                <CardDescription>Control product visibility and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Categorize your product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {data && data?.map((item:Category, index: number) => (
                        <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
                <CardDescription>Physical product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (L cm)</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 20×15×5"
                    value={formData.shipping_length_cm}
                    onChange={(e) => handleInputChange("shipping_length_cm", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (W cm)</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 20×15×5"
                    value={formData.shipping_width_cm}
                    onChange={(e) => handleInputChange("shipping_width_cm", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (H cm)</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 20×15×5"
                    value={formData.shipping_height_cm}
                    onChange={(e) => handleInputChange("shipping_height_cm", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button type="submit" >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
