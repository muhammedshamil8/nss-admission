import { useState } from "react";
import { Search, LeafyGreen, Loader } from 'lucide-react'
import Airtable from "airtable";
import backendUrl from "@/const/backendUrl";
import { useNavigate } from "react-router-dom";

const base = new Airtable({ apiKey: `${backendUrl.secretKey}` }).base(
  `${backendUrl.airtableBase}`
);

function index() {
  const [searchText, setSearchText] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState(true);
  const navigate = useNavigate();
  const getStudent = async (search) => {
    if (searchText === "") return;
    clearStudentData();
    setInitial(false);
    // setAlert(false);
    // setSubmitted(false);
    setLoading(true);
    base("Students")
      .select({
        view: "Data",
        filterByFormula: `({CHEST_NO} = '${search}')`,
      })
      .eachPage(
        (record, fetchNextPage) => {
          if (record.length === 0) {
            // setAlert(true);
            setLoading(false);
            return;
          }
          console.log(record[0].fields);
          setStudentData(record[0].fields);
          setStudentID(record[0].id);
          // fetchNextPage();
          setLoading(false);
        },
        function done(err) {
          if (err) {
            console.error(err);
            setLoading(false);
            return;
          }
        }
      );
  };

  const clearStudentData = () => {
    setSearchText("");
    setStudentData({});
    // setSubmitted(true);
  };

  const handleNavigate = (path) => {
    navigate(path);
  }

  return (
    <div className='w-full p-2'>
      <div className='flex items-center justify-center w-full mx-auto'>
        <div className='mx-auto p-[3px] flex items-center justify-center border border-gray-800 rounded-full w-fit overflow-hidden flex-grow max-w-[600px] '>
          <input type='search' placeholder='Search Chest Number' className='outline-none ring-0 border-none w-full p-2 px-4 '
            value={searchText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                getStudent(searchText);
              }
            }}
            onChange={(e) => {
              const uppercasedValue = e.target.value.toUpperCase();
              setSearchText(uppercasedValue);
            }} />
          <button className='primary-bg hover:bg-[#241E59]/70 transition-all ease-in-out text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer' onClick={() => {
            getStudent(searchText);
          }}>
            <Search size={16} /> Search
          </button>
        </div>

      </div>
      {loading ? (
        <div className='flex items-center justify-center w-full mt-8'>
          <h1 className='text-2xl font-semibold primary-text flex gap-2'>Loading...<Loader className="animate-spin" /></h1>
        </div>
      ) : (
        Object.keys(studentData).length > 0 && (
          <section className='mt-8'>

            <div className="h-28">
              <div className='flex w-full items-center justify-center gap-4 secondary-bg p-4 absolute left-0 right-0 '>
                <div className='primary-bg  p-3 !text-white text-xl sm:text-2xl font-bold uppercase rounded-2xl'>{studentData.CHEST_NO}</div>
                <div className='flex flex-col items-center justify-center'>
                  <h1 className='text-xl sm:text-3xl font-semibold'>{studentData.NAME}</h1>
                  <p className='-mt-0.5 text-sm sm:text-md'>{studentData.DEPARTMENT}</p>
                </div>
              </div>

            </div>
            <div className='flex flex-col justify-center w-full items-center mt-10'>
              <h1 className='primary-text underline underline-offset-2 text-xl sm:text-3xl font-semibold mb-6'>Interview</h1>
              <div className='w-full'>
                <div className='primary-bg text-white font-bold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4'>
                  <h1 className='col-span-2 text-left' >Program</h1>
                  <h1 className='col-span-1 text-center'>Grade</h1>
                  <h1 className='col-span-2 text-center'>Opinion</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Communication Skill</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.COMMUNICATION_GRADE ? studentData.COMMUNICATION_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.COMMUNICATION_GRADE ? studentData.COMMUNICATION_GRADE : 'None'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Dedication</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.DEDICATION_GRADE ? studentData.DEDICATION_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.DEDICATION_GRADE ? studentData.DEDICATION_GRADE : 'None'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Skill & Achievements</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.SKILL_ACHIEVEMENT_GRADE ? studentData.SKILL_ACHIEVEMENT_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.SKILL_ACHIEVEMENTS ? studentData.SKILL_ACHIEVEMENTS : 'None'}</h1>
                </div>

                <div className='bg-[#241E59]/40 text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mt-4 mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left' >Overall</h1>
                  <h1 className='col-span-1 text-center'>{studentData.INTERVIEW_OVERALL_GRADE ? studentData.INTERVIEW_OVERALL_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center'>{studentData.DEDICATION_GRADE ? studentData.DEDICATION_GRADE : 'None'}</h1>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center w-full items-center mt-10'>
              <h1 className='primary-text underline underline-offset-2 text-xl sm:text-3xl font-semibold mb-6'>Selection</h1>
              <div className='w-full'>
                <div className='primary-bg text-white font-bold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4'>
                  <h1 className='col-span-2 text-left' >Program</h1>
                  <h1 className='col-span-1 text-center'>Grade</h1>
                  <h1 className='col-span-2 text-center'>Opinion</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Debate</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.DEBATE_GRADE ? studentData.DEBATE_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.DEBATE_OPINION ? studentData.DEBATE_OPINION : 'None'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Group Activity</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.GROUP_GRADE ? studentData.GROUP_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.GROUP_OPINION ? studentData.GROUP_OPINION : 'None'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Stage Group Activity</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.STAGE_GROUP_GRADE ? studentData.STAGE_GROUP_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.STAGE_GROUP_OPINION ? studentData.STAGE_GROUP_OPINION : 'None'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Stage Performance</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.STAGE_GRADE ? studentData.STAGE_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.STAGE_OPINION ? studentData.STAGE_OPINION : 'None'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Bonus Points</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.BONUS_GRADE ? studentData.BONUS_GRADE : 'N/A'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.BONUS_OPINION ? studentData.BONUS_OPINION : 'None'}</h1>
                </div>

                <div className='bg-[#241E59]/40 text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mt-4 mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Overall</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.OVERALL_GRADE ? studentData.OVERALL_GRADE : 'Nill'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{studentData.OVERALL_OPINION ? studentData.OVERALL_OPINION : 'None'}</h1>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center w-full items-center mt-10'>
              <h1 className='primary-text underline underline-offset-2 text-xl sm:text-3xl font-semibold mb-6'>Main Point</h1>
              <div className='w-full'>
                <div className='primary-bg text-white font-bold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4'>
                  <h1 className='col-span-2 text-left' >Program</h1>
                  <h1 className='col-span-1 text-center'>Grade</h1>
                  <h1 className='col-span-2 text-center'>Opinion</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Attendance </h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.SELECTION_CAMP_ATTENDED ? 'Present' : 'Absent'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{'Selection camp'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Attendance</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.ORIENTATION_ATTENDED ? 'Present' : 'Absent'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{'Orientation Class'}</h1>
                </div>
                <div className='bg-white text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Fund Collected</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.FUND_COLLECTED ? studentData.FUND_COLLECTED : 'N/A'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{'Amount'}</h1>
                </div>

                <div className='bg-[#241E59]/40 text-black font-semibold w-full grid grid-cols-5 p-4 px-8 rounded-2xl mt-4 mb-4 border border-gray-400'>
                  <h1 className='col-span-2 text-left text-sm sm:text-md' >Selection Result</h1>
                  <h1 className='col-span-1 text-center text-sm sm:text-md'>{studentData.SELECTION_RESULT ? studentData.SELECTION_RESULT : 'not given'}</h1>
                  <h1 className='col-span-2 text-center text-sm sm:text-md'>{'After interview opinion'}</h1>
                </div>
              </div>
            </div>
          </section>
        )
      )}

      {!loading && initial && (
        <div className="flex items-center justify-center w-full mt-14">
          <div className="text-center">
            <h1 className="text-2xl font-semibold primary-text mb-2 mx-auto flex items-center justify-center"><LeafyGreen size={36} /></h1>
            <p className="text-lg text-gray-600">Everything is set! You can start your search.</p>
          </div>
        </div>
      )}

      {!loading && !initial && Object.keys(studentData).length === 0 && (
        <div className="flex items-center justify-center w-full mt-8">
          <div className="text-center">
            <h1 className="text-xl  sm:text-2xl font-semibold primary-text mb-2">No Data Found</h1>
            <p className="text-md sm:text-lg text-gray-600">Please check the Chest No and try again.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default index  
