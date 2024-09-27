import React, { useState } from 'react';

const gradePoints = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5
};

const sections = ['Section-1', 'Section-2', 'Section-3'];

const index = () => {
  const [grades, setGrades] = useState({
    'Section-1': '',
    'Section-2': '',
    'Section-3': ''
  });

  const handleGradeChange = (section, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [section]: value
    }));
  };

  const calculateOverallScore = () => {
    const totalPoints = sections.reduce((total, section) => {
      return total + (gradePoints[grades[section]] || 0);
    }, 0);

    const averagePoints = totalPoints / sections.length;
    
    return averagePoints.toFixed(2); // To show 2 decimal places
  };

  return (
    <div>
      <h2>Grade Selector</h2>
      {sections.map((section) => (
        <div key={section}>
          <label>{section}:</label>
          <select
            value={grades[section]}
            onChange={(e) => handleGradeChange(section, e.target.value)}
          >
            <option value="">Select Grade</option>
            {Object.keys(gradePoints).map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div>
        <h3>Overall Score: {calculateOverallScore()}</h3>
      </div>
    </div>
  );
};

export default index;
