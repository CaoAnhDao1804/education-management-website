import { Edit, Trash2 } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { getAccessToken } from "../utils/AuthUtils";

export default function ClassesComponent() {
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] = useState(false);
    const [deletedClass, setDeletedClass] = useState({
        classId: 0,
        className: "",
    });

    const [classes, setClasses] = useState([{
        classId: 0,
        className: "",
        teacherId: "",
        teacherName: "",
        courseId: "",
        courseName: "",
        startDate: "",
        amountOfStudents: 0
    }]);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showAddClassModal, setShowAddModal] = useState(false);
    const [newClass, setNewClass] = useState({
        classId: 0,
        className: "",
        teacherId: "",
        teacherName: "",
        courseId: "",
        courseName: "",
        startDate: ""
    });
    const [newStudentId, setNewStudentId] = useState(0);
    const [isShowErrorMessageStudentId, setIsShowErrorMessageStudentId] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [teachers, setTeachers] = useState([{
        teacherId: 1,
        teacherName: 'Nguyen Van A',
        email: 'a@gmail.com',
        phoneNumber: '012321421'
    }]);
    const [courses, setCourses] = useState([{
        courseId: 1,
        description: 'Toan',
    }]);
    const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);
    const [filterClassValue, setFilterClassValue] = useState("");
    const [filterTeacherValue, setFilterTeacherValue] = useState("");
    const [filterCourseValue, setFilterCourseValue] = useState("");
    const [filterStartDateValue, setFilterStartDateValue] = useState("");

    useEffect(() => {
        refreshClassList();
        refreshTeacherList();
        refreshCourseList();
    }, []);

    async function refreshTeacherList() {
        const response = await fetch("http://localhost:8080/teachers/all", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`,
            }
        });

        if (response.status == 401 || response.status == 403) {
            window.location.href = "/login";
            return;
        }

        const data = await response.json();
        const sortedTeachers = [...data].sort((a, b) =>
            a.teacherName.localeCompare(b.teacherName)
        );
        setTeachers(sortedTeachers);
    }

    function refreshClassList() {
        fetch("http://localhost:8080/classes/allDetail", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                const sortedClasses = [...data].sort((a, b) =>
                    a.className.localeCompare(b.className)
                );
                setClasses(sortedClasses);
            });
    }

    function refreshCourseList() {
        fetch("http://localhost:8080/courses/all", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                const sortedCourses = [...data].sort((a, b) =>
                    a.description.localeCompare(b.description)
                );
                setCourses(sortedCourses);
            });
    }

    async function handleDeleteClass() {
        const formData = new URLSearchParams();
        formData.append("classId", deletedClass.classId.toString());
        await fetch('http://localhost:8080/classes/delete', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`,
            },
            body: formData.toString(),
        });

        refreshClassList();
        setIsShowConfirmDeleteModal(false);
    }

    async function handleSaveClass() {
        if (!newClass.className || newClass.className.trim() === "") {
            setIsShowErrorMessage(true);
            return;
        }

        if (!newClass.teacherId || newClass.teacherId.trim() === "") {
            setIsShowErrorMessage(true);
            return;
        }

        if (!newClass.courseId || newClass.courseId.trim() === "") {
            setIsShowErrorMessage(true);
            return;
        }

        if (!newClass.startDate || newClass.startDate.trim() === "") {
            setIsShowErrorMessage(true);
            return;
        }
        const formData = new URLSearchParams();
        formData.append("className", newClass.className);
        formData.append("teacherId", newClass.teacherId);
        formData.append("courseId", newClass.courseId);
        formData.append("startDate", newClass.startDate);
        await fetch('http://localhost:8080/classes/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`,
            },
            body: formData.toString(),
        });

        refreshClassList();
        setShowAddModal(false);
        setIsShowErrorMessage(false);
        setNewClass({
            classId: 0,
            className: "",
            teacherId: "",
            teacherName: "",
            courseId: "",
            courseName: "",
            startDate: ""
        });
    }

    function handleCancelSaveClass() {
        setShowAddModal(false);
        setIsShowErrorMessage(false);
    }

    async function handleAddNewStudentToClass() {
        if (newStudentId <= 0 || isNaN(newStudentId) || !Number.isInteger(newStudentId)) {
            setIsShowErrorMessageStudentId(true);
            return;
        } else {
            setIsShowErrorMessageStudentId(false);
        }
        const formData = new URLSearchParams();
        formData.append("classId", editingClass.classId.toString());
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
            refreshClassList();
            setShowAddStudentModal(false);
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

    async function handleUpdateClass() {
        if (!editingClass.className || editingClass.className.trim() === "") {
            setIsShowErrorMessage(true);
            return;
        }
        const formData = new URLSearchParams();
        formData.append("classId", editingClass.classId.toString());
        formData.append("className", editingClass.className);
        formData.append("teacherId", editingClass.teacherId);
        formData.append("courseId", editingClass.courseId);
        formData.append("startDate", editingClass.startDate);
        await fetch('http://localhost:8080/classes/update', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`,
            },
            body: formData.toString(),
        });

        refreshClassList();
        setShowEditModal(false);
        setIsShowErrorMessage(false);
    }

    function handleCancelEditClass() {
        setShowEditModal(false);
        setIsShowErrorMessage(false);
    }

    function handleAddNewTeacher(event: ChangeEvent<HTMLSelectElement>) {
        setNewClass({ ...newClass, teacherId: event.target.value });
    };

    function handleChangeCourseForNewClass(event: ChangeEvent<HTMLSelectElement>) {
        setNewClass({ ...newClass, courseId: event.target.value });
    }

    function handleChangeTeacher(event: ChangeEvent<HTMLSelectElement>) {
        setEditingClass({ ...editingClass, teacherId: event.target.value });
    };

    function handleChangeCourse(event: ChangeEvent<HTMLSelectElement>) {
        setEditingClass({ ...editingClass, courseId: event.target.value });
    }

    function handleSearch() {
        const formData = new URLSearchParams();
        formData.append("className", filterClassValue);
        formData.append("teacherName", filterTeacherValue);
        formData.append("courseName", filterCourseValue);
        formData.append("startDate", filterStartDateValue);
        // if (!filterStartDateValue || filterStartDateValue.trim() === "") {
        //     formData.append("startDate", "2025-10-22");
        // } else {
        //     formData.append("startDate", filterStartDateValue);
        // }

        fetch("http://localhost:8080/classes/allDetailBySearch", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`,
            },
            body: formData.toString(),
        })
            .then(res => res.json())
            .then(data => {
                const sortedClasses = [...data].sort((a, b) =>
                    a.className.localeCompare(b.className)
                );
                setClasses(sortedClasses);
            });
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Class Management</h1>
                <div className="flex">
                    {/* Class name input */}
                    <div className="relative w-50 mr-2">
                        <input
                            type="text"
                            placeholder="Search by class name..."
                            className="w-full h-10 px-3 py-1 rounded bg-white text-black border-gray focus:outline-blue-500"
                            onChange={(e) => setFilterClassValue(e.target.value)}
                        />
                    </div>

                    {/* Teacher name input */}
                    <div className="relative w-50 mr-2">
                        <input
                            type="text"
                            placeholder="Search by teacher name..."
                            className="w-full h-10 px-3 py-1 rounded bg-white text-black border-gray focus:outline-blue-500"
                            onChange={(e) => setFilterTeacherValue(e.target.value)}
                        />
                    </div>

                    {/* Course name input */}
                    <div className="relative w-50 mr-2">
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            className="w-full h-10 px-3 py-1 rounded bg-white text-black border-gray focus:outline-blue-500"
                            onChange={(e) => setFilterCourseValue(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center mr-2">
                        <h4>Start date: </h4>
                    </div>
                    <div className="relative w-50 mr-2">
                        <input type="date" className="h-full w-full border border-green-200" onChange={(e) => setFilterStartDateValue(e.target.value)} />
                    </div>

                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleSearch()}>
                        Tìm Kiếm
                    </button>
                </div>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={() => {
                setShowAddModal(true);
            }}>
                + Add New Class
            </button>

            <table className="border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Class name</th>
                        <th className="border border-gray-400 px-4 py-2">Teacher Name</th>
                        <th className="border border-gray-400 px-4 py-2">Course Name</th>
                        <th className="border border-gray-400 px-4 py-2">Start Date</th>
                        <th className="border border-gray-400 px-4 py-2">Amount of students</th>
                        <th className="border border-gray-400 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((lop) => (
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">{lop.className}</td>
                            <td className="border border-gray-400 px-4 py-2">{lop.teacherName}</td>
                            <td className="border border-gray-400 px-4 py-2">{lop.courseName}</td>
                            <td className="border border-gray-400 px-4 py-2">{lop.startDate}</td>
                            <td className="border border-gray-400 px-4 py-2">{lop.amountOfStudents}</td>
                            <td className="flex border border-gray-400 px-4 py-2 items-center align-center">
                                <button
                                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                                    onClick={() => {
                                        window.location.href = `/class-details?classId=${lop.classId}`;
                                    }}
                                >
                                    See details
                                </button>

                                <button
                                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-blue-700 mr-2"
                                    onClick={() => {
                                        setEditingClass(lop);
                                        setShowAddStudentModal(true);
                                    }}
                                >
                                    Add student
                                </button>

                                <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2" onClick={() => {
                                    setEditingClass(lop);
                                    setShowEditModal(true);
                                }}>
                                    <Edit size={20} />
                                </button>

                                <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={() => {
                                    setDeletedClass(lop);
                                    setIsShowConfirmDeleteModal(true);
                                }}>
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddClassModal ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Add new class</h2>
                        {isShowErrorMessage ? <h5 className="text-red-500">Please enter class name, choose teacher, choose course, choose start date before Save</h5> : <></>}
                        <h4> Class Name </h4> <input className="h-full w-full border border-green-200" value={newClass.className} onChange={(e) => setNewClass({ ...newClass, className: e.target.value })} />
                        <h4> Teacher </h4>
                        <select
                            id="teacher"
                            onChange={handleAddNewTeacher}
                            className="border rounded p-2">
                            <option>Please choose Teacher</option>
                            {teachers.map((giaovien) => (
                                <option value={giaovien.teacherId}>{giaovien.teacherName}</option>))
                            }
                        </select>
                        <h4> Course Name </h4>
                        <select
                            id="course"
                            onChange={handleChangeCourseForNewClass}
                            className="border rounded p-2">
                            <option>Please choose Course</option>
                            {courses.map((course) => (
                                <option value={course.courseId}>{course.description}</option>))
                            }
                        </select>
                        <h4> Start Date </h4> <input type="date" className="h-full w-full border border-green-200" value={newClass.startDate} onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })} />
                        <div className="pt-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
                                onClick={handleSaveClass}>
                                Save
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleCancelSaveClass}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div> : <></>
            }

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

            {showEditModal ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Class</h2>
                        {isShowErrorMessage ? <h5 className="text-red-500">Please enter class name</h5> : <></>}
                        <h4> Class Name </h4> <input className="h-full w-full border border-green-200" value={editingClass.className} onChange={(e) => setEditingClass({ ...editingClass, className: e.target.value })} />
                        <h4> Teacher </h4>
                        <select
                            id="teacher"
                            value={editingClass.teacherId}
                            onChange={handleChangeTeacher}
                            className="border rounded p-2">
                            {teachers.map((giaovien) => (
                                <option value={giaovien.teacherId}>{giaovien.teacherName}</option>))
                            }
                        </select>
                        <h4> Course Name </h4>
                        <select
                            id="course"
                            value={editingClass.courseId}
                            onChange={handleChangeCourse}
                            className="border rounded p-2">
                            {courses.map((course) => (
                                <option value={course.courseId}>{course.description}</option>))
                            }
                        </select>
                        <h4> Start Date </h4> <input type="date" className="h-full w-full border border-green-200" value={editingClass.startDate} onChange={(e) => setEditingClass({ ...editingClass, startDate: e.target.value })} />
                        <div className="pt-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
                                onClick={handleUpdateClass}>
                                Save
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleCancelEditClass}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div> : <></>
            }

            {
                isShowConfirmDeleteModal &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
                        <p className="mb-6">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-red-600">{deletedClass.className}</span>?
                            This action cannot be undone.
                        </p>
                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsShowConfirmDeleteModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteClass}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}