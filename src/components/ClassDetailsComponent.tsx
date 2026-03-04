import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/AuthUtils";
import { Trash2 } from "lucide-react";

export default function ClassDetailsComponent() {
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [newStudentId, setNewStudentId] = useState(0);
    const [isShowErrorMessageStudentId, setIsShowErrorMessageStudentId] = useState(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const classId = params.get("classId");

    const [classDetail, setClassDetail] = useState({
        classId: 0,
        className: "",
        teacherId: "",
        courseId: "",
        startDate: "",
    });

    const [students, setStudents] = useState([{
        studentId: 1,
        studentName: "",
        email: "",
        birthday: "",
        phoneNumber: ""
    }]);

    useEffect(() => {
        loadListStudentsOfClass();
        loadClassDetails();
    }, []);

    async function loadClassDetails() {
        const formData = new URLSearchParams();
        if (!classId) {
            alert("No class ID provided");
            return;
        }
        formData.append("classId", classId);

        const response = await fetch(`http://localhost:8080/classes/class-detail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData,
        });
        const details = await response.json();
        setClassDetail({
            classId: details.classId,
            className: details.className,
            teacherId: details.teacherId,
            courseId: details.courseId,
            startDate: details.startDate,
        });
    }

    async function loadListStudentsOfClass() {
        const formData = new URLSearchParams();

        if (!classId) {
            alert("No class ID provided");
            return;
        }
        formData.append("classId", classId);

        const response = await fetch(`http://localhost:8080/classes/get-list-students-of-class`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData,
        });

        if (!response.ok) {
            console.error("Error status:", response.status);
            console.error("Error text:", await response.text());
            return;
        }

        const text = await response.text();
        console.log("Raw response:", text);

        if (!text) {
            console.error("Empty response from server!");
            return;
        }

        const json = JSON.parse(text);
        setStudents(json);
    }

    function showStudentsTable() {
        return students.length > 0;
    }

    async function handleAddNewStudentToClass() {
        if (newStudentId <= 0 || isNaN(newStudentId) || !Number.isInteger(newStudentId)) {
            setIsShowErrorMessageStudentId(true);
            return;
        } else {
            setIsShowErrorMessageStudentId(false);
        }
        const formData = new URLSearchParams();
        formData.append("classId", classId || "");
        formData.append("studentId", newStudentId.toString());
        const response = await fetch('http://localhost:8080/classes/add-student-to-class', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`,
            },
            body: formData.toString(),
        });

        if (response.ok) {
            alert("Thêm học sinh vào lớp thành công!");
            setShowAddStudentModal(false);
            loadListStudentsOfClass();
        } else if (response.status === 409) {
			alert("Học sinh đã tồn tại trong lớp");
			setShowAddStudentModal(false);
		} else {
            alert("Thêm học sinh vào lớp thất bại!");
        }
    }

    function handleCancelAddNewStudent() {
        setShowAddStudentModal(false);
        setIsShowErrorMessageStudentId(false);
    }

    async function handleDeleteStudent(studentId: number) {
        const formData = new URLSearchParams();
        formData.append("classId", classId || "");
        formData.append("studentId", studentId.toString());
        const response = await fetch(`http://localhost:8080/classes/remove-student-from-class`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData,
        });
        if (response.ok) {
            alert("Student removed successfully!");
            loadListStudentsOfClass();
        } else {
            alert("Failed to remove student.");
        }
    }

    return (
        <div>
            <h1>Class Details</h1>
            <div>
                <p><strong>Class ID:</strong> {classDetail.classId}</p>
                <p><strong>Class Name:</strong> {classDetail.className}</p>
                <p><strong>Start Date:</strong> {classDetail.startDate}</p>
            </div>

            {showStudentsTable() ?
                <div>
                    <h1>List students of class</h1>
                    <button
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-blue-700 mr-2"
                        onClick={() => {
                            setShowAddStudentModal(true);
                        }}
                    >
                        Add student
                    </button>
                    <table className="border-collapse border border-gray-400 w-full">
                        <thead>
                            <tr>
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
                                    <td className="border border-gray-400 px-4 py-2">{student.studentName}</td>
                                    <td className="border border-gray-400 px-4 py-2">{student.email}</td>
                                    <td className="border border-gray-400 px-4 py-2">{student.birthday}</td>
                                    <td className="border border-gray-400 px-4 py-2">{student.phoneNumber}</td>
                                    <td className="border border-gray-400 px-4 py-2">
                                        <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={() => {
                                            handleDeleteStudent(student.studentId);
                                        }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                : <div>No students found for this class.</div>}

            {showAddStudentModal ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Add new student</h2>
                        {isShowErrorMessageStudentId && (
                            <h5 className="text-red-500">Please enter valid student id</h5>
                        )}
                        <h4> Student Id </h4> <input className="h-full w-full border border-green-200" onChange={(e) => setNewStudentId(Number(e.target.value))} />
                        <div className="pt-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
                                onClick={handleAddNewStudentToClass}>
                                Save
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleCancelAddNewStudent}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div> : <></>
            }
        </div>
    );

}