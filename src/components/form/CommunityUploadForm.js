import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Cookies from "js-cookie"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const getAuthToken = () => {
    return Cookies.get("auth_token") || localStorage.getItem("auth_token")
}


export default function UploadResourceForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resource_type: "",
    url: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to upload resource");

      toast.success("Resource submitted for approval!");
      setFormData({ title: "", description: "", resource_type: "", url: "" }); // Reset form
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upload a Resource</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-gray-800">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="text-gray-800"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-gray-800">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="text-gray-800"
            required
          />
        </div>

        {/* URL */}
        <div>
          <Label htmlFor="url" className="text-gray-800">URL</Label>
          <Input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="text-gray-800"
            required
          />
        </div>

        {/* Resource Type */}
        <div>
          <Label className="text-gray-800">Resource Type</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, resource_type: value })} required>
            <SelectTrigger className="text-gray-800">
              <SelectValue placeholder="Select Type" className="text-gray-800" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GitHub" className="text-gray-800">GitHub</SelectItem>
              <SelectItem value="Course" className="text-gray-800">Course</SelectItem>
              <SelectItem value="Blog" className="text-gray-800">Blog</SelectItem>
              <SelectItem value="Research Paper" className="text-gray-800">Research Paper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Resource
        </Button>
      </form>
    </div>
  );
}
