
//#region Consts 
const inquirer = require("inquirer");
const colors = require("colors");
const fs = require('fs');

// Array of formatted badges 
const badges = [`[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`,
    `[![License](https://img.shields.io/badge/License-Boost_1.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)`,
    `[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)`,
    `[![License](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)`,
    `[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)`,
    `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`,];

// Array of choices for badges
const badgeChoices = ['apache', 'boost', 'bsd3', 'bsd2', 'creative commons 0', 'MIT'];
const editorWarn = `${colors.brightYellow(` (Choose save when exiting the editor for your content to transfer.) 
`)}`

// validateInput is used in every prompt
const validateInput = (input) => {
    if (!input.length) {
        return 'Input required';
    }
    return true;
}

// filterInput is used in every prompt
const filterInput = (input) => {
    return input.trim();
}

// Array containing all questions for building README
const questions = [
    {//  projectPrompt  
        type: `input`,
        name: `projectName`,
        //  prefix: 'vas is das?',
        message: `What's the name of your project?`,
        validate: validateInput,
        filter: filterInput,
    },

    {//  descriptionPrompt  
        type: `input`,//,
        name: `description`,
        message: `Please describle your project.`,
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: filterInput,

    },

    {//installPrompt  
        type: 'input`,//',
        name: 'install',
        message: 'Please list any installation instructions.',
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: filterInput,

    },

    {// usagePrompt  
        type: 'input`,//',
        name: 'usage',
        message: `What is your projects intended usage?`,
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: filterInput,

    },

    {// licensePrompt  
        type: 'list',
        name: 'license',
        message: 'Please select the license you will be using for this project.',

        choices: badgeChoices,
        validate: validateInput,
        filter: filterInput,
    },

    {// contributingPrompt  
        type: 'input`,//',
        name: 'contributing',
        message: 'Please list contribution guidelines.',
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: filterInput,

    },

    {// testPrompt  
        type: `input`,//,
        name: `tests`,
        message: 'Please list any tests.',
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: filterInput,

    },

    {//  githubPrompt  
        type: `input`,
        name: `github`,
        message: 'Please provide your github username.',
        validate: validateInput,
        filter: filterInput,

    },

    {//  emailPrompt  
        type: `input`,
        name: `email`,
        message: `Please enter your email address.`,
        validate: (email) => {
            // regex expression to check for valid email formatting.  Sourced from all over google
            let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!regex.test(email)) return `Inavlid email.`

            return true;
        },
        filter: filterInput,

    },

]


// nl  a string literal new line;
const nl = `
`;

//# endregion

//create table of contents from array of sections
const createTableOfContents = (sections) => {
    let contents = ``
    sections.forEach(section => {
        let headingLink = section.heading.replaceAll(' ', "-");
        let sectionString = `${nl}[${section.heading}](#${headingLink})${nl}`;
        //append section string to contents
        contents = `- ${contents}${sectionString}`
    })
    return contents;
}



// returns formatted section string literal 
// pass section obj which contains the heading as a string and the content as an array of strings
// return a string literal formatted into markup from section's values
const formatSection = (section) => {
    return `## ${section.heading}${nl}${section.content}${nl}${nl}`;
}


//first function called to begin taking user input to create README
async function startPrompt() {

    // get user input as answers object from questions[]
    await inquirer.prompt(questions).then(answers => {
        // we need a strink to hold our markup as it's formatted
        let markupString = '';
        // a dedicated variable for the markup to display the badge of the user's chosen license
        const badge = badges[answers.license.indexOf(badgeChoices.find((choice) => choice == answers.license))];
        // we need to store our projectName, it is not formatted the same as sections and has no content
        const projectName = `# ${answers.projectName}${nl}`
        // an array of all section objs containing heading and their content
        const sections = [
            { heading: "DESCRIPTION", content: answers.description },
            { heading: "INSTALLATION", content: answers.install },
            { heading: "USAGE", content: answers.usage },
            { heading: "LICENSE", content: `This project uses the ${answers.license} license` },
            { heading: "CONTRIBUTING", content: answers.contributing },
            { heading: "TESTS", content: `\`\`\`${nl}${answers.tests}${nl}\`\`\`` },
            { heading: "GITHUB", content: `https://github.com/${answers.github}` },
            { heading: "QUESTIONS", content: `I can be reached by email:${nl}${answers.email}` }
        ]

        let contentsString = createTableOfContents(sections);
        sections.forEach(section => {
            /* 
                formatSection takes an answer object and creates a string literal to serve as the entire heading and content of a section
                the result is appended to markupString using string literals
            */
            markupString = `${markupString}${formatSection(section)}`
        })

        // using string literals, add the badge, project name, and contents to the beginning of markupString
        markupString = `${badge}${nl}${projectName}${nl}## Contents${nl}${contentsString}${nl}${markupString}`;

        logger(markupString, 'bgGray')
        logger(`Your raw README.md data is displayed above.  Please review for a momment.`, `bgGreen`);
        setUpSavePromp(markupString);

    })

}

const foo = async evt => {
    // do something with evt
}

const setUpSavePromp = (data) => {
    let count = 0;
    let counter = `-Waiting`
    let interval = setInterval(() => {
        if (count < 30) {
            count++;
            counter = `${counter}#`
            process.stdout.cursorTo(0);
            process.stdout.write(counter)
            process.stdout.cursorTo(0);
        } else {
            process.stdout.clearLine();
            process.stdout.write('-Done!');
            process.stdout.cursorTo(0);
            clearInterval(interval);
            return savePrompt(data);

        }
    }, 100);

}

const savePrompt = async data => {

    const savePrompt = {
        type: 'confirm',
        name: 'save',
        message: 'Is your read me ready to save?',
        validate: (input) => {
            if (input.toLowerCase() != 'y' && input.toLowerCase() != 'n') {
                return 'Enter y or n please';
            } else return false(msg);
        },
        filter: filterInput,
    };

    await inquirer.prompt(savePrompt).then(answer => {
        if (answer.save) {
            fs.writeFile(`README.md`, data, (err) => {
                err ? console.error(err) : logger('README created!', 'green');

                logger('Bye bye!', 'bgCyan');
            })
        } else {
            handleNotReadyForSave(data)
        }
    });

};

const handleNotReadyForSave = async (data) => {
    const restartPrompt = {
        type: 'confirm',
        name: 'restartPrompt',
        message: 'Would you like to restart or exit?',
        validate: validateInput,
        filter: filterInput,
    }

    await inquirer.prompt(restartPrompt).then(answer => {
        if (answer.restartPrompt) {
            logger('Restarting your README', 'yellow');
            startPrompt();
        } else {
            logger('Bye bye!', 'bgCyan');
        }
    })
}


function findColor(msg, color) {
    switch (color) {
        case `black`: return colors.black(msg);
        case `red`: return colors.red(msg);
        case `green`: return colors.green(msg);
        case `yellow`: return colors.yellow(msg);
        case `blue`: return colors.blue(msg);
        case `magenta`: return colors.magenta(msg);
        case `cyan`: return colors.cyan(msg);
        case `white`: return colors.white(msg);
        case `gray`: return colors.gray(msg);
        case `grey`: return colors.grey(msg);
        case `brightRed`: return colors.brightRed(msg);
        case `brightGreen`: return colors.brightGreen(msg);
        case `brightYellow`: return colors.brightYellow(msg);
        case `brightBlue`: return colors.brightBlue(msg);
        case `brightMagenta`: return colors.brightMagenta(msg);
        case `brightCyan`: return colors.brightCyan(msg);
        case `brightWhite`: return colors.brightWhite(msg);
        case `bgBlack`: return colors.bgBlack(msg);
        case `bgRed`: return colors.bgRed(msg);
        case `bgGreen`: return colors.bgGreen(msg);
        case `bgYellow`: return colors.bgYellow(msg);
        case `bgBlue`: return colorsg.bgBlue(msg);
        case `bgMagenta`: return colors.bgMagenta(msg);
        case `bgCyan`: return colors.bgCyan(msg);
        case `bgWhite`: return colors.bgWhite(msg);
        case `bgGray`: return colors.bgGray(msg);
        case `bgGrey`: return colors.bgGrey(msg);
        case `bgBrightRed`: return colors.bgBrightRed(msg);
        case `bgBrightGreen`: return colors.bgBrightGreen(msg);
        case `bgBrightYellow`: return colors.bgBrightYellow(msg);
        case `bgBrightBlue`: return colors.bgBrightBlue(msg);
        case `bgBrightMagenta`: return colors.bgBrightMagenta(msg);
        case `bgBrightCyan`: return colorsg.bgBrightCyan(msg);
        case `bgBrightWhite`: return colors.bgBrightWhite(msg);

        default: return msg;
    }
}


//pretty console logs, less typing
function logger(msg, color) {

    if (color) {
        console.log(findColor(msg, color));
    } else {
        console.log(msg);
    }

}
startPrompt();