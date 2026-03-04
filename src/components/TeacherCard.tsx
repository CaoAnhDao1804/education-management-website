import TeacherAvatar from '../assets/TeacherAvatar.jpg';
import { useState } from 'react';

type TeacherCardProps = {
    teacherId: number;
    name: string;
    email: string;
    phoneNumber: string;
    onUpdatedTeacher: () => void
};

export default function TeacherCard({teacherId, name, email, phoneNumber, onUpdatedTeacher}: TeacherCardProps) {

    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [editedTeacherName, setEditedTeacherName] = useState(name);
    const [editedTeacherEmail, setEditedTeacherEmail] = useState(email);
    const [editedTeacherPhoneNumber, setEditedTeacherPhoneNumber] = useState(phoneNumber);

    function handleDeleteTeacher() {
        //call api to delete this teacher
        const formData = new URLSearchParams();
        formData.append("id", teacherId.toString());
        const response = fetch('http://localhost:8080/teachers/delete', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        response.then(() => {
			setShowConfirmDeleteModal(false);
            onUpdatedTeacher();
		})
    }

    function handleEditTeacher() {
		const formData = new URLSearchParams();
		formData.append("teacherId", teacherId.toString());
		formData.append("teacherName", editedTeacherName);
		formData.append("email", editedTeacherEmail);
		formData.append("phoneNumber", editedTeacherPhoneNumber);

		const response = fetch("http://localhost:8080/teachers/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData.toString(),
		});

		response.then(() => {
			setShowEditModal(false);
            onUpdatedTeacher();
		})
			.catch(error => console.error("Error:", error));
    }

    return (
        <div className="w-70 h-70">
            {showEditModal &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>
                        <h4> Teacher's Name: </h4>
                        <input className="h-full w-full border border-green-200" defaultValue={name} onChange={(e) => setEditedTeacherName(e.target.value)} />
                        <h4> Email: </h4>
                        <input className="h-full w-full border border-green-200" defaultValue={email} onChange={(e) => setEditedTeacherEmail(e.target.value)} />
                        <h4> Phone Number: </h4>
                        <input className="h-full w-full border border-green-200" defaultValue={phoneNumber} onChange={(e) => setEditedTeacherPhoneNumber(e.target.value)} />
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
                            onClick={handleEditTeacher}>
                            Save
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={() => setShowEditModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            }

            {
                showConfirmDeleteModal &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
                        <p className="mb-6">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-red-600">{name}</span>?
                            This action cannot be undone.
                        </p>
                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmDeleteModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTeacher}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            }
            {/* Khối màu nền cho ảnh */}
            <div>
                <img
                    src={TeacherAvatar}
                    alt={`Ảnh của ${name}`}
                    className="w-50 h-50"
                />
            </div>
            {/* Tên và Môn dạy */}
            <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <p className="text-gray-500">{email}</p>
                <p className="text-gray-500">{phoneNumber}</p>
            </div>

            <div>
                <button className="text-blue-600 hover:underline"
                    onClick={() => {
                        setShowEditModal(true);
                    }}>Edit
                </button>

                <button
                    onClick={() => {
                        setShowConfirmDeleteModal(true);
                    }}
                    className="text-red-600 hover:underline"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}