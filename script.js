//Random Quotes Api URL
// const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteApiUrl="https://quotes-api-self.vercel.app/quote";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Display random quotes
const renderNewQuote = async () => {
  try {
    const response = await fetch(quoteApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    console.log(data); // Debug to verify the API response
    quote = data.quote || "Default fallback quote.";
    let arr = quote.split("").map((value) => {
      return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML = arr.join("");
  } catch (error) {
    console.error("Error fetching or rendering quote:", error);
    quoteSection.innerHTML = "<p>Failed to load quote. Please try again later.</p>";
  }
};


//Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  //Create an arrat from received span tags
  quoteChars = Array.from(quoteChars);

  //array of user input characters
  let userInputChars = userInput.value.split("");

  //loop through each character in quote
  quoteChars.forEach((char, index) => {
    //Check if char(quote character) = userInputChars[index](input character)
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    //If user hasn't entered anything or backspaced
    else if (userInputChars[index] == null) {
      //Remove class if any
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }
    //If user enter wrong character
    else {
      //Checks if we alreasy have added fail class
      if (!char.classList.contains("fail")) {
        //increment and display mistakes
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }
    //Returns true if all the characters are entered correctly
    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    //End test if all characters are correct
    if (check) {
      displayResult();
    }
  });
});

//Update Timer on screen
function updateTimer() {
  if (time == 0) {
    //End test if timer reaches 0
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

//Sets timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test
const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  document.getElementById("retest-button").style.display = "block"; // Show the retest button
  userInput.disabled = true;
  
  let timeTaken = time !== 0 ? (60 - time) / 100 : 1;
  document.getElementById("wpm").innerText = 
    (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";

  const accuracy1 = Math.round(
    ((userInput.value.length - mistakes) / userInput.value.length) * 100
  );
  document.getElementById("accuracy").innerText = accuracy1 + " %";
  if(accuracy1>0 && accuracy1<=33){
    document.getElementById("wish").innerText="Congratulations!";
    document.getElementById("level").innerText="Beginner";
  }
  else if(accuracy1>33 && accuracy1<=66){
    document.getElementById("wish").innerText="Congratulations!";
    document.getElementById("level").innerText="Intermediate";
  }
  else if(accuracy1>66 && accuracy1<=100){
    document.getElementById("wish").innerText="Congratulations!"
    document.getElementById("level").innerText="Advanced";
  }
  else{
    document.getElementById("wish").innerText="Oops!";
    document.getElementById("level").innerText="Please try again.";
  }
};



//Start Test
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
// theme
const themeToggleButton = document.getElementById("theme-toggle");
// Check for saved theme in local storage
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggleButton.innerText = savedTheme === "light" ? "Swith to Dark" : "Switch to Light";

// Toggle theme on button click
themeToggleButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  // Apply the new theme
  document.documentElement.setAttribute("data-theme", newTheme);
  
  // Save the new theme to local storage
  localStorage.setItem("theme", newTheme);

  // Update button text
  themeToggleButton.innerText = newTheme === "light" ? "Switch to Dark" : "Switch to Light";
});
const retest = () => {
  mistakes = 0;
  time = 60;
  userInput.value = "";
  userInput.disabled = true;
  document.querySelector(".result").style.display = "none";
  document.getElementById("retest-button").style.display = "none";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  document.getElementById("mistakes").innerText = "0";
  document.getElementById("timer").innerText = "60s";
  renderNewQuote();
};
document.getElementById("retest-button").addEventListener("click", retest);

