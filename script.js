window.onload = function()
{
	inputfile.addEventListener("change", (event) => {addFile(event)});
	checkdirectory.addEventListener("click", sendFile);
	rcsbPDBID.addEventListener("input", addRCSBFile);
	chains.addEventListener("input", chainsCheck);
	lang.addEventListener("change", changeLang);
	printtmp.addEventListener("click", showTMP);
	
	const userId = createAndSaveUserIdCookie();
	
	function showTMP()
	{
 		axios.get(`https://testsshpractice.vercel.app/api/formd?name=5`)
 		.then(function(res)
 		{
 			result.innerHTML = `${JSON.stringify(res)}`;
 		})
 		.catch(function(err)
 		{
			result.innerHTML = err;
 			//console.log(err);
 		})
 		.finally(function()
 		{
			//result.innerHTML = 'axios list files done';
 			//console.log("axios list files done");
 		});
	}
	
	function changeLang()
	{
		let selectedLang = lang.value;
		if(selectedLang === "en")
		{
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
		}
		else
		{
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
	
	function addFile(event)
	{
		let data = new FormData();
		
		if (inputfile.files.length > 0) {
			const fileSize = inputfile.files.item(0).size;
			if(fileSize > 1048576)
			{
				let selectedLang = lang.value;
				if(selectedLang === "en")
				{
					showNotification("File size must be less than one megabyte");
				}
				else
				{
					showNotification("Размер файла должен быть меньше одного мегабайта");
				}
				inputfile.value = null;
				return;
			}
		}
		
		const filem = event.target.files[0];
		data.append("filemon",filem);
		
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
		valueRCSB = document.getElementById("rcsbPDBID").value;
		
		const chainsValue = document.getElementById("chains").value;
		if (isValidChains(chainsValue))
		{
			document.getElementById("showpdb").disabled = false;
		}	
		else
		{
			document.getElementById("showpdb").disabled = true;
		}
		
		const dothis = 0;
		//DEFINE HEADERS
		const config =
		{
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
				
				document.getElementById('chids').innerHTML = ": " + chainsid;
				document.getElementById('chains').disabled = false;
				document.getElementById('chains').value = '';
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
	
	async function addRCSBFile()
	{		
		let valueTaskID = '';
		let valueEmail = '';
		let valueChains = '';
		let valueRCSB = '';
		
		valueTaskID = document.getElementById("taskID").value;
		valueEmail = document.getElementById("email").value;
		valueChains = document.getElementById("chains").value;
		valueRCSB = document.getElementById("rcsbPDBID").value;
		
		document.getElementById("pdbidvalue").value = false;
		
		let pdbIdInput = document.getElementById("rcsbPDBID");
      let pdbId = pdbIdInput.value.trim().toUpperCase();
			
			if(pdbId.length == 0)
			{
				document.getElementById("rcsbPDBID").style.color = '';
				document.getElementById("rcsbPDBID").style.borderColor = '';
				document.getElementById("showpdb").disabled = true;
				document.getElementById('chids').innerHTML = "";
				document.getElementById('chains').value = '';
				document.getElementById('chains').disabled = true;
			}
      else if(pdbId.length > 0 && pdbId.length < 4)
      {
				document.getElementById("rcsbPDBID").style.color = "#ff0000";
				document.getElementById("rcsbPDBID").style.borderColor = "#ff0000";
				document.getElementById("showpdb").disabled = true;
				document.getElementById('chids').innerHTML = "";
				document.getElementById('chains').value = '';
				document.getElementById('chains').disabled = true;
			}
      else if (await isValidPDBID(pdbId)) {
				
				document.getElementById("pdbidvalue").value = true;
				
				document.getElementById("rcsbPDBID").style.color = "#000000";
				document.getElementById("rcsbPDBID").style.borderColor  = '';		
				
				const dothis = 0;
				axios.get(`https://testsshpractice.vercel.app/api/formd?name=${dothis}&valueTaskID=${valueTaskID}&valueEmail=${valueEmail}&valueChains=${valueChains}&valueRCSB=${valueRCSB}&userId=${userId}`)
				.then(function(res)
				{
					document.getElementById("showpdb").disabled = true;
				})
				.catch(function(err)
				{
					console.log(err);
					document.getElementById("showpdb").disabled = true;
				})
				.finally(function()
				{
					console.log("axios read send file done");
					if(isValidChains(valueChains))
						document.getElementById("showpdb").disabled = false;
						
					getChainsID(pdbId)
					.then(asymIdList => {
						document.getElementById('chids').innerHTML = ": " + asymIdList;
						document.getElementById('chains').value = '';
						document.getElementById('chains').disabled = false;
						
					})
					.catch(error => {
						console.error('Произошла ошибка:', error);
					});
				});		
			}
			else
			{				
				document.getElementById("rcsbPDBID").style.color = "#ff0000";
				document.getElementById("rcsbPDBID").style.borderColor = "#ff0000";
				document.getElementById("showpdb").disabled = true;
				document.getElementById('chids').innerHTML = "";
			}
	}
	
	async function sendFile()
	{		
		const emailValue = document.getElementById("email").value;
		const chainsValue = document.getElementById("chains").value;
		const taskIDValue = document.getElementById("taskID").value;
		
		const rcsbPdbInput = document.getElementById("rcsbPDB");
		const localPdbInput = document.getElementById("localPDB");
			
		const fInput = document.getElementById("inputfile");
		
		const pdbIdInput = document.getElementById("rcsbPDBID");
		const pdbId = pdbIdInput.value.trim().toUpperCase();
		
		const isPDBIDok = document.getElementById("pdbidvalue").value;
				
		if (isValidEmail(emailValue) 
				&& isValidChains(chainsValue)
				&& taskIDValue.length != 0 
				&& ((localPdbInput.checked && fInput.files.length > 0) 
				|| (rcsbPdbInput.checked && isPDBIDok)))
		{
			let valueTaskID = '';
			let valueEmail = '';
			let valueChains = '';
			let valueRCSB = '';
			
			valueTaskID = document.getElementById("taskID").value;
			valueEmail = document.getElementById("email").value;
			valueChains = document.getElementById("chains").value;
			valueRCSB = document.getElementById("rcsbPDBID").value;
			
			let uploadBtn = document.getElementById("checkdirectory");
			let textContent = document.getElementById("text-content");
		
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
			let selectedLang = lang.value;
			if(selectedLang === "en")
			{
				showNotification("Please fill the required fields");
			}
			else
			{
				showNotification("Необходимо заполнить требуемые поля");
			}
		}		
	}
	
	async function chainsCheck() {
		const str = document.getElementById("chains").value;
		if(isValidChains(str) === true)
		{				
			document.getElementById("chains").style.borderColor = '';
		}
		else
		{
			document.getElementById("chains").style.borderColor = "#ff0000";
		}
		
		// show hide pdb segment
		let rcsbPdbInput = document.getElementById("rcsbPDB");
		let localPdbInput = document.getElementById("localPDB");
		
		const pdbIdInput = document.getElementById("rcsbPDBID");
		const pdbId = pdbIdInput.value.trim().toUpperCase();
		
		const isPDBIDok = document.getElementById("pdbidvalue").value;
						
		if(isValidChains(str) && 
		((localPdbInput.checked && inputfile.files.length > 0) ||
		(rcsbPdbInput.checked && isPDBIDok)))
		{
			document.getElementById("showpdb").disabled = false;
		}
		else
		{
			document.getElementById("showpdb").disabled = true;
		}
	}
}
			
	function isValidEmail(str) {
		return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(str);
	}
		
	function emailCheck() {
		const str = document.getElementById("email").value;
		document.getElementById("email").style.borderColor = '';
		if(isValidEmail(str) === false) {				
			document.getElementById("email").style.borderColor = "#ff0000";
		}
	}
	
	function addWordsToSetFromEnd(str, set) {
  let word = '';
  for (let i = str.length - 1; i >= 0; i--) {
        const char = str[i];
    if (char === ' ') {
      // Если встречаем пробел, прекращаем добавление символов в множество
      break;
    } else {
      // Добавляем символ в множество
      set.add(char);
    }
  }
}

		function checkIfContainsAllChars(str, charSet) {
			for (let i = 0; i < str.length; i++) {
				const char = str[i];
				if (!charSet.has(char)) {
					return false;
				}
			}
			return true;
		}
		
	
	function isValidChains(str) {
		
		if(str.length < 3 || str.indexOf(":") === -1)
			return false;
		
		const first = str.split(':')[0];
		const second = str.split(':')[1];
		
		const inputString = document.getElementById("chids").innerHTML;
		const charSet = new Set();
		
		addWordsToSetFromEnd(inputString, charSet);
		
		if(charSet.size < 2)
			return false;
		
		const firstIsValid = checkIfContainsAllChars(first, charSet);
		const secondIsValid = checkIfContainsAllChars(second, charSet);
		

		const isValid = firstIsValid && secondIsValid;
		if(!isValid)
			return false;
		
		return /^(?:([A-Z])(?!.*\1)){1,}:(?:([A-Z])(?!.*\2)){1,}$/.test(str);
	}
	
	async function isValidPDBID(pdbId) {
				
		const pdbIdPattern = /^[A-Z0-9]{4}$/;

		if (!pdbIdPattern.test(pdbId)) {
			return false; // The PDB ID format is invalid, return false
		}
		try {
			const response = await fetch(`https://files.rcsb.org/download/${pdbId}.pdb`);
			if (response.status === 200) {
				return true; // The PDB ID exists, return true
			} else {
				return false; // The PDB ID does not exist, return false
			}
		} catch (error) {
			return false; // An error occurred during the API call, return false
		}
	}
	    
	function handleRadioChange() {
		let rcsbPdbInput = document.getElementById("rcsbPDB");
		let localPdbInput = document.getElementById("localPDB");

		if (rcsbPdbInput.checked)
		{
			//document.getElementById("rcsbPDBID").value = "";
			document.getElementById("rcsbPDBID").disabled = false;
			document.getElementById("rcsbPDBID").style.color = "#000000";
			document.getElementById("rcsbPDBID").style.borderColor = "#000000";
			
			document.getElementById("inputfile").disabled = true;
			document.getElementById("inputfile").value = null;
			
			document.getElementById("showpdb").disabled = true;
			
			document.getElementById('myViewer').style.display = "none";
      document.getElementById('hidepdb').disabled = true;
      
      document.getElementById('chids').innerHTML = "";
      
      document.getElementById("chains").value = "";
      
      document.getElementById("pdbidvalue").value = false;
		}
		else if (localPdbInput.checked)
		{
			document.getElementById("rcsbPDBID").value = "";
			document.getElementById("rcsbPDBID").disabled = true;
			document.getElementById("rcsbPDBID").style.color = "#D3D3D3";
			document.getElementById("rcsbPDBID").style.borderColor = "#D3D3D3";
			
			document.getElementById("inputfile").disabled = false;
			document.getElementById("inputfile").value = null;
			
			document.getElementById("showpdb").disabled = true;
			
			document.getElementById('myViewer').style.display = "none";
      document.getElementById('hidepdb').disabled = true;
      
      document.getElementById('chids').innerHTML = "";
      
      document.getElementById("chains").value = "";
      
      document.getElementById("pdbidvalue").value = false;
		}
	}
		
	function showNotification(message) {
		const notification = document.getElementById("notification");
		notification.innerHTML = message;
		notification.style.display = "block";
		setTimeout(function() {
			notification.style.display = "none";
		}, 3000);
	}
	
	window.onbeforeunload = function() {		
		document.getElementById("email").value = "";
		document.getElementById("chains").value = "";
		document.getElementById("taskID").value = "";
		document.getElementById("rcsbPDBID").value = "";
		document.getElementById("rcsbPDBID").disabled = true;
		document.getElementById("rcsbPDB").checked = false;
		document.getElementById("localPDB").checked = true;
		document.getElementById("inputfile").value = null;
		
		document.getElementById("showpdb").disabled = true;
		document.getElementById("hidepdb").disabled = true;
		
		document.getElementById("lang").value = "ru";
	};
	
	
		let viewerInstance = new PDBeMolstarPlugin();
		
		//viewerInstance.events.loadComplete.subscribe(() => { selectStructure(); });
		
		let counter = 0;
		function loadStructure(event) {
				event.preventDefault();
				
				let rcsbPdbInput = document.getElementById("rcsbPDB");
				let localPdbInput = document.getElementById("localPDB");

        let viewerContainer = document.getElementById('myViewer');

        let pdbIdInit = document.getElementById('rcsbPDBID').value;
        let pdbId = pdbIdInit.trim().toLowerCase();
				document.getElementById('myViewer').style.display = "inline";
				
								
				if (rcsbPdbInput.checked)
				{
					let options = {
									moleculeId: pdbId,
									bgColor: { r: 255, g: 255, b: 255 },
									pdbeLink: false,
									hideStructure: ['water', 'nonStandard', 'carbs', 'het'],
									hideControls: true
								};
							if(counter > 0)
							{
								viewerInstance.visual.update(options, true);
								viewerContainer.style.display = 'block';
								document.getElementById("hidepdb").disabled = false;
								setTimeout(selectStructure, 2000);
								return;
							}
							else {

							viewerInstance.render(viewerContainer, options);
							viewerContainer.style.display = 'block';
							document.getElementById("hidepdb").disabled = false;
							++counter;
							setTimeout(selectStructure, 2000);
							
					}
				}
				else if(localPdbInput.checked)
				{
					
					const linkElement = document.getElementById('downloadlink').value;					
					let options = {
									customData: { url: linkElement, format: 'pdb'},
									bgColor: { r: 255, g: 255, b: 255 },
									pdbeLink: false,
									hideStructure: ['water', 'nonStandard', 'carbs', 'het'],
									hideControls: true
								};
							if(counter > 0)
							{
								
								viewerInstance.visual.update(options, true);
								viewerContainer.style.display = 'block';
								document.getElementById("hidepdb").disabled = false;
								setTimeout(selectStructure, 2000);
								return;
							}
							else {

							viewerInstance.render(viewerContainer, options);
							viewerContainer.style.display = 'block';
							document.getElementById("hidepdb").disabled = false;
							++counter;
							setTimeout(selectStructure, 2000);
				}
			}
		}
		
		function selectStructure() {
			  
			  const str = document.getElementById("chains").value;
			  const first = str.split(':')[0];
				const second = str.split(':')[1];
				
				const result = []; // Массив данных для передачи в метод select

				Array.from(first).forEach(item => {
					const obj = {
						struct_asym_id: item,
						color: { r: 255, g: 66, b: 68 }
					};
					
					result.push(obj);
				});
				
				// representation: 'ball-and-stick',
				Array.from(second).forEach(item => {
					const obj = {
						struct_asym_id: item,
						color: { r: 28, g: 153, b: 116 }
						
					};
					// focus: true
					result.push(obj);
				});
				
				const params = {
					data: result,
					nonSelectedColor: { r: 255, g: 255, b: 255 }
				};
				//viewerInstance.visual.visibility({polymer:true})
				viewerInstance.visual.select(params);
				//viewerInstance.visual.visibility({polymer:true});
			  
        /*viewerInstance.visual.select(
          
          { data:
          
           [{struct_asym_id: 'A', color:{r:255,g:0,b:0}},
           {struct_asym_id: 'B', color:{r:255,g:0,b:0}, focus: true}],
           
            nonSelectedColor: {r:255,g:255,b:255} });*/
        	
				
			}
      
      function hideStructure(event) {
				event.preventDefault();
        document.getElementById('myViewer').style.display = "none";
        document.getElementById('hidepdb').disabled = true;
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

