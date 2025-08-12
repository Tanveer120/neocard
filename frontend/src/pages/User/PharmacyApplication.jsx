import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";
import { toast } from "react-toastify";
import axios from "axios";

function ApplyPharmacy() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pharmacyName: "",
    licenseNumber: "",
    address: "",
    phoneNumber: "",
    experience: "",
    documents: [],
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [statusChecked, setStatusChecked] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // pending | approved | rejected | null

  const cloudName = "dl9k1eipe"; // Your Cloudinary cloud name
  const uploadPreset = "neoHealth"; // Your Cloudinary unsigned preset

  // Check if user has already applied
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacy/check-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicationStatus(res.data.status); // "pending", "approved", "rejected", or null
        console.log("Pharmacy application status:", res.data.status);
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

    if (!form.pharmacyName || !form.licenseNumber || !form.address || !form.phoneNumber || !form.experience) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.documents.length === 0) {
      toast.error("Please upload your documents before submitting");
      return;
    }

    try {
      const payload = {
        pharmacyName: form.pharmacyName,
        licenseNumber: form.licenseNumber,
        address: form.address,
        phoneNumber: form.phoneNumber,
        experience: form.experience,
        documents: form.documents,
      };

      await axios.post("http://localhost:5000/api/pharmacy/apply", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Pharmacy application submitted!");
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
              <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="text-yellow-700 font-semibold text-xl mb-2">
                  ⏳ Application Under Review
                </div>
                <p className="text-yellow-600">Your pharmacy application is currently pending for review.</p>
              </div>
            )}
            {applicationStatus === "approved" && (
              <div className="text-center bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-green-700 font-semibold text-xl mb-2">
                  ✅ Application Approved
                </div>
                <p className="text-green-600">Your pharmacy application has been approved!</p>
              </div>
            )}
            {applicationStatus === "rejected" && (
              <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="text-red-700 font-semibold text-xl mb-2">
                  ❌ Application Rejected
                </div>
                <p className="text-red-600">Your pharmacy application was rejected. Please contact support for clarification.</p>
              </div>
            )}

            {applicationStatus === "none" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Apply for Pharmacy Role
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="pharmacyName"
                    value={form.pharmacyName}
                    onChange={handleChange}
                    placeholder="Pharmacy Name"
                    className="input"
                    required
                  />
                  <input
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="License Number"
                    className="input"
                    required
                  />
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
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
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Pharmacy Address"
                      className="input"
                      required
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block mb-1 text-gray-700 font-medium">
                      Upload Documents (License, Registration, etc.)
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
                    className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ApplyPharmacy; 