const fs = require('fs');
const ssh2 = require('ssh2');
const tmp = require('tmp');
const cp = require('cp');
const axios = require('axios'); 
const formidable = require('formidable');

module.exports = async (req, res) =>
{
	const form = formidable({multiples: true, keepExtensions: true});
		
	const name = req.query.name;
	const taskID = req.query.valueTaskID;
	const email = req.query.valueEmail;
	const chains = req.query.valueChains;
	const rcsb = req.query.valueRCSB;
	const userid = req.query.userId;

	if(name == 0)
	{
		form.parse(req, (err, fields, files) =>
		{	
				let oldpath = ''; // 0
				//let newpath = ''; // 1
				let txtpath = ''; // 2

				let pdbname = ''; // 3
				let txtname = ''; // 4

				let uniquepdbname = ''; // 5
				let uniquetxtname = ''; // 6
								
				oldpath = files.filemon.path;
				pdbname = files.filemon.name;
				txtname = pdbname.substring(0, pdbname.length-3) + "dat";
				
				uniquepdbname = oldpath.substring(5, oldpath.length);
				uniquetxtname = oldpath.substring(5, oldpath.length-3) + "dat";
				
				// prod
				newpath = "/tmp/" + userid + ".pdb";
				txtpath = "/tmp/" + userid + ".dat";
				let utxtpath = "/tmp/" + uniquetxtname;
				
				tmp.file(function _tempFileCreated(err, txtpath, fd, cleanupCallback)
				{
					if(err)
					{
						console.error(err);
					}
				});
				
				tmp.file(function _tempFileCreated(err, utxtpath, fd, cleanupCallback)
				{
					if(err)
					{
						console.error(err);
					}
				});
																
				//cp(oldpath, newpath, function(err) {});
				
				const currentDate = new Date();
				const hours = currentDate.getHours();
				const minutes = currentDate.getMinutes();
				const seconds = currentDate.getSeconds();

				const currentTimeAsString = `${hours}:${minutes}:${seconds}`;
				
				const cdate = new Date().toLocaleDateString("ru-RU");
				const content = "txtname:\t" + txtname + "\n" 
											+ "utxtname:\t" + uniquetxtname + "\n"
											+ "pdbname:\t" + pdbname + "\n" 
											+ "updbname:\t" + uniquepdbname + "\n" 
											+ "date:\t" + cdate + "\n"
											+ "time:\t" + currentTimeAsString + "\n" 
											+ "userid:\t" + userid + "\n";
													
				fs.writeFile(txtpath, content, err =>
				{
					if(err)
					{
						console.error(err);
					}
				});
				
				fs.writeFile(utxtpath, content, err =>
					{
						if(err)
						{
							console.error(err);
						}
					});
					
				return res.end();			
		});
	}
	else if(name == 2)
	{		
		const localPathTXT = `/tmp/${userid}.dat`;			
		const extradata = `taskID:\t${taskID}\nemail:\t${email}\nchains:\t${chains}\n`;
		fs.readFile(localPathTXT, 'utf8', function(err, data)
		{	
			const array = data.toString().split('\n');
			const namesplittxt = array[1].split('\t');
			const nlp = `/tmp/${namesplittxt[1]}`;
		
			fs.appendFile(nlp, extradata, (err) => {
				if (err) {
					console.log(err);
				}
				else
				{
					return res.end();	
				}
			});
		});	
	}
	else if(name == 5) {
		let arrrayfiles = fs.readdirSync("/tmp", {withFileTypes: true}).filter(item => !item.isDirectory()).map(item => item.name);

		//res.writeHead(200, {"content-type" : "text/plain"});
		//res.write(" READING FILES IN DIRECTORY : ");
		res.write(String(arrrayfiles));
		res.end();
	}
	else if(name == 6)
	{			
		let arrrayfiles = fs.readdirSync("/tmp", {withFileTypes: true}).filter(item => !item.isDirectory()).map(item => item.name);
		arrrayfiles.forEach(file => {
		if(file.startsWith('upload')) {		
			const lpTXT = '/tmp/' + file;	
			const rpTXT = '/home/poluyan/testssh/uploads/' + file;
					
			const fileStream1 = fs.createReadStream(lpTXT);

			const conn1 = new ssh2.Client();
			conn1.on('ready', () => {
				conn1.sftp((err, sftp) => {
					if (err) throw err;
					const writeStream1 = sftp.createWriteStream(rpTXT);
			
					fileStream1.pipe(writeStream1);
			
					writeStream1.on('close', () => {
							console.log('Файл успешно передан');
							conn1.end();
						});
					});
				}).connect({
					host: '159.93.166.207',
					username: 'poluyan',
					password: '0H5W0xj1'
				});
			}
		});
		//res.status(200).send("ok");
	}
};
