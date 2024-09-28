import nsslogo from "@/assets/icons/nss_logo.png";
import {
  Button, Input, Card, CardBody, Typography, Textarea, Select, Option, Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Airtable from "airtable";
import backendUrl from "@/const/backendUrl";
import { useState } from "react";
import { Search, ChefHat, Loader } from 'lucide-react'

const base = new Airtable({ apiKey: `${backendUrl.secretKey}` }).base(
  `${backendUrl.airtableBase}`
);

const gradePoints = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  'N/A': 0
};

const pointToGrade = {
  10: 'O',
  9: 'A+',
  8: 'A',
  7: 'B+',
  6: 'B',
  5: 'C',
  0: 'N/A'
};

function App() {
  const [searchText, setSearchText] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [initial, setInitial] = useState(true);
  const [open, setOpen] = useState(false);

  // Score states
  const [grades, setGrades] = useState({
    COMMUNICATION: 'N/A',
    DEDICATION: 'N/A',
    SKILL_ACHIEVEMENT: 'N/A',
    SKILL_ACHIEVEMENT_TEXT: '',
    INTERVIEW_OVERALL_OPINION: '',
    INTERVIEW_OVERALL_GRADE: 'N/A',
    DEBATE_SCORE: 'N/A',
    DEBATE_OPINION: '',
    GROUP_SCORE: 'N/A',
    GROUP_OPINION: '',
    STAGE_SCORE: 'N/A',
    STAGE_OPINION: '',
    OVERALL_OPINION: '',
    OVERALL_GRADE: ''
  });

  const getStudent = async (search) => {
    if (searchText === "") return;
    setInitial(false);
    clearStudentData();
    setAlert(false);
    setSubmitted(false);
    setLoading(true);
    base("Students")
      .select({
        view: "Data",
        filterByFormula: `({CHEST_NO} = '${search}')`,
      })
      .eachPage(
        (record, fetchNextPage) => {
          if (record.length === 0) {
            setAlert(true);
            setLoading(false);
            return;
          }
          setStudentData(record[0].fields);
          setGrades({
            COMMUNICATION: record[0].fields.COMMUNICATION_GRADE || 'N/A',
            DEDICATION: record[0].fields.DEDICATION_GRADE || 'N/A',
            SKILL_ACHIEVEMENT: record[0].fields.SKILL_ACHIEVEMENT_GRADE || 'N/A',
            SKILL_ACHIEVEMENT_TEXT: record[0].fields.SKILL_ACHIEVEMENT_TEXT || '',
            INTERVIEW_OVERALL_OPINION: record[0].fields.INTERVIEW_OVERALL_OPINION || '',
            INTERVIEW_OVERALL_GRADE: record[0].fields.INTERVIEW_OVERALL_GRADE || 'N/A',
            DEBATE_SCORE: record[0].fields.DEBATE_GRADE || 'N/A',
            DEBATE_OPINION: record[0].fields.DEBATE_OPINION || '',
            GROUP_SCORE: record[0].fields.GROUP_GRADE || 'N/A',
            GROUP_OPINION: record[0].fields.GROUP_OPINION || '',
            STAGE_SCORE: record[0].fields.STAGE_GRADE || 'N/A',
            STAGE_OPINION: record[0].fields.STAGE_OPINION || '',
            OVERALL_GRADE: record[0].fields.OVERALL_GRADE || '',
            OVERALL_OPINION: record[0].fields.OVERALL_OPINION || ''
          });
          setStudentID(record[0].id);
          fetchNextPage();
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
    setGrades({
      COMMUNICATION: 'N/A',
      DEDICATION: 'N/A',
      SKILL_ACHIEVEMENT: 'N/A',
      SKILL_ACHIEVEMENT_TEXT: '',
      INTERVIEW_OVERALL_OPINION: '',
      INTERVIEW_OVERALL_GRADE: 'N/A',
      DEBATE_SCORE: 'N/A',
      DEBATE_OPINION: '',
      GROUP_SCORE: 'N/A',
      GROUP_OPINION: '',
      STAGE_SCORE: 'N/A',
      STAGE_OPINION: '',
      OVERALL_GRADE: ''
    });
    setSubmitted(true);
  };

  const submitScores = async () => {
    base("Students").update(
      `${studentID}`,
      {
        COMMUNICATION_GRADE: grades.COMMUNICATION,
        DEDICATION_GRADE: grades.DEDICATION,
        SKILL_ACHIEVEMENT_GRADE: grades.SKILL_ACHIEVEMENT,
        SKILL_ACHIEVEMENTS: grades.SKILL_ACHIEVEMENT_TEXT,
        INTERVIEW_OVERALL_OPINION: grades.INTERVIEW_OVERALL_OPINION,
        INTERVIEW_OVERALL_GRADE: grades.INTERVIEW_OVERALL_GRADE,
        DEBATE_GRADE: grades.DEBATE_SCORE,
        DEBATE_OPINION: grades.DEBATE_OPINION,
        GROUP_GRADE: grades.GROUP_SCORE,
        GROUP_OPINION: grades.GROUP_OPINION,
        STAGE_GRADE: grades.STAGE_SCORE,
        STAGE_OPINION: grades.STAGE_OPINION,
        OVERALL_OPINION: grades.OVERALL_OPINION,
        OVERALL_GRADE: grades.OVERALL_GRADE,
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        } else {
          handleOpen();
          setInitial(true);
          clearStudentData();
        }
      }
    );
  };

  const handleGradeChange = (section, value) => {
    const updatedGrades = {
      ...grades,
      [section]: value
    };

    // Calculate INTERVIEW_OVERALL_GRADE
    const communicationGrade = gradePoints[updatedGrades.COMMUNICATION] || 0;
    const dedicationGrade = gradePoints[updatedGrades.DEDICATION] || 0;
    const skillAchievementGrade = gradePoints[updatedGrades.SKILL_ACHIEVEMENT] || 0;

    const interviewOverallGrade = (communicationGrade + dedicationGrade + skillAchievementGrade) / 3;
    updatedGrades.INTERVIEW_OVERALL_GRADE = pointToGrade[Math.round(interviewOverallGrade)] || '';

    // Calculate OVERALL_GRADE
    const debateScore = gradePoints[updatedGrades.DEBATE_SCORE] || 0;
    const groupScore = gradePoints[updatedGrades.GROUP_SCORE] || 0;
    const stageScore = gradePoints[updatedGrades.STAGE_SCORE] || 0;


    const overallGrade = (debateScore + groupScore + stageScore) / 3;
    updatedGrades.OVERALL_GRADE = pointToGrade[Math.round(overallGrade)] || '';

    setGrades(updatedGrades);
  };

  const handleOpen = () => setOpen(!open);
  return (
    <div className="flex flex-col items-center px-4 p-2">
      <div className='flex items-center justify-center w-full mx-auto'>
        <div className='mx-auto p-[3px] flex items-center justify-center border border-gray-800 rounded-full w-fit overflow-hidden flex-grow max-w-[600px] '>
          <input type='search' placeholder='Search Chest Number' className='outline-none ring-0 border-none w-full p-2 px-4 '
            onChange={(e) => setSearchText(e.target.value.toUpperCase())}
            value={searchText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                getStudent(searchText);
              }
            }}
          />
          <button className='primary-bg hover:bg-[#241E59]/70 transition-all ease-in-out text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer' onClick={() => getStudent(searchText)}>
            <Search size={16} /> Search
          </button>
        </div>
      </div>
      {!loading && studentData && Object.keys(studentData).length > 0 && (
        <Card className="mt-6 w-full">
          <CardBody>

            <div className='flex w-full items-center justify-center gap-4 secondary-bg p-4 mb-4 rounded-md'>
              <div className='primary-bg  p-3 !text-white text-xl sm:text-3xl font-bold uppercase rounded-2xl'>{studentData.CHEST_NO}</div>
              <div className='flex flex-col items-center justify-center'>
                <h1 className='text-xl sm:text-3xl font-semibold text-black'>{studentData.NAME}</h1>
                <p className='-mt-0.5 text-sm sm:text-md text-black'>{studentData.DEPARTMENT}</p>
              </div>
            </div>


            <Typography variant="h5" className="mb-3" color="blue-gray">
              Interview
            </Typography>
            <div className="flex gap-2 flex-col mb-4 space-y-3">
              <Select
                label="Communication Skill"
                value={grades.COMMUNICATION}
                onChange={(value) => handleGradeChange("COMMUNICATION", value)}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
              <Select
                label="Dedication"
                value={grades.DEDICATION}
                onChange={(value) => handleGradeChange("DEDICATION", value)}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
              <Select
                label="Skill & Achievement"
                value={grades.SKILL_ACHIEVEMENT_TEXT}
                onChange={(value) => handleGradeChange("SKILL_ACHIEVEMENTS", value)}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
              <Textarea
                label="Skill Achievements"
                value={grades.SKILL_ACHIEVEMENT_TEXT}
                onChange={(e) => setGrades({ ...grades, SKILL_ACHIEVEMENT_TEXT: e.target.value })}
              />
              <div className="flex items-center w-full">
                <div className="flex flex-col w-full">
                  <span className="text-sm font-bold mb-1">Overall Interview Opinion:</span>
                  <Textarea
                    label="Opinion"
                    value={grades.INTERVIEW_OVERALL_OPINION}
                    onChange={(e) => setGrades({ ...grades, INTERVIEW_OVERALL_OPINION: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border border-gray-400 bg-gray-400 p-2 rounded-lg">
                <Typography variant="h6">Interview Overall Grade: {grades.INTERVIEW_OVERALL_GRADE}</Typography>
              </div>
            </div>
            <Typography variant="h5" className="mb-3" color="blue-gray">
              Selection
            </Typography>
            <div className="flex gap-4 flex-col">
              <Select
                label="Debate Score"
                value={grades.DEBATE_SCORE}
                onChange={(value) => handleGradeChange("DEBATE_SCORE", value)}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
              <Textarea
                label="Debate Opinion"
                value={grades.DEBATE_OPINION}
                onChange={(e) => setGrades({ ...grades, DEBATE_OPINION: e.target.value })}
              />
              <Select
                label="Group Activity Score"
                value={grades.GROUP_SCORE}
                onChange={(value) => handleGradeChange("GROUP_SCORE", value)}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
              <Textarea
                label="Group Opinion"
                value={grades.GROUP_OPINION}
                onChange={(e) => setGrades({ ...grades, GROUP_OPINION: e.target.value })}
              />
              <Select
                label="Stage Performance Score"
                value={grades.STAGE_SCORE}
                onChange={(value) => handleGradeChange("STAGE_SCORE", value)}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
              <Textarea
                label="Stage Opinion"
                value={grades.STAGE_OPINION}
                onChange={(e) => setGrades({ ...grades, STAGE_OPINION: e.target.value })}
              />
              <div className="flex items-center w-full">
                <div className="flex flex-col w-full">
                  <span className="text-sm font-bold mb-1">Overall  Opinion:</span>
                  <Textarea
                    label="Opinion"
                    value={grades.OVERALL_OPINION}
                    onChange={(e) => setGrades({ ...grades, OVERALL_OPINION: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border border-gray-400 bg-gray-400 p-2 rounded-lg">
                <Typography variant="h6"> Overall Grade: {grades.OVERALL_GRADE}</Typography>
              </div>
              <Button
                className="w-full bg-green-500 mt-2"
                onClick={submitScores}
              >
                Submit
              </Button>
            </div>
          </CardBody>
        </Card>
      )
      }

      {loading && (
        <div className='flex items-center justify-center w-full mt-8'>
          <h1 className='text-2xl font-semibold primary-text flex gap-2 '>Loading...<Loader className="animate-spin" /></h1>
        </div>
      )}

      {!loading && initial && (
        <div className="flex items-center justify-center w-full mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold primary-text mb-2 mx-auto flex items-center justify-center"><ChefHat size={40} /></h1>
            <p className="text-lg text-gray-600">Everything is set! You can start your search.</p>
          </div>
        </div>
      )}

      {alert && <div className="text-red-500 mt-4">No student found!</div>}


      <Dialog open={open} handler={handleOpen} className="p-6 rounded-lg shadow-lg bg-white">
        <DialogHeader>
          <h5 className="text-2xl font-bold text-gray-800">Score Added Successfully</h5>
        </DialogHeader>

        <DialogBody>
          <div className="text-center mb-4">
            <p className="text-gray-600">The score has been added successfully.</p>
          </div>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpen} className="w-full">
            <span>Thank You</span>
          </Button>
        </DialogFooter>
      </Dialog>

    </div >
  );
}

export default App;
