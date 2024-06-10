
import config from './config.js';

const url = document.getElementById("url");
const submitBtn = document.getElementById("short");

// onfocus for textbox, clears all the results on the screens
url.addEventListener("focus", () => {
  document.getElementById("status").innerText = "";
  document.getElementById("status").style.color = "black";
  document.getElementsByClassName("validity")[0].innerHTML = "URL Valid: ";
  document.getElementsByClassName("sURL")[0].setAttribute("href", "");
  document.getElementsByClassName("sURL")[0].innerHTML = "";
  document.getElementsByClassName("safety")[0].innerHTML = "URL Safe:";
});

//code for short button on screen
submitBtn.addEventListener("click", (e) => {
  console.log("Btn clicked!");
  e.preventDefault();
  const urlValue = url.value;
  let isUrlValid;

  if (!Boolean(urlValue)) {
    console.log("Enter valid URL");
    console.log("URL Doesn't exits");
    document.getElementsByClassName("validity")[0].innerHTML = "URL Valid: ";
    document.getElementsByClassName("sURL")[0].innerHTML = "";
    document.getElementById("status").innerText = "Enter a Valid URL";
    document.getElementById("status").style.color = "red";
    document.getElementsByClassName("safety")[0].innerHTML = "URL Safe:";
    return;
  }


// Validates the URL entered by sending a request to the server and if the response status code is in the range 200 - 299
// then it means the entered URL is valid
  fetch(urlValue)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        console.log("URL Exists");
        document.getElementsByClassName("validity")[0].innerHTML =
          "URL Valid: ✅";
        console.log(response.status);
        isUrlValid = true;
      } else {
        console.log(response.status);
        console.log("URL Doesn't exits");
        document.getElementsByClassName("validity")[0].innerHTML =
          "URL Valid: ❌";
        document.getElementsByClassName("sURL")[0].innerHTML = "";
        document.getElementById("status").innerText = "URL is not valid";
        document.getElementById("status").style.color = "red";
        document.getElementsByClassName("safety")[0].innerHTML =
          "URL Safe: ---";
        // return;
        isUrlValid = false;
      }
    })
    .then(() => {
      if (isUrlValid) {
        getId(urlValue);
      }
    })
    .catch((error) => {
      console.log("URL Doesn't exits", error);
      console.log("URL Doesn't exits");
      document.getElementsByClassName("validity")[0].innerHTML =
        "URL Valid: ❌";
      document.getElementsByClassName("sURL")[0].innerHTML = "";
      document.getElementById("status").innerText = "URL does not exist";
      document.getElementById("status").style.color = "red";
      document.getElementsByClassName("safety")[0].innerHTML = "URL Safe: ---";
    });
});

//If the URL is valid then we send a POST request to VirusTotal to get ID(in JSON).
// function getId(urlValue) {
//   const options = {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "x-apikey":
//         "e32d706ddc76727559f6891f49fd915010029cb662eb110a9a1cfc0431a3b568",
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({ url: urlValue }),
//   };

//   fetch("https://www.virustotal.com/api/v3/urls", options)
//     .then((response) => response.json())
//     .then((response) => {
//       if (response) {
//         console.log(response);
//         const data = response.data;
//         if (data == undefined) {
//           showError("Error!!!");
//           return;
//         }
//         const ID = data.id;
//         getData(ID, urlValue);
//       }
//     })
//     .catch((err) => console.error(err));
// }

function getId(urlValue) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "x-apikey": config.virusTotal.apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ url: urlValue }),
  };

  fetch(config.virusTotal.postUrl, options)
    .then((response) => response.json())
    .then((response) => {
      if (response) {
        console.log(response);
        const data = response.data;
        if (data === undefined) {
          showError("Error!!!");
          return;
        }
        const ID = data.id;
        getData(ID, urlValue);
      }
    })
    .catch((err) => console.error(err));
}

// After having the ID we make a GET request to get data (URL analysis) in JSON
// function getData(id, urlValue) {
//   const options = {
//     method: "GET",
//     headers: {
//       Accept:"application/json",
//       "x-apikey":
//         "e32d706ddc76727559f6891f49fd915010029cb662eb110a9a1cfc0431a3b568",
//     },
//   };
//   fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, options)
//     .then((response) => response.json())
//     .then((response) => {
//       const analysis = response.data;
//       console.log(analysis);
//       if (analysis.attributes.status === "queued") {
//         document.getElementById("status").innerText = "Processing...";
//         setTimeout(() => {
//           getData(id, urlValue);
//         }, 5000); // Wait for 5 seconds before checking the status again
//         return;
//       }
//       printData(analysis, urlValue);
//     })
//     .catch((err) => console.error(err));
// }

function getData(id, urlValue) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-apikey": config.virusTotal.apiKey,
    },
  };
  fetch(config.virusTotal.getUrl(id), options)
    .then((response) => response.json())
    .then((response) => {
      const analysis = response.data;
      console.log(analysis);
      if (analysis.attributes.status === "queued") {
        document.getElementById("status").innerText = "Processing...";
        setTimeout(() => {
          getData(id, urlValue);
        }, 5000); // Wait for 5 seconds before checking the status again
        return;
      }
      printData(analysis, urlValue);
    })
    .catch((err) => console.error(err));
}



// If we get the proper data, then we check if there is any one parameter which indicates the given URL is malicious,
//  then we consider the URL as unsafe
function printData(urlData, urlValue) {
  const harmless = urlData.attributes.stats.harmless;
  const malicious = urlData.attributes.stats.malicious;

  if (malicious <= 2) {
   
    document.getElementsByClassName("safety")[0].innerHTML = "URL Safe: ✅";
    getShortUrl(urlValue);
  } else 
  // if ((harmless !== 0 || malicious !== 0) && harmless < malicious) 
  { console.log(malicious)
    document.getElementsByClassName("safety")[0].innerHTML = "URL Safe:  ❌";
    document.getElementById("status").innerText = "Enter a Safe URL";
    document.getElementById("status").style.color = "red";
  }
}

// If the URL was safe then we send a POST request to Bitly to shorten the URL at final stage
// function getShortUrl(urlValue) {
//   fetch("https://api-ssl.bitly.com/v4/shorten", {
//     method: "POST",
//     headers: {
//       Authorization: "Bearer c46d9bc50d7d73df3acce33edbe612fd6f305f31",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ long_url: urlValue, domain: "bit.ly" }),
//   }).then((response) =>
//     response.json().then((data) => {
//       window.shortedUrl = data.id;
//       document.getElementById("status").innerText = "URL shortened";
//       document.getElementById("status").style.color = "green";
//       document
//         .getElementsByClassName("sURL")[0]
//         .setAttribute("href", "http://" + shortedUrl);
//       document.getElementsByClassName("sURL")[0].innerHTML = shortedUrl;
//       window.copied = document.getElementById("copy");
//     })
//   );
// }

function getShortUrl(urlValue) {
  fetch(config.bitly.shortenUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.bitly.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ long_url: urlValue, domain: "bit.ly" }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.shortedUrl = data.id;
      document.getElementById("status").innerText = "URL shortened";
      document.getElementById("status").style.color = "green";
      document.getElementsByClassName("sURL")[0].setAttribute("href", "http://" + shortedUrl);
      document.getElementsByClassName("sURL")[0].innerHTML = shortedUrl;
      window.copied = document.getElementById("copy");
    })
    .catch((err) => console.error(err));
}
//Event to copy (COPY button) the shortened URL
function copyURL() {
  console.log(shortedUrl);
  window.copied = document.getElementById("copy");
  copied.select();
  // copied.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(shortedUrl);
  // document.getElementById("copy").innerHtml=copied;
}

