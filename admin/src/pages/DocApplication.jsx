import { useEffect, useState } from "react";
import axios from "axios";
// import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function DocApplication() {
  // const { token } = useAuth();
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  if (!token) {
    toast.error("You must be logged in to view this page");
    navigate("/login"); // Redirect to login if no token
    return null;
  }
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/doctors/admin/pending-applications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched Applications:", res.data); // ✅ Debug log

    // Ensure it's an array before setting
    if (Array.isArray(res.data)) {
      setApplications(res.data);
    } else {
      toast.error("Unexpected response format");
      setApplications([]); // prevent crash
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch applications");
    setApplications([]); // prevent crash
  }
};


  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/doctors/admin/application/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Application ${status}`);
      fetchApplications(); // Refresh after update
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        Admin – Pending Doctor Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-center text-gray-600">No pending applications</p>
      ) : (
        <div className="grid gap-6 max-w-5xl mx-auto">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-pink-700 mb-2">
                {app.userId?.firstName} {app.userId?.lastName}
              </h3>
              <p><strong>Email:</strong> {app.userId?.email}</p>
              <p><strong>Phone:</strong> {app.userId?.phoneNumber}</p>
              <p><strong>Degree:</strong> {app.degree}</p>
              <p><strong>Specialization:</strong> {app.specialization}</p>
              <p><strong>Experience:</strong> {app.experience} years</p>

              <div className="mt-4">
                <p className="font-medium">Documents:</p>
                <ul className="list-disc pl-6 text-blue-600 space-y-1">
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
            <span className="text-sm text-pink-600 font-medium text-center px-2">
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

                </ul>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => updateStatus(app._id, "approved")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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

export default DocApplication;
