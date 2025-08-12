import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PharmacyApplication() {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to view this page");
    navigate("/login");
    return null;
  }
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/admin/pending-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Pharmacy Applications:", res.data);

      if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        toast.error("Unexpected response format");
        setApplications([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pharmacy applications");
      setApplications([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/pharmacy/admin/application/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Pharmacy application ${status}`);
      fetchApplications(); // Refresh after update
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pharmacy Applications
        </h1>
        <p className="text-gray-600">Review and manage pending pharmacy applications</p>
      </div>

              {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💊</div>
            <p className="text-gray-600 text-lg">No pending pharmacy applications</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {app.userId?.firstName} {app.userId?.lastName}
                </h3>
              <p><strong>Email:</strong> {app.userId?.email}</p>
              <p><strong>Phone:</strong> {app.userId?.phoneNumber}</p>
              <p><strong>Pharmacy Name:</strong> {app.pharmacyName}</p>
              <p><strong>License Number:</strong> {app.licenseNumber}</p>
              <p><strong>Address:</strong> {app.address}</p>
              <p><strong>Pharmacy Phone:</strong> {app.phoneNumber}</p>
              <p><strong>Experience:</strong> {app.experience} years</p>

              <div className="mt-4">
                <p className="font-medium">Documents:</p>
                <div className="flex gap-4 flex-wrap mt-2">
                  {app.documents.map((doc, i) => {
                    const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(doc);
                    const isPDF = /\.pdf$/i.test(doc);

                    return (
                      <div key={i} className="w-28 h-28 border rounded overflow-hidden shadow-md">
                        {isImage ? (
                          <img
                            src={doc}
                            alt={`Document ${i + 1}`}
                            onClick={() => window.open(doc, "_blank")}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                          />
                        ) : isPDF ? (
                          <div
                            onClick={() => window.open(doc, "_blank")}
                            className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200"
                          >
                                         <span className="text-sm text-blue-600 font-medium text-center px-2">
               View PDF {i + 1}
             </span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-red-500">
                            Unsupported
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => updateStatus(app._id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PharmacyApplication; 