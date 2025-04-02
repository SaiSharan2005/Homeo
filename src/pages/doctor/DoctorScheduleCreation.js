import React, { useState } from "react";
import { parse, format, addMinutes, isBefore } from "date-fns";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { resetDoctorTimings, createDoctorTimings } from "../../services/doctor/doctor_api"; // adjust the import path as needed
import { useNavigate } from "react-router-dom";

const DoctorScheduleCreation = () => {
  const navigate = useNavigate();

  // New slot form with only startTime, endTime, and gap.
  const [newSlot, setNewSlot] = useState({
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    gap: "60", // gap in minutes as a string
  });
  const [slots, setSlots] = useState([]);
  
  // State for editing a slot.
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editingSlot, setEditingSlot] = useState({ startTime: "", endTime: "" });

  // Update new slot form values.
  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({ ...prev, [name]: value }));
  };

  // Generate slots based on start, end, and gap.
  const addSlots = () => {
    const start = parse(newSlot.startTime, "h:mm a", new Date());
    const end = parse(newSlot.endTime, "h:mm a", new Date());
    const gapMinutes = parseInt(newSlot.gap, 10);

    if (!isBefore(start, end)) {
      alert("Start time must be before end time");
      return;
    }
    if (isNaN(gapMinutes) || gapMinutes <= 0) {
      alert("Please provide a valid gap in minutes");
      return;
    }

    const newSlots = [];
    let current = start;
    // Create slots until the next slot's end time would exceed the overall end time.
    while (isBefore(addMinutes(current, gapMinutes), end) || +addMinutes(current, gapMinutes) === +end) {
      const slotEnd = addMinutes(current, gapMinutes);
      newSlots.push({
        id: Date.now() + Math.random(), // ensure unique id
        startTime: format(current, "h:mm a"),
        endTime: format(slotEnd, "h:mm a"),
      });
      current = slotEnd;
    }
    // Merge and sort all slots by start time.
    const allSlots = [...slots, ...newSlots].sort((a, b) => {
      return parse(a.startTime, "h:mm a", new Date()) - parse(b.startTime, "h:mm a", new Date());
    });
    setSlots(allSlots);

    // Reset new slot form.
    setNewSlot({
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      gap: "60",
    });
  };

  // Start editing a slot.
  const handleEditSlot = (slot) => {
    setEditingSlotId(slot.id);
    setEditingSlot({ startTime: slot.startTime, endTime: slot.endTime });
  };

  // Handle changes in the editing form.
  const handleEditingSlotChange = (e) => {
    const { name, value } = e.target;
    setEditingSlot((prev) => ({ ...prev, [name]: value }));
  };

  // Save the edited slot.
  const saveEditedSlot = () => {
    const updatedSlots = slots.map((slot) => {
      if (slot.id === editingSlotId) {
        return {
          ...slot,
          startTime: editingSlot.startTime,
          endTime: editingSlot.endTime,
        };
      }
      return slot;
    });
    // Resort the slots after editing.
    const sortedSlots = updatedSlots.sort((a, b) => {
      return parse(a.startTime, "h:mm a", new Date()) - parse(b.startTime, "h:mm a", new Date());
    });
    setSlots(sortedSlots);
    setEditingSlotId(null);
    setEditingSlot({ startTime: "", endTime: "" });
  };

  // Cancel editing.
  const cancelEditing = () => {
    setEditingSlotId(null);
    setEditingSlot({ startTime: "", endTime: "" });
  };

  // Delete a slot.
  const deleteSlot = (id) => {
    setSlots(slots.filter((slot) => slot.id !== id));
  };

  // Handle Save Schedule: reset timings and create new ones.
  const handleSaveSchedule = async () => {
    try {
      // First, reset the timings.
      await resetDoctorTimings();
      
      // Convert slots to required format.
      const data = slots.map((slot) => {
        const parsedStart = parse(slot.startTime, "h:mm a", new Date());
        const parsedEnd = parse(slot.endTime, "h:mm a", new Date());
        return {
          startTime: format(parsedStart, "HH:mm"),
          endTime: format(parsedEnd, "HH:mm"),
          inUse: true,
        };
      });
      
      // Call createDoctorTimings with the data.
      await createDoctorTimings(data);
      console.log("Schedule saved successfully", data);
      navigate("/doctor/home");

    } catch (error) {
      console.error("Error saving schedule", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Input Form for Adding Slots */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="text"
              name="startTime"
              value={newSlot.startTime}
              onChange={handleNewSlotChange}
              placeholder="09:00 AM"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="text"
              name="endTime"
              value={newSlot.endTime}
              onChange={handleNewSlotChange}
              placeholder="05:00 PM"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gap (mins)</label>
            <input
              type="number"
              name="gap"
              value={newSlot.gap}
              onChange={handleNewSlotChange}
              placeholder="60"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
        </div>
        <button
          onClick={addSlots}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Slots
        </button>
      </div>

      {/* Doctor Timings in Provided Format */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Doctor Timings</h3>
        <div className="flex space-x-4 flex-wrap">
          {slots && slots.length > 0 ? (
            slots.map((slot, index) => (
              <div
                key={slot.id}
                className="min-w-[120px] p-3 border rounded-lg flex flex-col items-center hover:shadow transition relative"
              >
                {/* Edit and Delete Icons at the Top */}
                <div className="absolute top-1 right-1 flex space-x-1">
                  <button onClick={() => handleEditSlot(slot)} className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={14} />
                  </button>
                  <button onClick={() => deleteSlot(slot.id)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                {editingSlotId === slot.id ? (
                  <div className="w-full mt-6 flex flex-col items-center">
                    <input
                      type="text"
                      name="startTime"
                      value={editingSlot.startTime}
                      onChange={handleEditingSlotChange}
                      className="w-full text-center border rounded-sm p-1 mb-1"
                    />
                    <input
                      type="text"
                      name="endTime"
                      value={editingSlot.endTime}
                      onChange={handleEditingSlotChange}
                      className="w-full text-center border rounded-sm p-1 mb-1"
                    />
                    <div className="flex space-x-2">
                      <button onClick={saveEditedSlot} className="text-green-500 hover:text-green-700">
                        <FiCheck size={14} />
                      </button>
                      <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-xs text-gray-600">Slot {index + 1}</span>
                    <span className="text-xs text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No timings available.</p>
          )}
        </div>
      </div>

      {/* Save Schedule Button */}
      <button
        onClick={handleSaveSchedule}
        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Save Schedule
      </button>
    </div>
  );
};

export default DoctorScheduleCreation;
