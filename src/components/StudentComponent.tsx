import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/AuthUtils";

export default function StudentComponent() {

    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newBirthday, setNewBirthday] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);
    const [deletedStudent, setDeletedStudent] = useState<any>(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [filterValue, setFilterValue] = useState("");

    const [students, setStudents] = useState([{
        studentId: 1,
        studentName: 'Nguyen Van A',
        email: 'a@gmail.com',
        birthday: '2000-01-01',
        phoneNumber: '0122321421'
    }]);

    useEffect(() => {
        refreshStudentList();
    }, [filterValue]);

    async function refreshStudentList() {
        const response = await fetch("http://localhost:8080/students/all", {
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/login";
            return;
        }
        const data = await response.json();
        const sortedStudents = [...data].sort((a, b) =>
            a.studentName.localeCompare(b.studentName)
        );
        // filter part
        if (filterValue === "") {
            setStudents(sortedStudents);
        } else {
            const filteredStudents = sortedStudents.filter(value => value.studentName.includes(filterValue));
            setStudents(filteredStudents);
        }
    }

    async function handleSaveNewStudent() {
        if (newStudentName == '' || newEmail == '' || newBirthday == '' || newPhoneNumber == '') {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        const formData = new URLSearchParams();
        formData.append("studentName", newStudentName);
        formData.append("email", newEmail);
        formData.append("birthday", newBirthday);
        formData.append("phoneNumber", newPhoneNumber);
        await fetch('http://localhost:8080/students/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData.toString(),
        });

        refreshStudentList();
        resetNewStudent();
        setShowAddModal(false);
    }

    function handleCancelAddStudent() {
        resetNewStudent();
        setShowAddModal(false);
    }

    async function handleUpdateStudent() {
        const formData = new URLSearchParams();
        formData.append("studentId", editingStudent.studentId.toString());
        formData.append("studentName", editingStudent.studentName);
        formData.append("email", editingStudent.email);
        formData.append("birthday", editingStudent.birthday);
        formData.append("phoneNumber", editingStudent.phoneNumber);
        await fetch('http://localhost:8080/students/update', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData.toString(),
        });
        refreshStudentList();
        setShowEditModal(false);
    }

    function handleCancelEditStudent() {
        setShowEditModal(false);
    }

    function resetNewStudent() {
        setNewStudentName('');
        setNewEmail('');
        setNewBirthday('');
        setNewPhoneNumber('');
    }

    async function handleDeleteStudent() {
        const formData = new URLSearchParams();
        formData.append("id", deletedStudent.studentId.toString());
        await fetch('http://localhost:8080/students/delete', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData.toString(),
        });

        refreshStudentList();
        setShowConfirmDeleteModal(false);
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Student Management</h1>
                {/* Thanh tìm kiếm (optional) */}
                <div className="hidden md:block">
                    <div className="relative w-128">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-10 px-3 py-1 rounded bg-white text-black border-gray focus:outline-blue-500"
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                            />
                        </svg>
                    </div>
                </div>
            </div>


            {showAddModal ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
                        <h4> Student Name </h4> <input className="h-full w-full border border-green-200" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                        <h4> Email </h4> <input className="h-full w-full border border-green-200" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        <h4> Birthday </h4> <input type="date" className="h-full w-full border border-green-200" value={newBirthday} onChange={(e) => setNewBirthday(e.target.value)} />
                        <h4> Phone number </h4> <input className="h-full w-full border border-green-200" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} />
                        <div className="pt-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
                                onClick={handleSaveNewStudent}>
                                Save
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleCancelAddStudent}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div> : <></>
            }

            {showEditModal ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
                        <h4> Student Name </h4> <input className="h-full w-full border border-green-200" value={editingStudent.studentName} onChange={(e) => setEditingStudent({ ...editingStudent, studentName: e.target.value })} />
                        <h4> Email </h4> <input className="h-full w-full border border-green-200" value={editingStudent.email} onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} />
                        <h4> Birthday </h4> <input type="date" className="h-full w-full border border-green-200" value={editingStudent.birthday} onChange={(e) => setEditingStudent({ ...editingStudent, birthday: e.target.value })} />
                        <h4> Phone number </h4> <input className="h-full w-full border border-green-200" value={editingStudent.phoneNumber} onChange={(e) => setEditingStudent({ ...editingStudent, phoneNumber: e.target.value })} />
                        <div className="pt-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
                                onClick={handleUpdateStudent}>
                                Save
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleCancelEditStudent}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div> : <></>
            }

            {
                showConfirmDeleteModal &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
                        <p className="mb-6">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-red-600">{deletedStudent.studentName}</span>?
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
                                onClick={handleDeleteStudent}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            }

            <button className="bg-green-600 text-white px-4 py-2 mb-4 rounded hover:bg-green-700"
                onClick={() => setShowAddModal(true)}>
                Add Student
            </button>

            <table className="border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Student ID</th>
                        <th className="border border-gray-400 px-4 py-2">Name</th>
                        <th className="border border-gray-400 px-4 py-2">Email</th>
                        <th className="border border-gray-400 px-4 py-2">Birthday</th>
                        <th className="border border-gray-400 px-4 py-2">Phone Number</th>
                        <th className="border border-gray-400 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">{student.studentId}</td>
                            <td className="border border-gray-400 px-4 py-2">{student.studentName}</td>
                            <td className="border border-gray-400 px-4 py-2">{student.email}</td>
                            <td className="border border-gray-400 px-4 py-2">{student.birthday}</td>
                            <td className="border border-gray-400 px-4 py-2">{student.phoneNumber}</td>
                            <td className="border border-gray-400 px-4 py-2">
                                <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2" onClick={() => {
                                    setEditingStudent(student);
                                    setShowEditModal(true);
                                }}>
                                    <Edit size={18} />
                                </button>

                                <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={() => {
                                    setDeletedStudent(student);
                                    setShowConfirmDeleteModal(true)
                                }}>
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}