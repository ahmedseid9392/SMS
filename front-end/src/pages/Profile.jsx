import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/images/hero.png";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [previewPic, setPreviewPic] = useState(user?.profilePic || defaultAvatar);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviewPic(base64);
        updateProfile({ profilePic: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="text-center">
              <img
                src={previewPic}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover shadow-lg"
              />
              <label className="mt-4 block">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                  Change Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border rounded px-4 py-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border rounded px-4 py-2 mt-1"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: user.name, phone: user.phone });
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                  <p className="text-lg text-gray-600 mt-2">Role: <strong>{user?.role}</strong></p>
                  <p className="text-lg text-gray-600">Email: <strong>{user?.email}</strong></p>
                  <p className="text-lg text-gray-600">Phone: <strong>{user?.phone || "-"}</strong></p>
                  {user?.role === "STUDENT" && (
                    <>
                      <p className="text-lg text-gray-600">Grade: <strong>{user?.grade}</strong></p>
                      <p className="text-lg text-gray-600">Section: <strong>{user?.section}</strong></p>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setFormData({ name: user.name, phone: user.phone });
                    }}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;