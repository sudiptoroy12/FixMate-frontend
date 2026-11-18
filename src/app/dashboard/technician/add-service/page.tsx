
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

    const formData = new FormData(event.currentTarget);

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
      !serviceData.title ||
      !serviceData.description ||
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
      // Backend and ImgBB integration will be added next.
      console.log("Service data:", serviceData);
      console.log("Selected image:", image);

      toast.success("Service form is ready!");
    } catch {
      toast.error("Something went wrong!");
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

            <input
              name="basePrice"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="e.g. 25"
              className={inputClass}
            />
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
