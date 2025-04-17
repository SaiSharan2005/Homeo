import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StaffRoleManagement = () => {
  // List of all roles available for selection.
  const availableRoles = [
    "ADVERTISEMENT",
    "APPOINTMENT",
    "USERS",
    "ACTIVITY",
    "INVENTORY",
    "PAYMENT",
  ];

  // State to hold the staff list, loading flag, and search query.
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch staff data on component mount.
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/staff-roles`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        const data = await response.json();

        // Map each staff and add an "isEditing" property (default false),
        // and convert role objects to an array of strings.
        const mappedStaff = data.map((staff) => ({
          ...staff,
          isEditing: false,
          selectedRoles: staff.roles ? staff.roles.map((role) => role.name) : [],
        }));
        setStaffList(mappedStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Toggle edit mode for a specific staff member.
  const handleEditToggle = (userId) => {
    setStaffList((prevStaffList) =>
      prevStaffList.map((staff) =>
        staff.id === userId
          ? { ...staff, isEditing: !staff.isEditing }
          : staff
      )
    );
  };

  // Toggle a role selection for a specific staff member.
  const handleCheckboxChange = (userId, roleName) => {
    setStaffList((prevStaffList) =>
      prevStaffList.map((staff) => {
        if (staff.id === userId) {
          // Toggle the role in selectedRoles.
          const updatedRoles = staff.selectedRoles.includes(roleName)
            ? staff.selectedRoles.filter((r) => r !== roleName)
            : [...staff.selectedRoles, roleName];
          return { ...staff, selectedRoles: updatedRoles };
        }
        return staff;
      })
    );
  };

  // Save the changes for a single staff member.
  const handleRowSave = async (staff) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/${staff.id}/roles`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify(staff.selectedRoles),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to update roles for ${staff.username} (ID: ${staff.id})`
        );
      }
      // Turn off editing mode on success.
      setStaffList((prevStaffList) =>
        prevStaffList.map((s) =>
          s.id === staff.id ? { ...s, isEditing: false } : s
        )
      );
      alert(`Roles updated for ${staff.username}.`);
    } catch (error) {
      console.error("Error updating roles:", error);
      alert("Error updating roles: " + error.message);
    }
  };

  // Filter staff based on the search query.
  const filteredStaffList = staffList.filter((staff) => {
    const query = searchQuery.toLowerCase();
    return (
      staff.username.toLowerCase().includes(query) ||
      (staff.userId && staff.userId.toLowerCase().includes(query)) ||
      (staff.phoneNumber && staff.phoneNumber.includes(query))
    );
  });

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Header: Title and Add Staff Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Staff Role Management
        </h2>
        <button
          onClick={() => navigate("/addStaff")}
          className="mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Username, User ID or Mobile Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading staff data...</div>
      ) : filteredStaffList.length === 0 ? (
        <div className="text-center text-gray-600">No staff data found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-3 px-4 text-sm font-medium">User ID</th>
                <th className="py-3 px-4 text-sm font-medium">Username</th>
                <th className="py-3 px-4 text-sm font-medium">
                  Mobile Number
                </th>
                <th className="py-3 px-4 text-sm font-medium">Roles</th>
                <th className="py-3 px-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredStaffList.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b hover:bg-gray-50 transition cursor-default"
                >
                  <td className="py-3 px-4">
                    {staff.userId ? staff.userId : staff.id}
                  </td>
                  <td className="py-3 px-4">{staff.username}</td>
                  <td className="py-3 px-4">{staff.phoneNumber}</td>
                  <td className="py-3 px-4">
                    {staff.isEditing ? (
                      // Display checkboxes for each role when editing.
                      availableRoles.map((roleName) => (
                        <div key={roleName} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                            checked={staff.selectedRoles.includes(roleName)}
                            onChange={() =>
                              handleCheckboxChange(staff.id, roleName)
                            }
                          />
                          <span>{roleName}</span>
                        </div>
                      ))
                    ) : (
                      // Show selected roles as comma-separated text.
                      <span>
                        {staff.selectedRoles.length > 0
                          ? staff.selectedRoles.join(", ")
                          : "No roles selected"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {staff.isEditing ? (
                      <button
                        onClick={() => handleRowSave(staff)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md shadow transition duration-300"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditToggle(staff.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md shadow transition duration-300"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffRoleManagement;
