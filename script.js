window.onload = function()
{
	inputfile.addEventListener("change", (event) => {addFile(event)});
	checkdirectory.addEventListener("click", sendFile);
	showIDbtn.addEventListener("click", showID);
	showtmp.addEventListener("click", getFiles);
	
	const userId = createAndSaveUserIdCookie();
	
	function getFiles()
	{		
		const dothis = 5;
		
		let valueTaskID = '';
		let valueEmail = '';
		let valueChains = '';
		let valueRCSB = '';

		axios
		.get(`https://testsshpractice.vercel.app/name=${dothis}&valueTaskID=${valueTaskID}&valueEmail=${valueEmail}&valueChains=${valueChains}&valueRCSB=${valueRCSB}&userId=${userId}`)
		.then(function(res)
		{
			//result.innerHTML = `${JSON.stringify(res)}`;
			result.innerHTML = 'hwtrw';
		})
		.catch(function(err)
		{
			console.log(err);
		})
		.finally(function()
		{
			console.log("axios list files done");
		});
	}
	
	function showID()
	{
		showNotification(userId);
	}
	
	function addFile(event)
	{
		let data = new FormData();
		
		if (inputfile.files.length > 0) {
			const fileSize = inputfile.files.item(0).size;
			if(fileSize > 1048576)
			{
				
				showNotification("Размер файла должен быть меньше одного мегабайта");
				
				inputfile.value = null;
				return;
			}
		}
		
		const filem = event.target.files[0];
		data.append("filemon",filem);
				
		event.preventDefault();
		
		let valueTaskID = '';
		let valueEmail = '';
		let valueChains = '';
		let valueRCSB = '';
		
		valueTaskID = document.getElementById("taskID").value;
		valueEmail = document.getElementById("email").value;
		valueChains = document.getElementById("chains").value;
		valueRCSB = "empty";
		
		const chainsValue = document.getElementById("chains").value;
				
		const dothis = 0;
		const config =
		{
			headers: {
			'content-type': "multipart/form-data"
			}
		}
				
		const reader = new FileReader();

			// Добавляем обработчик события onload для FileReader
			reader.onload = function(event) {
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
		};
		reader.readAsText(filem);

		axios.post(`https://testsshpractice.vercel.app/api/formd?name=${dothis}&valueTaskID=${valueTaskID}&valueEmail=${valueEmail}&valueChains=${valueChains}&valueRCSB=${valueRCSB}&userId=${userId}`, data, config ).then(function(res)
		{
			data.delete("filemon");
		})
		.catch(function(err)
		{
			console.log(err);
		})
		.finally(function()
		{
			console.log("axios read send file done");
		});
	}
			
	async function sendFile()
	{		
    const emailValue = document.getElementById("email").value;
		const chainsValue = document.getElementById("chains").value;
		const taskIDValue = document.getElementById("taskID").value;
		
		const fInput = document.getElementById("inputfile");
								
		if (emailValue.length != 0
				&& chainsValue.length != 0
				&& taskIDValue.length != 0 
				&& fInput.files.length > 0)
		{
			let valueTaskID = '';
			let valueEmail = '';
			let valueChains = '';
			let valueRCSB = '';
			
			valueTaskID = document.getElementById("taskID").value;
			valueEmail = document.getElementById("email").value;
			valueChains = document.getElementById("chains").value;
			valueRCSB = 'empty';
			
			let uploadBtn = document.getElementById("checkdirectory");	
			uploadBtn.style.display = "none";
			
			let dothis = 2;
			axios.get(`https://testsshpractice.vercel.app/api/formd?name=${dothis}&valueTaskID=${valueTaskID}&valueEmail=${valueEmail}&valueChains=${valueChains}&valueRCSB=${valueRCSB}&userId=${userId}`)
			.then(function(res)
			{

			})
			.catch(function(err)
			{
				console.log(err);
			})
			.finally(function()
			{
				textContent.style.display = "inline-block";
			});
		}
		else
		{
			showNotification("Необходимо заполнить требуемые поля");
		}		
	}
}

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
	  		
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerHTML = message;
  notification.style.display = "block";
  setTimeout(function() {
    notification.style.display = "none";
  }, 5000);
}
	
window.onbeforeunload = function() {		
  document.getElementById("email").value = "";
  document.getElementById("chains").value = "";
  document.getElementById("taskID").value = "";
  document.getElementById("inputfile").value = null;		
};
	
	
		
