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

const addContentPrompt = {
    type: "confirm",
    name: "incomplete",
    message: "Add more lines to this content section?",
}

const contentPrompt = {
    type: "input",
    name: "content",
    message: `Compose your content for this section`
}

const installPrompt = {
    type: 'input',
    name: 'install',
    message: 'Please list any installation steps'
};

const usagePrompt = {
    type: 'input',
    name: 'usage',
    message: 'What is your projects intended usage?',
}

const licensePrompt = {
    type: 'list',
    name: 'license',
    message: 'Please select the license you will be using for this project',
    choices: choices,
}

const contributingPrompt = {
    type: 'input',
    name: 'contributing',
    message: 'Please list contribution guidelines',
}

const testPrompt = {
    type: "input",
    name: "tests",
    message: 'Please list any tests',
}

const questionsPrompot = {
    type: "input",
    name: "questions",
    message: 'Please list any common questions may be answered.'
}
const githubPrompt = {
    type: "input",
    name: "github",
    message: 'Please provide your github username.'
}


// in README markups two empty characters ('  ') at the end of the line indicates a new line
// <br> can also be used in case the README view does not support ('  ') as a new line escape
//const nl = '  ';
const nl = `<br>`;

// pass data obj which contains the heading as a string and the content as an array of strings


// format content into markup and return
let formatContent = (contentLines) => {
    let content = '';
    console.log(contentLines)
    for (let i = 0; i < contentLines.length; i++) {
        let lineString = JSON.stringify(contentLines[i]);
        // using string literals we can refractor the contentLines array 
        content = `${content}${lineString}${nl}`
    }

    return content;
}

//create table of contents from array of sections
let createContents = (sections) => {
    let contents = ``
    sections.foreach(section => {
        let sectionString = `[${section.heading}](${section.heading.replaceAll(" ", "-")})${nl}`;
        contents = `${contents}${sectionString}`
    })
    return contents;
}
let emailPrompt = {
    type: "input",
    name: "email",
    message: "Please enter your email address"
};

let projectPrompt = {
    type: "editor",
    name: "projectName",
    message: "What's the name of your project?",
    validtate: (err) => { console.log('error validating editor') }
};

let descriptionPrompt = {
    type: "input",
    name: "descripton",
    message: "Please decrible your project",
}

let formatSection = (section) => {
    return `#${section.heading}${nl}${section.content}`;

}

//first function called to begin taking user input to create README
async function startPrompt() {
    let README = {
        project: "",
        sections: [],
        formattedData: ''
    };

    let prompts = [projectPrompt, descriptionPrompt, installPrompt,
        usagePrompt,
        licensePrompt,
        contributingPrompt,
        testPrompt,
        questionsPrompot,
        githubPrompt,
        emailPrompt,
    ];
    // object to store readme data while we prep it for storing

    //
   

    await inquirer.prompt(prompts).then(response => {
        let markupString = '';
        let badge = badges[response.license.indexOf(choices.find((choice) => choice == response.license))];
        let answers = [
            { heading: response.projectName.toUpperCase(), content: response.description },
            { heading: "INSTALLATION", content: response.install },
            { heading: "USAGE", content: response.usage },
            { heading: "LICENSE", content: response.license },
            { heading: "CONTRIBUTING GUIDELINES", content: response.contributing },
            { heading: "TEST INSTRUCTIONS", content: response.tests },
            { heading: "GITHUB", content: response.github },
            { heading: "EMAIL", content: response.email }
        ]
        console.log(answers);
        answers.forEach(answer => {
            // formatSection takes an answer object and creates a string literal to serve as the entire heading and content of a section
            markupString = `${markupString}${formatSection(answer)}`
        })
        // f
        markupString =`${badge}${markupString}`;
        console.log(markupString);


    })

    /*let rdme = { project: response.name };
    let sections = [];
    // README.sections.push({ heading: `${response.heading} Description`, content: response.description });

    if (response.incomplete) {
        sections = generateSection();
        console.log
    }
    debugger;*/



}

async function generateSection(sections) {
    let sectionPrompt = [{
        type: 'input',
        name: 'heading',
        message: "Please enter the heading name for this section"
    }, contentPrompt, {
        type: 'confirm',
        name: 'addSections',
        message: 'Would you like to add more sections?'
    }]


    // content is an arrary of prompt responses that will be formatted in formatContent(commentLines)
    if (!sections) {
        sections = [];
    }
    const response = await inquirer.prompt(sectionPrompt);
    const heading = response.heading;
    const content = [`${response.content}${nl}`];
    const section = { heading, content };
    sections.push(section);
    console.log(response)
    if (response.addSections) {
        return generateSection(sections);
    } else {
        console.log('Returning sections:');
        console.log(sections);
        return sections;
    }
}



//function will call itself if the user wants multiple lines in their content section
async function addContent(content, prompt) {

    console.log(colors.blue('addContent called'))

    return await inquirer.prompt([prompt]).then(response => {
        content.push(response.content);
        return content;
    });

}

function parseContent(content) {

}

startPrompt();
