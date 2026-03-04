import { useEffect, useState } from 'react';
import TeacherCard from './TeacherCard';


export default function TeacherComponent() {

	const [showAddModal, setShowAddModal] = useState(false);
	const [newTeacherName, setNewTeacherName] = useState("");
	const [newTeacherEmail, setNewTeacherEmail] = useState("");
	const [newTeacherPhoneNumber, setNewTeacherPhoneNumber] = useState("");
	const [hasError, setHasError] = useState(false);
	const [filterValue, setFilterValue] = useState("");

	const [teachers, setTeachers] = useState([{
		teacherId: 1,
		teacherName: 'Nguyen Van A',
		email: 'a@gmail.com',
		phoneNumber: '012321421'
	}]);

	useEffect(() => {
		refreshTeacherList();
	}, [filterValue]);

	function handleSaveNewTeacher() {
		if (newTeacherName == '' || newTeacherEmail == '' || newTeacherPhoneNumber == '') {
			setHasError(true);
			return;
		}
		const formData = new URLSearchParams();
		formData.append("teacherName", newTeacherName);
		formData.append("email", newTeacherEmail);
		formData.append("phoneNumber", newTeacherPhoneNumber);

		const response = fetch("http://localhost:8080/teachers/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData.toString(),
		});
		response.then(() => {
			refreshTeacherList();
			setShowAddModal(false);
			setNewTeacherName("");
			setNewTeacherEmail("");
			setNewTeacherPhoneNumber("");
			setHasError(false);
		})
			.catch(error => console.error("Error:", error));
	}

	function handleCancelAddTeacher() {
		setShowAddModal(false);
		setNewTeacherName("");
		setHasError(false);
	}

	function handleOnUpdatedTeacher() {
		refreshTeacherList();
	}

	async function refreshTeacherList() {
		const token = localStorage.getItem("accessToken");
		const response = await fetch("http://localhost:8080/teachers/all", {
			headers: {
				"Authorization": `Bearer ${token}`
			}
		});

		if (response.status === 401 || response.status === 403) {
      	console.warn("Access token expired — trying to refresh...");
		const refreshToken = localStorage.getItem("refreshToken");
      	if (!refreshToken) {
        	console.error("No refresh token found — please login again");
        	handleLogout();
        return;
      	}

      	// Gọi API refresh token
      	const refreshResponse = await fetch(`http://localhost:8080/auth/refresh?refreshToken=${refreshToken}`, {
        method: "POST",
      	});

      	if (!refreshResponse.ok) {
        	console.error("Refresh token invalid or expired — logging out");
        	handleLogout();
        	return;
      	}

      	// Nhận token mới
      	const refreshData = await refreshResponse.json();
      	localStorage.setItem("accessToken", refreshData.accessToken);
		// Thử lại việc lấy danh sách giáo viên với token mới
		await refreshTeacherList();
		} else {
			const data = await response.json()
				const sortedTeachers = [...data].sort((a, b) =>
					a.teacherName.localeCompare(b.teacherName)
				);
				// filter part
				if (filterValue === "") {
					setTeachers(sortedTeachers);
				} else {
					const filteredTeachers = sortedTeachers.filter(value => value.teacherName.includes(filterValue));
					setTeachers(filteredTeachers);
				}
			}
	}
	
	function handleLogout() {
  		localStorage.removeItem("accessToken");
  		localStorage.removeItem("refreshToken");
  		window.location.href = "/login";
	}

	return (
		<div className="bg-white h-full p-6 rounded-lg shadow">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
				{/* Thanh tìm kiếm (optional) */}
				<div>
					<div className="relative w-128">
						<input
							type="text"
							placeholder="Search by teacher name..."
							className="w-full h-10 px-3 py-1 rounded text-black border-blue outline-blue-500"
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
				<button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
					onClick={() => setShowAddModal(true)}>
					Add Teacher
				</button>
			</div>

			{showAddModal ?
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg w-96 p-6">
						<h2 className="text-xl font-bold mb-4">Add New Teacher</h2>
						{hasError ? <h3 className='text-red-500'>Please enter all field before save modal!</h3> : <></>}
						<h4> Teacher Name:</h4> <input className="h-full w-full border border-green-200" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} />
						<h4> Email:</h4> <input className="h-full w-full border border-green-200" value={newTeacherEmail} onChange={(e) => setNewTeacherEmail(e.target.value)} />
						<h4> Phone Number:</h4> <input className="h-full w-full border border-green-200" value={newTeacherPhoneNumber} onChange={(e) => setNewTeacherPhoneNumber(e.target.value)} />
						<div className="pt-2">
							<button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  mr-2"
								onClick={handleSaveNewTeacher}>
								Save
							</button>
							<button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
								onClick={handleCancelAddTeacher}>
								Cancel
							</button>
						</div>
					</div>
				</div> : <></>
			}

			<div className="grid grid-cols-5 gap-4">
				{teachers.map((teacher) => (
					<TeacherCard key={teacher.teacherId} teacherId={teacher.teacherId} name={teacher.teacherName} email={teacher.email} phoneNumber={teacher.phoneNumber}
						onUpdatedTeacher={handleOnUpdatedTeacher} />
				))}
			</div>
		</div>
	);

}