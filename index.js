const inquirer = require("inquirer");
const colors = require("colors");
const fs = require('fs');


const badges = [`[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`,
    `[![License](https://img.shields.io/badge/License-Boost_1.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)`,
    `[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)`,
    `[![License](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)`,
    `[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)`,
    `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`,];

const choices = ['apache', 'boost', 'bsd3', 'bsd2', 'creative commons 0', 'MIT'];
const editorWarn = `${colors.brightYellow(` (Choose save when exiting the editor for your content to transfer.) 
`)}`
const validateInput = (input) => {
    if (!input.length) {
        return 'Input required';
    }

    return true;
}

const questions = [
    {//  projectPrompt  
        type: "input",
        name: "projectName",
        prefix: 'vas is das?',
        message: "What's the name of your project?",
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }
    },
/*
    {//  descriptionPrompt  
        type: "editor",
        name: "description",
        message: "Please describle your project.",
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }

    },

    {//installPrompt  
        type: 'editor',
        name: 'install',
        message: 'Please list any installation instructions.',
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }

    },

    {// usagePrompt  
        type: 'editor',
        name: 'usage',
        message: `What is your projects intended usage?`,
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }

    },

    {// licensePrompt  
        type: 'list',
        name: 'license',
        message: 'Please select the license you will be using for this project.',

        choices: choices,
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }
    },

    {// contributingPrompt  
        type: 'editor',
        name: 'contributing',
        message: 'Please list contribution guidelines.',
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }

    },

    {// testPrompt  
        type: "editor",
        name: "tests",
        message: 'Please list any tests.',
        suffix: `${editorWarn}`,
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }

    },

    {//  githubPrompt  
        type: "input",
        name: "github",
        message: 'Please provide your github username.',
        validate: validateInput,
        filter: (input) => {
            return input.trim();
        }

    },

    {//  emailPrompt  
        type: "input",
        name: "email",
        message: "Please enter your email address.",
        validate: (email) => {
            // regex expression to check for valid email formatting.  Sourced from all over google
            let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!regex.test(email)) return "Inavlid email."

            return true;
        },
        filter: (input) => {
            return input.trim();
        }

    },
    */
]

// in README markups two empty characters ('  ') at the end of the line indicates a new line
// <br> can also be used in case the README view does not support ('  ') as a new line escape
//const nl = '  ';
const nl = `
`;

// pass data obj which contains the heading as a string and the content as an array of strings
// format content into markup and return


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

//
const confirmAnswerValidator = (type) => {

}



// returns formatted section string literal 
const formatSection = (section) => {
    return `## ${section.heading}${nl}${section.content}${nl}`;

}

//first function called to begin taking user input to create README
async function startPrompt() {
    const README = {
        project: "",
        sections: [],
        formattedData: ''
    };

    // object to store readme data while we prep it for storing

    //

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
            { heading: "CONTRIBUTING GUIDELINES", content: answers.contributing },
            { heading: "TEST INSTRUCTIONS", content: `\`\`\`${nl}${answers.tests}${nl}\`\`\`` },
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
        // using string literals, add the badge string, create the table of contents

        markupString = `${badge}${nl}${projectName}${nl}## Contents${contentsString}${nl}${markupString}`;
        console.log(markupString);
        fs.writeFile(`_README.md`, markupString, (err) => {
            err ? console.error(err) : console.log('README created!')
        })

    })

}
startPrompt();