window.onload = function () {
   inputfile.addEventListener("change", (event) => {
      addFile(event)
   });
   checkdirectory.addEventListener("click", sendFile);
   //rcsbPDBID.addEventListener("input", addRCSBFile);
   lang.addEventListener("change", changeLang);
   printtmp.addEventListener("click", showTMP);

   const userId = createAndSaveUserIdCookie();

   function showTMP() {
      axios.get(`https://testsshpractice.vercel.app/api/formd?name=5`)
         .then(function (res) {
            var str = `${JSON.stringify(res)}`;
            var regex = /(upload_\w+\.dat|upload_\w+\.pdb)/g;

            // Строка для хранения найденных имен файлов с разделением через перевод строки
            var foundFilesString = "";

            // Используем метод match для поиска всех совпадений
            var match;
            while ((match = regex.exec(str)) !== null) {
               foundFilesString += match[0] + "\n";
            }
            result.innerHTML = foundFilesString;
         })
         .catch(function (err) {
            result.innerHTML = err;
            //console.log(err);
         })
         .finally(function () {
            //result.innerHTML = 'axios list files done';
            //console.log("axios list files done");
         });
   }

   function changeLang() {
      let selectedLang = lang.value;
      if (selectedLang === "en") {
         document.getElementById('maintitle').innerHTML = "Web server for predicting protein association rate constant";
         document.getElementById('prtstr').innerHTML = "Complex structure";
         document.getElementById('textemail').innerHTML = "Enter an email address to receive rate prediction";
         document.getElementById('textid').innerHTML = "Type an arbitrary task identifier";
         document.getElementById('textsubmission').innerHTML = "Submission information";
         document.getElementById('taskID').placeholder = "email subject";
         document.getElementById('textenterpdb').innerHTML = "Enter PDB ID of the complex. For instance, 2vln.";
         document.getElementById('textenterlocal').innerHTML = "Upload PDB file.";
         document.getElementById('checkdirectory').innerHTML = "Submit";
         document.getElementById('favailableidstext').innerHTML = "Specify the identifiers of the interacting chains.";
         document.getElementById('savailableidstext').innerHTML = "For instance, A:B, AB:C, AB:CD etc.";
         document.getElementById('text-content').innerHTML = "The task has been submitted for calculations!";
         document.getElementById('showpdb').innerHTML = "Show";
         document.getElementById('hidepdb').innerHTML = "Hide";

         let oid = document.getElementById('aids').innerHTML;
         let nid = oid.replace('Доступные идентификаторы цепей', 'Available chain identifiers');
         document.getElementById('aids').innerHTML = nid;
      } else {
         document.getElementById('maintitle').innerHTML = "Веб-сервер для численной оценки константы ассоциации в белковых комплексах";
         document.getElementById('prtstr').innerHTML = "Структура комплекса";
         document.getElementById('textemail').innerHTML = "Введите почту для отправки результатов оценки";
         document.getElementById('textid').innerHTML = "Введите произвольный идентификатор задачи";
         document.getElementById('textsubmission').innerHTML = "Информация о задаче";
         document.getElementById('taskID').placeholder = "тема электронного письма";
         document.getElementById('textenterpdb').innerHTML = "Введите PDB ID комплекса. Например, 2vln.";
         document.getElementById('textenterlocal').innerHTML = "Загрузите PDB файл.";
         document.getElementById('checkdirectory').innerHTML = "Отправить";
         document.getElementById('favailableidstext').innerHTML = "Укажите идентификаторы взаимодействующих цепей.";
         document.getElementById('savailableidstext').innerHTML = "Например, A:B, AB:C, AB:CD и т.п.";
         document.getElementById('text-content').innerHTML = "Задача отправлена для вычислений!";
         document.getElementById('showpdb').innerHTML = "Показать";
         document.getElementById('hidepdb').innerHTML = "Скрыть";

         let oid = document.getElementById('aids').innerHTML;
         let nid = oid.replace('Available chain identifiers', 'Доступные идентификаторы цепей');
         document.getElementById('aids').innerHTML = nid;
      }

   }

   function addFile(event) {
      let data = new FormData();

      if (inputfile.files.length > 0) {
         const fileSize = inputfile.files.item(0).size;
         if (fileSize > 1048576) {
            let selectedLang = lang.value;
            if (selectedLang === "en") {
               showNotification("File size must be less than one megabyte");
            } else {
               showNotification("Размер файла должен быть меньше одного мегабайта");
            }
            inputfile.value = null;
            return;
         }
      }

      const filem = event.target.files[0];
      data.append("filemon", filem);

      const objectURL = URL.createObjectURL(filem);
      let link = document.getElementById('downloadlink');
      link.value = objectURL;

      event.preventDefault();

      let valueTaskID = '';
      let valueEmail = '';
      let valueChains = '';
      let valueRCSB = '';

      valueTaskID = document.getElementById("taskID").value;
      valueEmail = document.getElementById("email").value;
      valueChains = document.getElementById("chains").value;
      valueRCSB = '';

      const dothis = 0;
      //DEFINE HEADERS
      const config = {
         headers: {
            'content-type': "multipart/form-data"
         }
      }


      const reader = new FileReader();
      //const asymIdSet = new Set();
      //const lines = reader.readAsText(filem);
      /*for (const line of lines) {
        if (line.startsWith('ATOM')) {
          const asymId = line.slice(21, 22).trim();
          if (asymId) {
            asymIdSet.add(asymId);
          }
        }
      }
      let chainsid = '';
      Array.from(asymIdSet).forEach(item => {				
					chainsid += item;
				});*/
      // Добавляем обработчик события onload для FileReader
      reader.onload = function (event) {
         const fileContent = event.target.result;

         // Теперь вы можете обрабатывать содержимое файла, например, подсчитать количество строк
         const lines = fileContent.split('\n');

         const asymIdSet = new Set();
         for (const line of lines) {
            if (line.startsWith('ATOM')) {
               const asymId = line.slice(21, 22).trim();
               if (asymId) {
                  asymIdSet.add(asymId);
               }
            }
         }
         let chainsid = '';
         Array.from(asymIdSet).sort().forEach(item => {
            chainsid += item;
         });

         document.getElementById('chids').innerHTML = ": " + chainsid;
         document.getElementById('chains').disabled = false;
         document.getElementById('chains').value = '';
      };
      reader.readAsText(filem);

      axios.post(`https://testsshpractice.vercel.app/api/formd?name=${dothis}&valueTaskID=${valueTaskID}&valueEmail=${valueEmail}&valueChains=${valueChains}&valueRCSB=${valueRCSB}&userId=${userId}`, data, config).then(function (res) {
            data.delete("filemon");
         })
         .catch(function (err) {
            console.log(err);
         })
         .finally(function () {
            console.log("axios read send file done");
         });
   }

   async function getChainsID(pdbId) {
      const url = `https://files.rcsb.org/download/${pdbId}.pdb`;

      return fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error(`Ошибка при загрузке PDB файла: ${response.status}`);
            }
            return response.text();
         })
         .then(pdbData => {
            const asymIdSet = new Set();
            const lines = pdbData.split('\n');
            for (const line of lines) {
               if (line.startsWith('ATOM')) {
                  const asymId = line.slice(21, 22).trim();
                  if (asymId) {
                     asymIdSet.add(asymId);
                  }
               }
            }
            let chainsid = '';
            Array.from(asymIdSet).sort().forEach(item => {
               chainsid += item;
            });

            return chainsid;
         });
   }

   async function sendFile() {
      const emailValue = document.getElementById("email").value;
      const chainsValue = document.getElementById("chains").value;
      const taskIDValue = document.getElementById("taskID").value;

      //const rcsbPdbInput = document.getElementById("rcsbPDB");
      //const localPdbInput = document.getElementById("localPDB");

      const fInput = document.getElementById("inputfile");

      const pdbIdInput = document.getElementById("rcsbPDBID");
      const pdbId = pdbIdInput.value.trim().toUpperCase();

      const isPDBIDok = document.getElementById("pdbidvalue").value;

      if (emailValue.length != 0 &&
         chainsValue.length != 0 &&
         taskIDValue.length != 0 &&
         fInput.files.length > 0) {
         let valueTaskID = '';
         let valueEmail = '';
         let valueChains = '';
         let valueRCSB = '';

         valueTaskID = document.getElementById("taskID").value;
         valueEmail = document.getElementById("email").value;
         valueChains = document.getElementById("chains").value;
         valueRCSB = '';

         let uploadBtn = document.getElementById("checkdirectory");
         let textContent = document.getElementById("text-content");

         uploadBtn.style.display = "none";

         let dothis = 2;
         axios.get(`https://testsshpractice.vercel.app/api/formd?name=${dothis}&valueTaskID=${valueTaskID}&valueEmail=${valueEmail}&valueChains=${valueChains}&valueRCSB=${valueRCSB}&userId=${userId}`)
            .then(function (res) {

            })
            .catch(function (err) {
               console.log(err);
            })
            .finally(function () {
               textContent.style.display = "inline-block";
            });
      } else {
         let selectedLang = lang.value;
         if (selectedLang === "en") {
            showNotification("Please fill the required fields");
         } else {
            showNotification("Необходимо заполнить требуемые поля");
         }
      }
   }
}

function showNotification(message) {
   const notification = document.getElementById("notification");
   notification.innerHTML = message;
   notification.style.display = "block";
   setTimeout(function () {
      notification.style.display = "none";
   }, 3000);
}

window.onbeforeunload = function () {
   document.getElementById("email").value = "";
   document.getElementById("chains").value = "";
   document.getElementById("taskID").value = "";
   //document.getElementById("rcsbPDBID").value = "";
   //document.getElementById("rcsbPDBID").disabled = true;
   //document.getElementById("rcsbPDB").checked = false;
  // document.getElementById("localPDB").checked = true;
   document.getElementById("inputfile").value = null;

   //document.getElementById("showpdb").disabled = true;
   //document.getElementById("hidepdb").disabled = true;

   document.getElementById("lang").value = "ru";
};



// userid
// Функция для получения значения куки по его имени
function getCookie(name) {
   const value = "; " + document.cookie;
   const parts = value.split("; " + name + "=");
   if (parts.length === 2) return parts.pop().split(";").shift();
}

// Функция для установки значения куки
function setCookie(name, value, days) {
   const date = new Date();
   date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
   const expires = "expires=" + date.toUTCString();
   document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Функция для создания и сохранения уникального идентификатора пользователя в куки
function createAndSaveUserIdCookie() {
   // Проверяем, есть ли уже уникальный идентификатор в куках
   let userId = getCookie('user_id');

   if (!userId) {
      // Генерируем случайное число (можно использовать другие методы генерации уникальных идентификаторов)
      userId = Math.random().toString(36).substr(2, 9);
      // Сохраняем уникальный идентификатор в куки на 30 дней
      setCookie('user_id', userId, 30);
   }

   return userId;
}

// Функция для вызова serverless функции
function callServerlessFunction(userId) {
   // Ваш код для вызова serverless функции, используя userId как параметр
   // Например, можно использовать fetch API для отправки запроса на сервер
   fetch('/your-serverless-function-url?userId=' + userId)
      .then(response => response.json())
      .then(data => {
         // Обработка ответа от serverless функции
         console.log(data);
      })
      .catch(error => {
         console.error('Ошибка при вызове serverless функции:', error);
      });
}
