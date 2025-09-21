"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedImage {
  file: File
  preview: string
}

interface MultiImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  minImages?: number
  className?: string
}

export function MultiImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  minImages = 4,
  className,
}: MultiImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  interface UploadedImage {
    file: File
    preview: string
  }



  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      setError(null)

      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    },
    [images, maxImages],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const files = Array.from(e.target.files || [])
      handleFiles(files)
    },
    [images, maxImages],
  )


  const handleFiles = async (files: File[]) => {
  const imageFiles = files.filter((file) => file.type.startsWith("image/"))

  if (imageFiles.length === 0) {
    setError("Please select valid image files")
    return
  }

  if (images.length + imageFiles.length > maxImages) {
    setError(`Maximum ${maxImages} images allowed`)
    return
  }

  const newUploads: UploadedImage[] = await Promise.all(
    imageFiles.map(async (file) => {
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
      return { file, preview }
    })
  )

  onImagesChange([...images, ...newUploads])
}




  const removeImage = (index: number) => {
    const newImages = [...images].filter((_, i) => i !== index);
    onImagesChange(newImages as UploadedImage[]);
    setError(null);
  };
  const isMinimumMet = images.length >= minImages
  const canAddMore = images.length < maxImages

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={cn("image-upload-area cursor-pointer", dragActive && "dragover")}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input id="file-input" type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />

          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Drop images here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB each. {maxImages - images.length} more images allowed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isMinimumMet ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              ✓ Minimum {minImages} images uploaded
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Need {minImages - images.length} more images
            </Badge>
          )}
        </div>
        <span className="text-muted-foreground">
          {images.length} / {maxImages} images
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <Card key={index} className="image-preview-item">
              <CardContent className="p-0 h-full">
                <img
                  src={typeof image === "string" ? image : image.preview || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="image-preview-overlay">
                  <Button variant="destructive" size="icon" onClick={() => removeImage(index)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add more placeholder */}
          {canAddMore && (
            <Card
              className="image-preview-item border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Add more</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
