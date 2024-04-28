
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
        prefix: 'vas is das?',
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
        console.log("sectionsString:", sectionString)//append section string to contents
        contents = `- ${contents}${sectionString}`
    })
    return contents;
}



// returns formatted section string literal 
// pass section obj which contains the heading as a string and the content as an array of strings
// return a string literal formatted into markup from section's values
const formatSection = (section) => {
    return `## ${section.heading}${nl}${section.content}${nl}`;
}


//first function called to begin taking user input to create README
async function startPrompt() {

    // get user input as answers object from questions[]
    await inquirer.prompt(questions).then(answers => {
        // we need a strink to hold our markup as it's formatted
        let markupString = '';
        // a dedicated variable for the markup to display the badge of the user's chosen license
        const badge = badges[answers.license.indexOf(choices.find((choice) => choice == answers.license))];
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

        console.log(markupString);
        console.log(colors.brightGreen(`Your raw README.md data is displayed above.${nl}Please review for a momment.`));
        let count = 0;
        let counter = ``
        setInterval(() => {
            if (count < 6) {
                count++;
                counter = `${counter}.`
                process.stdout.write(counter)
            } else {
                process.stdout.write('');
                savePrompt(markupString);
            }
        }, 500)


    })

}

const foo = async evt => {
    // do something with evt
}

const savePrompt = async data => {

    const savePrompt = {
        type: 'confirm',
        name: 'save',
        message: 'Is your read me ready to save?',
        validate: validateInput,
        filter: filterInput,
    };

    await inquirer.prompt(savePrompt).then(answer => {
        if (answer.save) {
            fs.writeFile(`README.md`, data, (err) => {
                err ? console.error(err) : console.log(colors.green('README created!'));
            })
        }
    });

};

function logger(log) {
    if (Arrray.isArray(log)) {
        log.map(entry => {
            if (typeof entry === 'object') {
                console.log(`colors.${entry}
            }
        })
    }
}
startPrompt();