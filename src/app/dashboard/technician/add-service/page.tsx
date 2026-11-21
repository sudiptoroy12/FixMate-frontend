
"use client";

import {  useState } from "react";

import {
  Wrench,
  ImagePlus,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = ["Home Visit", "Shop Drop-off"];

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function AddServicePage() {
 const [loading, setLoading] = useState(false);
const [image, setImage] = useState<File | null>(null);
const [preview, setPreview] = useState<string | null>(null);

const handleImageChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    toast.error("Only JPG, PNG and WEBP images are allowed.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB.");
    event.target.value = "";
    return;
  }

  const previewUrl = URL.createObjectURL(file);

  setImage(file);
  setPreview(previewUrl);
};

const removeImage = () => {
  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setImage(null);
  setPreview(null);
};


const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (!image) {
    toast.error("Please upload a service image.");
    return;
  }

  const form = event.currentTarget;
  const formData = new FormData(form);

  const serviceData = {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? "").trim(),
    basePrice: Number(formData.get("basePrice")),
    estimatedDuration: String(
      formData.get("estimatedDuration") ?? ""
    ).trim(),
    serviceMode: String(formData.get("serviceMode") ?? ""),
    serviceArea: String(formData.get("serviceArea") ?? "").trim(),
  };
  if (
  !Number.isFinite(serviceData.basePrice) ||
  serviceData.basePrice < 1 ||
  Math.round(serviceData.basePrice * 100) / 100 !==
    serviceData.basePrice
) {
  toast.error(
    "Service price must be at least $1.00 USD with a maximum of 2 decimal places."
  );
  return;
}

  if (
    !serviceData.title ||
    !serviceData.category ||
    !serviceData.description ||
    !serviceData.serviceMode ||
    !serviceData.serviceArea ||
    !serviceData.estimatedDuration ||
    !Number.isFinite(serviceData.basePrice) ||
    serviceData.basePrice <= 0
  ) {
    toast.error("Please provide valid service information.");
    return;
  }

  setLoading(true);

  try {
    // Step 1: Get authenticated JWT token
   const token = await getTokenFromClient();

if (!token) {
  throw new Error("Authentication failed. Please sign in again.");
}

    // Step 2: Upload image to ImgBB through your Next.js API
    const imageFormData = new FormData();
    imageFormData.append("image", image);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: imageFormData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadResult.success || !uploadResult.imageUrl) {
      throw new Error(
        uploadResult.message || "Image upload failed."
      );
    }

    const imageUrl = uploadResult.imageUrl;

    // Step 3: Prepare complete service data
    const completeServiceData = {
      ...serviceData,
      image: imageUrl,
    };

    // Step 4: Send service data to Express backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("Backend API URL is not configured.");
    }

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completeServiceData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to create service."
      );
    }

    // Step 5: Success
    toast.success("Service created successfully!");

    form.reset();

    URL.revokeObjectURL(preview!);
    setImage(null);
    setPreview(null);

  } catch (error) {
    console.error("Service creation error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong!"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Heading */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Wrench size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Add New Service
          </h2>
          <p className="mt-1 text-sm text-muted">
            Publish your repair service for customers.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Service Title *
          </label>

          <input
            name="title"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. iPhone Screen Replacement"
            className={inputClass}
          />
        </div>

        {/* Category and Price */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Category *
            </label>

            <select
              name="category"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select category
              </option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

         <div className="space-y-2">
  <label className="text-sm font-semibold text-foreground">
    Starting Price (USD) *
  </label>

  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
      $
    </span>

    <input
      name="basePrice"
      type="number"
      min="1"
      max="999999.99"
      step="0.01"
      required
      placeholder="e.g. 25.00"
      className={`${inputClass} pl-9`}
    />
  </div>

  <p className="text-xs text-muted">
    Minimum service price is $1.00 USD.
  </p>
</div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Description *
          </label>

          <textarea
            name="description"
            required
            rows={5}
            maxLength={1000}
            placeholder="Explain what your repair service includes..."
            className="w-full resize-none rounded-xl border border-input bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Duration and Service Mode */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Estimated Duration *
            </label>

            <input
              name="estimatedDuration"
              type="text"
              required
              maxLength={50}
              placeholder="e.g. 2-3 hours or 1 day"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Service Mode *
            </label>

            <select
              name="serviceMode"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select service mode
              </option>

              {serviceModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Service Area */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Service Area *
          </label>

          <input
            name="serviceArea"
            type="text"
            required
            maxLength={150}
            placeholder="e.g. Dhanmondi, Dhaka"
            className={inputClass}
          />
        </div>

        {/* Image */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Service Banner Image *
          </label>

          {preview ? (
            <div className="relative h-56 w-full overflow-hidden rounded-xl border border-border sm:w-80">
              <img
                src={preview}
                alt="Service preview"
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                aria-label="Remove image"
              >
                <X size={17} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-5 py-10 text-center transition hover:border-primary hover:bg-primary/5">
              <div className="mb-3 rounded-xl bg-primary/10 p-3 text-primary">
                <ImagePlus size={26} />
              </div>

              <p className="text-sm font-semibold text-foreground">
                Click to upload service image
              </p>

              <p className="mt-1 text-xs text-muted">
                JPG, PNG or WEBP · Maximum 5MB
              </p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end border-t border-border pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload size={18} />
                Publish Service
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
