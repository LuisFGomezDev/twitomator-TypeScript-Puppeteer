import puppeteer from 'puppeteer'
import { username, password } from './secrets'

const randomIntFromInterval = (min: number, max: number) => { // min inclusive and max exclusive
	return Math.floor(Math.random() * (max - min) + min);
}

let sleep_for = async (page: puppeteer.Page, min: number, max: number) => {
	let sleep_duration = randomIntFromInterval(min, max);
	console.log('waiting for ', sleep_duration / 1000, 'seconds');
	await page.waitForTimeout(sleep_duration); // simulate some quasi human behaviour
}


let authenticate = async (page: puppeteer.Page) => {
	try {
		const un_inputs = await page.$x(`//input[@name='session[username_or_email]']`)
		if (un_inputs.length > 0) {
			await un_inputs[0].focus()
			await page.keyboard.type(username)
			// await page.screenshot({path: 'screenshot-002-after-username.png'})
		}
		const pw_inputs = await page.$x(`//input[@name="session[password]"]`)
		if (pw_inputs.length > 0) {
			await pw_inputs[0].focus()
			await page.keyboard.type(password)
			// await page.screenshot({path: 'screenshot-003-after-password.png'})
		}
		const login_buttons = await page.$x(`//div[@role='button']//span[text()='Log in']`)
		if (login_buttons.length > 0) {
			await login_buttons[0].click()
			// await page.click("button[type=submit]")
			// await page.waitForNavigation({ waitUntil: 'networkidle0' })
			// await page.screenshot({path: 'screenshot-004-after-click-login.png'})
		}
	} catch (e) {
		console.log("Errrror in authenticate: ", e)
	}
}

let navigateToPage = async (page: puppeteer.Page, URL: string) => {
	await page.goto(URL, { waitUntil: 'networkidle2' });
	await sleep_for(page, 1000, 2000);
	// const divs = await page.$x(`//div[@aria-label="Timeline: Liked by"]/div/div`)
	const names = await page.$x(`//div[@aria-label="Timeline: Liked by"]/div/div/div/div/div/div[2]/div[1]/div[1]`)
	let lines: string[] = [];
	if (names.length > 0) {
		for (let i = 0; i < names.length; i++) {
			let name = await page.evaluate(element => element.innerText, names[i]) as string;
			name = name.replace(/(\r\n|\n|\r)/gm, " "); // remove new lines
			console.log('liked by: ', name);
			lines.push(name);
		}
	}
	return lines;
}

function shuffle(array: string[]) {
	var currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

let main_actual = async () => {
	try {
		// const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized', '--window-size=1920,1040'] });        
		const browser = await puppeteer.launch({ headless: false })
		const page = await browser.newPage()
		const URL = 'https://twitter.com/login'
		await page.setViewport({
			width: 1280,
			height: 800,
			// width:0, height:0,
			deviceScaleFactor: 1,
		});
		await page.goto(URL, { waitUntil: 'networkidle2' })
		await sleep_for(page, 1000, 2000)
		await authenticate(page)
		await sleep_for(page, 500, 1000)
		let names = await navigateToPage(page, "https://twitter.com/indy_with/status/1401990319529463815/likes")
		let winners1 = names.filter(name => name.includes('Follows you'));
		// console.table(winners1);
		let winners2 = shuffle(winners1).slice(0, 3);
		console.log("\n\n******** Winners are\n\n");
		console.table(winners2);
	} catch (e) {
		console.log(e)
	}
}


let main = async () => {
	await main_actual()
}

main()
