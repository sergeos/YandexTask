function MyForm() {}

MyForm.prototype.validate = function() {
  var fioRE = /^[а-яА-ЯёЁa-zA-Z]{2,40}\s+[а-яА-ЯёЁa-zA-Z]{2,40}\s+[а-яА-ЯёЁa-zA-Z]{2,40}\s*$/;
  var emailRE = /^([a-z0-9_\.-]+)@(?=(ya.ru|yandex.com|yandex.ru|yandex.by|yandex.ua|yandex.kz))\2/;
  var phoneRE = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;

  var elems = document.forms["myForm"].elements;
  var isValid;
  var errorFields = [];

  if (fioRE.test(elems[0].value)) {
    elems[0].classList.remove("error");
  } else {
    elems[0].classList.add("error");
    errorFields.push(elems[0].name);
  }

  if (emailRE.test(elems[1].value)) {
    elems[1].classList.remove("error");
  } else {
    elems[1].classList.add("error");
    errorFields.push(elems[1].name);
  }

  if (phoneRE.test(elems[2].value)) {
    var sum = 0;
    var digits = elems[2].value.match(/\d+/g).join("");

    for (var i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i], 10);
    }
    console.log(sum);
    if (sum < 31) {
      elems[2].classList.remove("error");
    } else {
      elems[2].classList.add("error");
      errorFields.push(elems[2].name);
    }
  } else {
    elems[2].classList.add("error");
    errorFields.push(elems[2].name);
  }

  //console.log({ isValid: !errorFields.length > 0, errorFields });
  return { isValid: !errorFields.length > 0, errorFields };
};

MyForm.prototype.getData = function() {
  var elems = document.forms["myForm"].elements;
  var fio = elems[0].value;
  var email = elems[1].value;
  var phone = elems[2].value;

  return { fio: fio, email: email, phone: phone };
};
MyForm.prototype.setData = function(objForm) {
  let inputs = document.querySelectorAll("input[type=text]");
  for (let j = 0; j < inputs.length; j++) {
    if (objForm.hasOwnProperty(inputs[j].name)) {
      inputs[j].value = objForm[inputs[j].name];
    }
  }
};
MyForm.prototype.submit = function() {
  if (!MyForm.prototype.validate().isValid) return;
  
  var xhr = new XMLHttpRequest();

  // [{"status":"success"}]
  // [{"status":"error","reason":"string"}]
  // [{"status":"progress","timeout":2000}]

  xhr.open("GET", document.forms["myForm"].action, false);
  //xhr.open('GET','data:text/javascript;charset=utf-8,[{"status":"progress","timeout":2000}]',true)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // Track the state changes of the request.
  xhr.onreadystatechange = function() {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        console.log(xhr.responseText);
        var status = JSON.parse(xhr.responseText);
        var resultContainer = document.getElementById("resultContainer");
        resultContainer.className = status[0]["status"];
        switch (status[0]["status"]) {
          case "success":
            resultContainer.innerText = "Success";
            break;
          case "error":
            resultContainer.innerText = JSON.parse(xhr.responseText)[0].reason;
            break;
          case "progress":
            var time = JSON.parse(xhr.responseText)[0].timeout;
            resultContainer.innerText = time.toString();
            setTimeout(MyForm.prototype.submit, time);
            break;
        }

        /* status.forEach(function (name) {
                    console.log(name.status);
                }); */
      } else {
        console.log("Error: " + xhr.status); // An error occurred during the request.
      }
    }
  };

  // Send the request to send-ajax-data.php
  //xhr.send(null);
  xhr.send();
};

document.forms["myForm"].addEventListener("submit", function(event) {
  event.preventDefault();
  MyForm.prototype.submit();
  return false;
});
