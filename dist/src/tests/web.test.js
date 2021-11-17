/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/tests/web.test.ts":
/*!*******************************!*\
  !*** ./src/tests/web.test.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _jest_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jest/globals */ \"@jest/globals\");\n/* harmony import */ var _jest_globals__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jest_globals__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var puppeteer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! puppeteer */ \"puppeteer\");\n/* harmony import */ var puppeteer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(puppeteer__WEBPACK_IMPORTED_MODULE_1__);\n\n\nlet browser;\n\nconst setupBrowser = async () => {\n  if (!browser) {\n    browser = await (0,puppeteer__WEBPACK_IMPORTED_MODULE_1__.launch)({\n      headless: true\n    });\n  }\n};\n\nconst SITE_URL = 'https://sq-royale-vite-26x.pages.dev';\nconst unregisteredDiscordToken = 'pR9FlM39zGLfdwHgKZiCRxJ4nLQVGl';\nconst registeredDiscordToken = 'GKeRE0ZgaGFeShZYy4o9Wj3Zm2i1hN';\n\nconst generateAuthUrl = (state, token) => `${SITE_URL}/login/auth#state=${state}&access_token=${token}`;\n\n(0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.beforeAll)(async () => {\n  await setupBrowser();\n});\n(0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.afterAll)(async () => {\n  await browser.close();\n});\ndescribe('Logged out Pages', () => {\n  let page;\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.beforeAll)(async () => {\n    page = await browser.pages().then(pages => pages[0]);\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.afterAll)(async () => {\n    await page.close();\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Renders Home Page', async () => {\n    const headerTitle = 'header>div>h1>span';\n    await page.goto(SITE_URL);\n    await page.waitForSelector(headerTitle);\n    const header = await page.$eval(headerTitle, e => e.innerHTML);\n    expect(header).toBe(`Stellar Quest`);\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Renders Sign Up Page', async () => {\n    const signupBtn = '[data-testid=\"signupBtn\"]';\n    await page.goto(SITE_URL);\n    await page.waitForSelector(signupBtn);\n    await Promise.all([page.click(signupBtn), page.waitForNavigation()]);\n    const header = await page.$eval('header>h1', e => e.innerHTML);\n    expect(header).toBe(`Sign Up`);\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Renders Rules Page', async () => {\n    const rulesBtn = '[data-testid=\"rulesBtn\"]';\n    const headerSelector = 'header>div>h1>span';\n    await page.goto(SITE_URL);\n    await page.waitForSelector(rulesBtn);\n    await Promise.all([page.click(rulesBtn), page.waitForNavigation()]);\n    await page.waitForSelector(headerSelector);\n    const header = await page.$eval(headerSelector, e => e.innerHTML);\n    expect(header).toBe(`Stellar Quest`);\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Renders Sign Up page when user attempts to logs in with an unregistered account', async () => {\n    const loginBtn = '[data-testid=\"loginBtn\"]';\n    const headerSelector = 'header>h1';\n    await page.goto(SITE_URL);\n    await page.waitForSelector(loginBtn);\n    const pageTarget = page.target();\n    await page.click(loginBtn);\n    const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);\n    const newPage = await newTarget.page();\n    if (!newPage) throw 'Did not open discord auth page!';\n    const discordTokenState = await page.evaluate(() => {\n      return localStorage.getItem('discordTokenState');\n    });\n    if (!discordTokenState) throw 'Did not set discordTokenState!';\n    await newPage.goto(generateAuthUrl(discordTokenState, unregisteredDiscordToken));\n    await page.waitForSelector(headerSelector);\n    const header = await page.$eval(headerSelector, e => e.innerHTML);\n    expect(header).toBe(`Sign Up`);\n  });\n});\ndescribe('Authentication', () => {\n  let context;\n  let page;\n  const loginBtn = '[data-testid=\"loginBtn\"]';\n  const logoutBtn = '[data-testid=\"logoutBtn\"]';\n  const dashboardNav = '[data-testid=\"dashboardNav\"]';\n  const practiceQuestLink = '[data-testid=\"questCard\"]';\n  const playBtn = '[data-testid=\"playBtn\"]';\n  const verifyBtn = '[data-testid=\"verifyBtn\"]';\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.beforeAll)(async () => {\n    context = await browser.createIncognitoBrowserContext();\n    page = await context.newPage();\n  }); // beforeEach(async () => {\n  //   page = await context.newPage();\n  // });\n  // afterEach(async () => {\n  //   await page.close();\n  // });\n\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.afterAll)(async () => {\n    await page.close();\n    await context.close();\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Log in with Discord Token', async () => {\n    await page.goto(SITE_URL);\n    await page.waitForSelector(loginBtn);\n    const pageTarget = page.target();\n    await page.click(loginBtn);\n    const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);\n    const newPage = await newTarget.page();\n    if (!newPage) throw 'Did not open discord auth page!';\n    const discordTokenState = await page.evaluate(() => {\n      return localStorage.getItem('discordTokenState');\n    });\n    if (!discordTokenState) throw 'Did not set discordTokenState!';\n    await newPage.goto(generateAuthUrl(discordTokenState, registeredDiscordToken));\n    await page.waitForSelector(dashboardNav);\n    const nav = await page.$eval(dashboardNav, e => e.hasChildNodes());\n    expect(nav).toBeTruthy();\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Start practice Quest', async () => {\n    await page.goto(`${SITE_URL}/play`);\n    await page.waitForSelector(practiceQuestLink);\n    await page.$eval(practiceQuestLink, e => {\n      if (e instanceof HTMLElement) {\n        const questLinkElement = e.firstElementChild;\n\n        if (questLinkElement instanceof HTMLElement) {\n          questLinkElement.click();\n        } else {\n          throw 'Quest link does not exist';\n        }\n      } else {\n        throw 'Quest link does not exist';\n      }\n    });\n    await page.waitForSelector(playBtn);\n    await page.$eval(playBtn, e => {\n      if (e instanceof HTMLElement) {\n        e.click();\n      } else {\n        throw 'Play button does not exist';\n      }\n    });\n    await page.waitForSelector(verifyBtn);\n    const verifyBtnPage = await page.$eval(verifyBtn, e => {\n      if (e instanceof HTMLElement) {\n        var _e$firstElementChild;\n\n        return (_e$firstElementChild = e.firstElementChild) === null || _e$firstElementChild === void 0 ? void 0 : _e$firstElementChild.innerHTML;\n      } else {\n        throw 'Verify Solution Button does not exist';\n      }\n    });\n    expect(verifyBtnPage).toBe(`Verify`);\n  });\n  (0,_jest_globals__WEBPACK_IMPORTED_MODULE_0__.test)('Logs user out', async () => {\n    await page.goto(`${SITE_URL}/play`);\n    await page.waitForSelector(dashboardNav);\n    await page.$eval(dashboardNav, e => {\n      if (e instanceof HTMLElement) {\n        const settingsElement = Array.from(e.children).find(e => {\n          return e.getAttribute('href') === '/profile';\n        });\n\n        if (settingsElement instanceof HTMLElement) {\n          settingsElement.click();\n        } else {\n          throw 'Settings link does not exist';\n        }\n      } else {\n        throw 'Dashboard nav does not exist';\n      }\n    });\n    await page.waitForSelector(logoutBtn);\n    await Promise.all([page.click(logoutBtn), page.waitForNavigation()]);\n    await page.waitForSelector(loginBtn);\n    const renderedLoginBtn = await page.$eval(loginBtn, e => e.hasChildNodes());\n    expect(renderedLoginBtn).toBeTruthy();\n  });\n});\n\n//# sourceURL=webpack://sq-e2e-tests/./src/tests/web.test.ts?");

/***/ }),

/***/ "@jest/globals":
/*!********************************!*\
  !*** external "@jest/globals" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@jest/globals");

/***/ }),

/***/ "puppeteer":
/*!****************************!*\
  !*** external "puppeteer" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("puppeteer");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/tests/web.test.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;