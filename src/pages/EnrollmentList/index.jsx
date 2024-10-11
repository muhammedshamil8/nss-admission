import React, { useEffect, useState } from 'react';
import Logo from '@/assets/icons/nss_logo.png';

function EnrollmentList() {
  const [searchText, setSearchText] = useState('');
  const [unit, setUnit] = useState('102');
  const [filteredData, setFilteredData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle Search
  const handleSearch = () => {
    setLoading(true);
    const filtered = studentData.filter(student =>
      student.name.toLowerCase().includes(searchText.toLowerCase()) && student.unit === parseInt(unit) // Filter by unit
    );

    setFilteredData(filtered);
    setLoading(false);
  };

  useEffect(() => {
    const fetchStudents = () => {
      try {
        const students = [
          { name: "John Doe", department: "Computer Science", selected: true, unit: 102 },
          { name: "Jane Smith", department: "Mathematics", selected: false, unit: 115 },
          { name: "Michael Johnson", department: "Physics", selected: true, unit: 102 },
          { name: "Emily Davis", department: "Biology", selected: false, unit: 115 },
          { name: "David Wilson", department: "Chemistry", selected: true, unit: 102 },
          { name: "Sarah Taylor", department: "Mechanical Engineering", selected: false, unit: 115 },
          { name: "Daniel Anderson", department: "Electrical Engineering", selected: true, unit: 102 },
          { name: "Sophia Martinez", department: "Civil Engineering", selected: false, unit: 115 },
          { name: "James Brown", department: "Information Technology", selected: true, unit: 102 },
          { name: "Olivia Thomas", department: "Biomedical Engineering", selected: false, unit: 115 }
        ];
        setStudentData(students);
        setFilteredData(students.filter(student => student.unit === parseInt(unit)));

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, []);

  // Update filtered data when the unit changes
  useEffect(() => {
    const filtered = studentData.filter(student => student.unit === parseInt(unit)); // Filter by unit
    setFilteredData(filtered);
  }, [unit, studentData]);

  return (
    <div className='w-full p-2'>
      <div className='flex items-center justify-center w-full mx-auto flex-col'>
        {/* Toggle between Chest No and Admission No search */}
        <div className='flex items-center justify-center gap-4 mt-14 mb-12 sm:mb-20'>
          <img src={Logo} className='w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full' alt='NSS Logo' />
          <div className='flex flex-col items-center'>
            <h1 className='text-xl sm:text-2xl font-bold primary-text'>NSS ADMISSION</h1>
            <h3 className='text-md sm:text-lg font-normal primary-text -mt-1'>SCORE SYSTEM</h3>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4  bg-gray-200 w-fit rounded-full mb-10">
          <div className={`flex items-center justify-center w-[150px] sm:w-[220px] h-12 rounded-full cursor-pointer ${unit === '102' ? 'primary-bg text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setUnit('102')}>
            UNIT 102
          </div>
          <div className={`flex items-center justify-center w-[150px] sm:w-[220px] h-12 rounded-full cursor-pointer  ${unit === '115' ? 'primary-bg text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setUnit('115')}>
            UNIT 115
          </div>
        </div>

        {/* Search Input */}
        <div className='mx-auto p-[3px] flex items-center justify-center border border-gray-800 rounded-full w-fit overflow-hidden flex-grow max-w-[600px]'>
          <input type='search' placeholder={`Search your name`} className='outline-none ring-0 border-none w-full p-2 px-4'
            value={searchText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onChange={(e) => setSearchText(e.target.value)} />
          <button className='primary-bg hover:bg-[#241E59]/70 transition-all ease-in-out text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer' onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className='w-full max-w-[1300px] mx-auto my-10'>
        <div className='primary-bg text-white font-bold w-full grid grid-cols-5 md:grid-cols-6 p-4 md:px-8 rounded-2xl mb-4 select-none'>
          <h1 className='col-span-1 text-left'>Roll No</h1>
          <h1 className='col-span-2 text-left' >Name</h1>
          <h1 className='col-span-1 text-left'>Department</h1>
          <h1 className='col-span-1 text-center text-sm sm:text-md hidden md:block'>Status</h1>
          <h1 className='col-span-1 text-center'>Unit</h1>
        </div>

        {loading ? (
          <div className='bg-[#241E59]/40 text-black font-semibold w-full grid grid-cols-5 p-4 md:px-8 rounded-2xl mt-4 mb-4 border border-gray-400'>
            <h1 className='col-span-5 text-center'>
              Loading ...
            </h1>
          </div>
        ) : (
          filteredData.length !== 0 && (
            <>
              {filteredData.map((student, index) => (
                <div key={index} className='bg-white text-black font-semibold w-full grid grid-cols-5 md:grid-cols-6 p-4 md:px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-1 text-left text-sm sm:text-md'>{index}</h1>
                  <h1 className='col-span-2 text-left text-sm sm:text-md'>{student.name}</h1>
                  <h1 className='col-span-1 text-left text-sm sm:text-md'>{student.department}</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md hidden md:block'>
                    {student.selected ? (
                      <span className="bg-green-500 text-white px-2 md:px-4 py-1 rounded-lg">Passed</span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 md:px-4 py-1 rounded-lg">Failed</span>
                    )}
                  </h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{student.unit}</h1>
                </div>
              ))}
            </>
          )
        )}
        {!loading && filteredData.length === 0 && (
          <div className='bg-[#241E59]/40 text-black font-semibold w-full grid grid-cols-5 p-4 md:px-8 rounded-2xl mt-4 mb-4 border border-gray-400'>
            <h1 className='col-span-5 text-center'>
              No Student Found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrollmentList;
