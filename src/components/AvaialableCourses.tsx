import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/AuthUtils";

export default function AvailableCourses() {
    const [courses, setCourses] = useState([{
        courseId: 1,
        description: "Introduction to Programming",
        duration: 4,
        details: "Information about the course"
    }]);

    useEffect(() => {
        refreshCourseList();
    }, []); //dependency object

    async function refreshCourseList() {
        const response = await fetch("http://localhost:8080/courses/all", {
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/login";
            return;
        }
        const data = await response.json();
        // sort part
        const sortedCourses = [...data].sort((a, b) =>
            a.description.localeCompare(b.description)
        );
        // filter part
        setCourses(sortedCourses);
    }

    return (
        <>
            <div>Available Courses</div>

            <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
                        <h2 className="text-lg font-semibold">{course.description}</h2>

                        <p className="text-gray-600 mt-1">
                            Thời gian: <span className="font-medium">{course.duration} tháng</span>
                        </p>

                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => {
                                window.location.href = `/course-details?courseId=${course.courseId}`;
                            }}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}