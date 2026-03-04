import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/AuthUtils";

export default function CourseDetails() {
    const [course, setCourse] = useState({
        courseId: 0,
        description: "",
        duration: 0,
        details: ""
    });

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    let details = {
        courseId: 0,
        description: "",
        duration: 0,
        details: ""
    };
    const courseId = params.get("courseId");

    useEffect(() => {
        loadCourseDetails();
    }, []);

    async function loadCourseDetails() {
        const formData = new URLSearchParams();

        if (!courseId) {
            alert("No course ID provided");
            return;
        }

        formData.append("id", courseId);

        const response = await fetch(`http://localhost:8080/courses/course-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${getAccessToken()}`
            },
            body: formData,
        });

        details = await response.json();
        setCourse({
            courseId: details.courseId,
            description: details.description,
            duration: details.duration,
            details: details.details
        });
        console.log(details);
    }

    return (
        <>
            <div className="flex items-center mb-6">
                <div>
                    <button
                        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        Back
                    </button>
                </div>

                <div className="w-full text-center font-bold text-xl mb-4">
                    <div>Course Details</div>
                </div>
            </div>

            <div className="flex">
                <label className="font-bold">Description:</label>
                <div>{course.description}</div>
            </div>

            <div className="flex">
                <label className="font-bold">Duration: </label>
                <div>{course.duration} months</div>
            </div>

            <div>
                <div className="font-bold">Details:</div>
                <div className="p-4 border border-gray-300 rounded-lg mt-2" style={{ whiteSpace: "pre-line" }}>
                    {course.details}
                </div>
            </div>
        </>
    );
}