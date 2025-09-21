import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const uploadMedia = async (file: File | string, bucket = "products") => {
  try {
    // Check if Supabase is properly configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("Supabase configuration missing");
    }

    // If it's already a URL, return it
    if (typeof file === "string") {
      return file;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log("Uploading file:", fileName, "Size:", file.size);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw uploadError;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    console.log("Upload successful, public URL:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};