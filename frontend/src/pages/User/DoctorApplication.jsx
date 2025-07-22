import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";
import { toast } from "react-toastify";
import axios from "axios";

function ApplyDoctor() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    degree: "",
    specialization: "",
    experience: "",
    documents: [],
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [statusChecked, setStatusChecked] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // pending | approved | rejected | null

  const cloudName = "dl9k1eipe"; // ✅ Your Cloudinary cloud name
  const uploadPreset = "neoHealth"; // ✅ Your Cloudinary unsigned preset

  // Check if user has already applied
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors/check-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicationStatus(res.data.status); // "pending", "approved", "rejected", or null
      } catch (err) {
        console.error("Status check failed:", err);
      } finally {
        setStatusChecked(true);
      }
    };

    if (token) checkApplicationStatus();
  }, [token]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setForm((prev) => ({
      ...prev,
      documents: [...prev.documents, ...uploadedUrls],
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setUploading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.degree || !form.specialization || !form.experience) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.documents.length === 0) {
      toast.error("Please upload your documents before submitting");
      return;
    }

    try {
      const payload = {
        degree: form.degree,
        specialization: form.specialization,
        experience: form.experience,
        documents: form.documents,
      };

      await axios.post("http://localhost:5000/api/doctors/apply", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Application submitted!");
      navigate("/profile");
    } catch (err) {
      console.error("Application error:", err);
      toast.error("Application failed.");
    }
  };

  if (!statusChecked) return <div className="p-8 text-center">Checking application status...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <SidebarLayout>
        <div className="flex justify-center items-center w-full h-full p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
            {applicationStatus === "pending" && (
              <div className="text-center text-pink-600 font-semibold text-xl">
                Your application is currently <strong>pending</strong> for review.
              </div>
            )}
            {applicationStatus === "approved" && (
              <div className="text-center text-green-600 font-semibold text-xl">
                ✅ Your doctor application has been <strong>approved</strong>!
              </div>
            )}
            {applicationStatus === "rejected" && (
              <div className="text-center text-red-600 font-semibold text-xl">
                ❌ Your doctor application was <strong>rejected</strong>. You may contact support for clarification.
              </div>
            )}

            {applicationStatus === null && (
              <>
                <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
                  Apply for Doctor Role
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    placeholder="Medical Degree"
                    className="input"
                    required
                  />
                  <input
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="Specialization"
                    className="input"
                    required
                  />
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Years of Experience"
                    type="number"
                    className="input"
                    required
                  />
                  <div className="col-span-full">
                    <label className="block mb-1 text-gray-700 font-medium">
                      Upload Documents (PDF or Images)
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm border rounded p-2"
                    />
                  </div>
                  {form.documents.length > 0 && (
                    <div className="col-span-full">
                      <p className="text-sm text-gray-500 mb-2">Uploaded Documents:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {form.documents.map((doc, idx) => (
                          <li key={idx}>
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {doc}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="col-span-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
                  >
                    {uploading ? "Uploading..." : "Submit Application"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
}

export default ApplyDoctor;
