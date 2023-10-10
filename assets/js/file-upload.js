document.addEventListener("DOMContentLoaded", function () {
  // Clear existing listeners. Needed for testing
  // function removeAllEventListeners(element, eventType) {
  //   // Get all listeners for the specified event type on the element
  //   const listeners = getEventListeners(element)[eventType];

  //   // Loop through the listeners and remove each one
  //   if (listeners) {
  //     listeners.forEach((listener) => {
  //       element.removeEventListener(eventType, listener.listener);
  //     });
  //   }
  // }

  // removeAllEventListeners(document.querySelector("input[type=file]"), "change");
  // removeAllEventListeners(document.querySelector(".box"), "click");

  function postArray(form) {
    form = document.querySelector(form);
    var data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  function truncateString(input, max) {
    return input.length > max ? input.substring(0, max) + "..." : input;
  }

  function truncateStringInMiddle(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;
    separator = separator || "...";
    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);
    return (
      fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars)
    );
  }

  function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s / 3600);
    s -= h * 3600;
    var m = Math.floor(s / 60);
    s -= m * 60;
    return h + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  function wait(ms) {
    const start = performance.now();
    while (performance.now() - start < ms);
  }

  document.querySelector(".progress").style.display = "none";

  // Cursor style for .box
  document.querySelector(".box").style.cursor = "pointer";

  // File change event
  document
    .querySelector("input[type=file]")
    .addEventListener("change", function () {
      wait(1000);
      simpleUpload("/ajax/upload.php", {
        data: postArray("#form-id"),
        maxFileSize: 100000000,
        allowedExts: [
          "avi",
          "gif",
          "jpg",
          "jpeg",
          "mov",
          "mp3",
          "mp4",
          "pdf",
          "png",
          "tif",
          "tiff",
          "doc",
          "docx",
          "docm",
          "dotx",
          "ppt",
          "pptx",
          "pptm",
          "xls",
          "xlsx",
          "xlsm",
          "odt",
          "ods",
          "odg",
          "apk",
          "wav",
        ],
        expect: "json",
      });
    });

  let interval;

  function onStart(file) {
    document.getElementById("file").disabled = true;

    document
      .querySelectorAll(".box")
      .forEach((el) => (el.style.cursor = "default"));

    var seconds = 1;

    const elapsedTimeElem = document.getElementById("elapsed-time");
    elapsedTimeElem.innerHTML = "| Elapsed: " + secondsTimeSpanToHMS(seconds);

    interval = setInterval(function () {
      elapsedTimeElem.innerHTML =
        "| Elapsed: " + secondsTimeSpanToHMS(++seconds);
    }, 1000);

    document.getElementById("box-icon").innerHTML =
      "<i class='fa fa-spinner fa-spin'></i>";

    document.getElementById("box-text").innerHTML =
      "Uploading File... Progress 0%";

    document.getElementById("filename").innerHTML =
      "File: " + truncateStringInMiddle(file.name, 30);

    document.querySelectorAll(".result-message").forEach((el) => {
      el.innerHTML = "";
      el.style.display = "none";
    });

    document
      .querySelectorAll(".progress")
      .forEach((el) => (el.style.display = "block"));

    // Equivalent of $('.progress-bar').css("width", "0%").attr("aria-valuenow", "0");
    document.querySelectorAll(".progress-bar").forEach((el) => {
      el.style.width = "0%";
      el.setAttribute("aria-valuenow", "0");
    });
  }

  function onProgress(progress) {
    document.querySelectorAll(".progress-bar").forEach((el) => {
      el.style.width = progress + "%";
      el.setAttribute("aria-valuenow", progress);
    });

    const boxTextElem = document.getElementById("box-text");
    boxTextElem.innerHTML =
      "Uploading File... Progress " + Math.round(progress) + "%";

    if (Math.round(progress) === 100) {
      boxTextElem.innerHTML = "Compressing File... Please Wait...";
    }
  }

  function onSuccess(result) {
    clearInterval(interval);

    const resultMessageElem = document.querySelector(".result-message");

    // Check success
    if (result.success === true) {
      let messageHTML = "";
      if (result.compressed) {
        messageHTML = `<div class="success-message"><i class="fa fa-check" aria-hidden="true"></i> Completed: <a href="${result.proto}://${result.host}/download.php?hash=${result.hash}" target="_blank" rel="nofollow">Download (${result.human_filesize} => ${result.new_human_filesize}, ${result.percent}%)</a></div><div><a href="${result.proto}://${result.host}/delete-file.php?hash=${result.hash}" target="_blank" rel="nofollow" class="text-danger"><i class="fa fa-trash" aria-hidden="true"></i> Delete file from server</a></div>`;
      } else {
        messageHTML = `<div class="success-message"><i class="fa fa-check" aria-hidden="true"></i> Completed: File is already compressed...</div><div><a href="${result.proto}://${result.host}/delete-file.php?hash=${result.hash}" target="_blank" rel="nofollow" class="text-danger"><i class="fa fa-trash" aria-hidden="true"></i> Delete file from server</a></div>`;
      }
      resultMessageElem.innerHTML = messageHTML;
    } else {
      // If not successful
      resultMessageElem.innerHTML = `<div class="error-message"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ${result.error}</div>`;
    }

    // Show the message
    resultMessageElem.style.display = "block";

    document.getElementById("file").disabled = false;

    document
      .querySelectorAll(".box")
      .forEach((el) => (el.style.cursor = "pointer"));

    document.getElementById("box-icon").innerHTML =
      "<i class='fa fa-upload'></i>";

    document.getElementById("box-text").innerHTML = "Select File to Compress";

    document.querySelector("input[type=file]").value = null;
  }

  function simpleUpload(url, options) {
    const fileInput = document.querySelector("input[type=file]");
    const file = fileInput.files[0];

    // Check max file size
    if (file.size > options.maxFileSize) {
      alert("File too large");
      return;
    }

    // Check allowed extensions
    const ext = file.name.split(".").pop().toLowerCase();
    if (!options.allowedExts.includes(ext)) {
      alert("Invalid file extension");
      return;
    }

    onStart(file);

    // Create a FormData object to package the file
    const formData = new FormData();

    formData.append("submitfile", "1");
    for (let key in options.data) {
      formData.append(key, options.data[key]);
    }

    // Create XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Progress listener
    xhr.upload.addEventListener("progress", function (e) {
      const progress = (e.loaded / e.total) * 100;
      onProgress(progress);
    });

    // Success listener
    xhr.addEventListener("load", function (e) {
      const result = JSON.parse(xhr.responseText);
      onSuccess(result);
    });

    // Error listener
    xhr.addEventListener("error", function () {
      // your code here
    });

    // Open and send request
    xhr.open("POST", url, true);
    xhr.setRequestHeader(
      "Accept",
      "application/json, text/javascript, */*; q=0.01"
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(formData);
  }
});
