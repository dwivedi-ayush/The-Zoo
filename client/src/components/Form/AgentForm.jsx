import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const AgentForm = () => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const { currentUser } = useSelector((state) => state.user);

  const handleAddQuestion = () => {
    setShowQuestionForm(true);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };

  const handleNewQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleAddNewQuestion = () => {
    if (newQuestion.trim() !== "") {
      const newQuestionObject = {
        type: questionType,
        text: newQuestion,
      };
      setQuestions([...questions, newQuestionObject]);
      setNewQuestion("");
      setShowQuestionForm(false);
    }
  };

  const handleQuestionAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleCreateForm = () => {
    // Create the form data object
    const formData = {};

    // Get the values from the input fields
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const occupation = document.getElementById("occupation").value;
    const hobbies = document.getElementById("hobbies").value;
    const interests = document.getElementById("interests").value;
    const education = document.getElementById("education").value;
    const major = document.getElementById("major").value;
    const achievements = document.getElementById("achievements").value;
    const responsibilities = document.getElementById("responsibilities").value;
    const jobEnjoyment = document.getElementById("job-enjoyment").value;
    const personality = document.getElementById("personality").value;
    const introversion = document.getElementById("introversion").value;
    const values = document.getElementById("values").value;
    const communication = document.getElementById("communication").value;
    const listening = document.getElementById("listening").value;
    const goals = document.getElementById("goals").value;
    const aspirations = document.getElementById("aspirations").value;
    const challenges = document.getElementById("challenges").value;
    const coping = document.getElementById("coping").value;
    const favorites = document.getElementById("favorites").value;
    const cuisine = document.getElementById("cuisine").value;
    const travel = document.getElementById("travel").value;
    const misc = document.getElementById("misc").value;
    const userID = currentUser._id;
    const agentGroupID = currentAgentGroup.id;

    // Add the values to the formData object
    formData["Name"] = name;
    formData["Age"] = age;
    formData["Gender"] = gender;
    formData["Occupation"] = occupation;
    formData["Hobbies"] = hobbies;
    formData["Interests"] = interests;
    formData["Education"] = education;
    formData["Major"] = major;
    formData["Achievements"] = achievements;
    formData["Responsibilities"] = responsibilities;
    formData["Job Enjoyment"] = jobEnjoyment;
    formData["Personality"] = personality;
    formData["Introversion"] = introversion;
    formData["Values"] = values;
    formData["Communication"] = communication;
    formData["Listening"] = listening;
    formData["Goals"] = goals;
    formData["Aspirations"] = aspirations;
    formData["Challenges"] = challenges;
    formData["Coping"] = coping;
    formData["Favorites"] = favorites;
    formData["Cuisine"] = cuisine;
    formData["Travel"] = travel;
    formData["Miscellaneous"] = misc;
    formData["UserID"] = userID;
    formData["AgentGroupID"] = agentGroupID;

    // Add the added questions to the formData object
    questions.forEach((question, index) => {
      formData[`Question ${index + 1}`] = question.answer;
    });

    // Console log the formData object
    // console.log(formData);

    const url = "http://127.0.0.1:5000/submit-form";

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

const handleCreateGoogleForm = () => {
  const defaultQuestions = [
    // Personal Information
    { text: "Name:", type: "text" },
    { text: "Age:", type: "number" },
    { text: "Gender:", type: "text" },
    { text: "Occupation:", type: "text" },

    // Hobbies and Interests
    {
      text: "What are your favorite hobbies or activities to do in your free time?",
      type: "textarea",
    },
    {
      text: "Do you have any specific interests or passions? If so, please specify.",
      type: "textarea",
    },

    // Educational Background
    { text: "What is your highest level of education?", type: "text" },
    {
      text: "Did you major in a specific field? If yes, please specify.",
      type: "text",
    },
    {
      text: "Any notable academic achievements or extracurricular activities?",
      type: "textarea",
    },

    // Professional Life
    { text: "What is your current occupation or field of work?", type: "text" },
    {
      text: "Could you briefly describe your responsibilities or daily tasks at work?",
      type: "textarea",
    },
    { text: "What do you enjoy most about your job?", type: "textarea" },

    // Personality Traits
    {
      text: "How would you describe your personality in three words?",
      type: "text",
    },
    { text: "Are you more introverted or extroverted?", type: "text" },
    {
      text: "What values are most important to you in life?",
      type: "textarea",
    },

    // Communication Style
    {
      text: "How do you typically communicate with others? (e.g., in person, phone calls, text messages, emails)",
      type: "text",
    },
    { text: "Do you consider yourself a good listener?", type: "text" },

    // Goals and Aspirations
    { text: "What are your short-term and long-term goals?", type: "textarea" },
    {
      text: "Is there something specific you're working towards in your personal or professional life?",
      type: "textarea",
    },

    // Challenges and Struggles
    {
      text: "What are some challenges you've faced recently?",
      type: "textarea",
    },
    {
      text: "How do you typically handle stress or difficult situations?",
      type: "textarea",
    },

    // Favorites
    { text: "Favorite book/movie/TV show/music genre?", type: "textarea" },
    { text: "Favorite food or type of cuisine?", type: "text" },
    {
      text: "Favorite travel destination or dream vacation spot?",
      type: "text",
    },

    // Miscellaneous
    {
      text: "Is there anything else you'd like to share about yourself that wasn't covered in the questions above?",
      type: "textarea",
    },
  ];

  const allQuestions = [...defaultQuestions, ...questions];
  const questionsData = JSON.stringify(allQuestions);

  // Call the Apps Script web app URL
  const url =
    "https://script.google.com/macros/s/AKfycby73mmW4ZL1105CDDh69Ba4N2KVXYAnxCrNz27xjZRZdtEV8-MjEyigR-lO-fpUfL91/exec";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: questionsData,
  };

  fetch(url, requestOptions)
    .then((response) => response.text())
    .then((data) => {
      console.log("Google Form URL:", data);
    })
    .catch((error) => console.error("Error:", error));
};

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">
        Personality and Interest Survey
      </h1>

      {/* Personal Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-gray-700 font-medium mb-2"
            >
              Age:
            </label>
            <input
              type="number"
              id="age"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-gray-700 font-medium mb-2"
            >
              Gender:
            </label>
            <input
              type="text"
              id="gender"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="occupation"
              className="block text-gray-700 font-medium mb-2"
            >
              Occupation:
            </label>
            <input
              type="text"
              id="occupation"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Hobbies and Interests */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Hobbies and Interests</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="hobbies"
              className="block text-gray-700 font-medium mb-2"
            >
              What are your favorite hobbies or activities to do in your free
              time?
            </label>
            <textarea
              id="hobbies"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="interests"
              className="block text-gray-700 font-medium mb-2"
            >
              Do you have any specific interests or passions? If so, please
              specify.
            </label>
            <textarea
              id="interests"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Educational Background */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Educational Background</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="education"
              className="block text-gray-700 font-medium mb-2"
            >
              What is your highest level of education?
            </label>
            <input
              type="text"
              id="education"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="major"
              className="block text-gray-700 font-medium mb-2"
            >
              Did you major in a specific field? If yes, please specify.
            </label>
            <input
              type="text"
              id="major"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="achievements"
              className="block text-gray-700 font-medium mb-2"
            >
              Any notable academic achievements or extracurricular activities?
            </label>
            <textarea
              id="achievements"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Professional Life */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Professional Life</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="occupation"
              className="block text-gray-700 font-medium mb-2"
            >
              What is your current occupation or field of work?
            </label>
            <input
              type="text"
              id="occupation"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="responsibilities"
              className="block text-gray-700 font-medium mb-2"
            >
              Could you briefly describe your responsibilities or daily tasks at
              work?
            </label>
            <textarea
              id="responsibilities"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="job-enjoyment"
              className="block text-gray-700 font-medium mb-2"
            >
              What do you enjoy most about your job?
            </label>
            <textarea
              id="job-enjoyment"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Personality Traits</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="personality"
              className="block text-gray-700 font-medium mb-2"
            >
              How would you describe your personality in three words?
            </label>
            <input
              type="text"
              id="personality"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="introversion"
              className="block text-gray-700 font-medium mb-2"
            >
              Are you more introverted or extroverted?
            </label>
            <input
              type="text"
              id="introversion"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="values"
              className="block text-gray-700 font-medium mb-2"
            >
              What values are most important to you in life?
            </label>
            <textarea
              id="values"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Communication Style */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Communication Style</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="communication"
              className="block text-gray-700 font-medium mb-2"
            >
              How do you typically communicate with others? (e.g., in person,
              phone calls, text messages, emails)
            </label>
            <input
              type="text"
              id="communication"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="listening"
              className="block text-gray-700 font-medium mb-2"
            >
              Do you consider yourself a good listener?
            </label>
            <input
              type="text"
              id="listening"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Goals and Aspirations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Goals and Aspirations</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="goals"
              className="block text-gray-700 font-medium mb-2"
            >
              What are your short-term and long-term goals?
            </label>
            <textarea
              id="goals"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="aspirations"
              className="block text-gray-700 font-medium mb-2"
            >
              Is there something specific you're working towards in your
              personal or professional life?
            </label>
            <textarea
              id="aspirations"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Challenges and Struggles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Challenges and Struggles</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="challenges"
              className="block text-gray-700 font-medium mb-2"
            >
              What are some challenges you've faced recently?
            </label>
            <textarea
              id="challenges"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="coping"
              className="block text-gray-700 font-medium mb-2"
            >
              How do you typically handle stress or difficult situations?
            </label>
            <textarea
              id="coping"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Favorites</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="favorites"
              className="block text-gray-700 font-medium mb-2"
            >
              Favorite book/movie/TV show/music genre?
            </label>
            <textarea
              id="favorites"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="cuisine"
              className="block text-gray-700 font-medium mb-2"
            >
              Favorite food or type of cuisine?
            </label>
            <input
              type="text"
              id="cuisine"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="travel"
              className="block text-gray-700 font-medium mb-2"
            >
              Favorite travel destination or dream vacation spot?
            </label>
            <input
              type="text"
              id="travel"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Miscellaneous */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Miscellaneous</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="misc"
              className="block text-gray-700 font-medium mb-2"
            >
              Is there anything else you'd like to share about yourself that
              wasn't covered in the questions above?
            </label>
            <textarea
              id="misc"
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
        {questions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Added Questions</h2>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold mb-2">
                  {question.type === "radio" ? "Radio Button" : "Text"}{" "}
                  Question:
                </p>
                <p>{question.text}</p>
                <input
                  type={question.type === "radio" ? "radio" : "text"}
                  value={question.answer}
                  onChange={(e) =>
                    handleQuestionAnswerChange(index, e.target.value)
                  }
                  className="mt-2 block w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        )}
        <div className="mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
          {showQuestionForm && (
            <div className="mt-4 border border-gray-300 rounded p-4">
              <input
                type="text"
                placeholder="Enter new question"
                value={newQuestion}
                onChange={handleNewQuestionChange}
                className="mt-2 block w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handleAddNewQuestion}
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateForm}
          >
            Create Form Directly
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateGoogleForm}
          >
            Create Google Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;
