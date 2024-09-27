import nsslogo from "@/assets/icons/nss_logo.png";
import { Button, Input, Spinner, Card, CardBody, Typography } from "@material-tailwind/react";
import Airtable from "airtable";
import backendUrl from "@/const/backendUrl";
import { useState } from "react";

const base = new Airtable({ apiKey: `${backendUrl.secretKey}` }).base(
  `${backendUrl.airtableBase}`
);

function App() {
  const [searchText, setSearchText] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Score states
  const [communication, setCommunication] = useState('');
  const [dedication, setDedication] = useState('');
  const [skillAchieve, setSkillAchieve] = useState('');
  const [interviewOverall, setInterviewOverall] = useState('');
  const [debateScore, setDebateScore] = useState('');
  const [grpActScore, setGrpActScore] = useState('');
  const [stagePerScore, setStagePerScore] = useState('');
  const [overallScore, setOverallScore] = useState('');
  
  const getStudent = async (search) => {
    if (searchText === "") return;
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
          console.log(record[0].fields);
          setStudentData(record[0].fields);
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
    setSubmitted(true);
  };

  const submitScores = async () => {
    base("Students").update(
      `${studentID}`,
      {
        COMMUNICATION_GRADE: `${communication}`,
        DEDICATION_GRADE: `${dedication}`,
        SKILL_ACHIEVEMENT_GRADE: `${skillAchieve}`,
        INTERVIEW_OVERALL_GRADE: `${interviewOverall}`,
        DEBATE_GRADE: `${debateScore}`,
        GROUP_GRADE: `${grpActScore}`,
        STAGE_GRADE: `${stagePerScore}`,
        OVERALL_GRADE: `${overallScore}`,
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        } else {
          clearStudentData();
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center px-4">
      <div className="py-4 flex items-center gap-2">
        <img src={nsslogo} width={60} alt="nss_logo" />
        <div className="">
          <h4 className="text-2xl font-bold">NSS ADMISSION</h4>
          <h5 className="text-1xl font-semibold">Score System</h5>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Input
          type="text"
          label="Chest No"
          onChange={(e) => setSearchText(e.target.value.toUpperCase())}
          value={searchText}
        />
        <Button
          className="w-full bg-blue-900"
          onClick={() => getStudent(searchText)}
        >
          Search
        </Button>
      </div>

      {!loading && studentData && Object.keys(studentData).length > 0 && (
        <Card className="mt-6 w-full">
          <CardBody>
            <Typography variant="h5" className="mb-3" color="blue-gray">
              Interview {studentData.CHEST_NO}
            </Typography>
            <div className="flex gap-2 flex-col mb-4">
              <Input
                type="text"
                onChange={(e) => setCommunication(e.target.value)}
                label="Communication Skill"
                value={communication}
              />
              <Input
                type="text"
                onChange={(e) => setDedication(e.target.value)}
                label="Dedication"
                value={dedication}
              />
              <Input
                type="text"
                onChange={(e) => setSkillAchieve(e.target.value)}
                label="Skill & Achievement"
                value={skillAchieve}
              />
              <Input
                type="text"
                onChange={(e) => setInterviewOverall(e.target.value)}
                label="Interview Overall"
                value={interviewOverall}
              />
            </div>
            <Typography variant="h5" className="mb-3" color="blue-gray">
              Selection
            </Typography>
            <div className="flex gap-4 flex-col">
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  onChange={(e) => setDebateScore(e.target.value)}
                  label="Debate Score"
                  value={debateScore}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  onChange={(e) => setGrpActScore(e.target.value)}
                  label="Group Activity Score"
                  value={grpActScore}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  onChange={(e) => setStagePerScore(e.target.value)}
                  label="Stage Performance Score"
                  value={stagePerScore}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  onChange={(e) => setOverallScore(e.target.value)}
                  label="Overall Score"
                  value={overallScore}
                />
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
      )}

      {loading && <Spinner />}
      {alert && <div className="text-red-500">No student found!</div>}
    </div>
  );
}

export default App;
