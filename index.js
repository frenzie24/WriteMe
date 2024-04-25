const inquirer = require("inquirer");
const colors = require("colors");
const fs = require('fs');




const addContentPrompt = {
    type: "confirm",
    name: "incomplete",
    message: "Add more lines to this content section?",
}

const contentPrompt = {
    type: "input",
    name: "content",
    message: `Enter new line of content`
}

const installPrompt = {
    type: 'confirm',
    name: 'install',
    message: 'Are there any installation steps for your project?'
};


const installMorePrompt = {
    type: 'input',
    name: 'installMore',
    message: 'Are there any more installation steps for your project?'
};

// in README markups two empty characters ('  ') at the end of the line indicates a new line
// <br> can also be used in case the README view does not support ('  ') as a new line escape
//const nl = '  ';
const nl = `<br>`;

// pass data obj which contains the heading as a string and the content as an array of strings
let formatSections = (data) => {

    let content = formatContent(data.content);

    return `#${data.heading}${nl}${content}${nl}`;
}

// format content into markup and return
let formatContent = (contentLines) => {
    let content = '';
    contentLines.foreach(line => {
        let lineString = JSON.stringify(line);
        // using string literals we can refractor the contentLines array 
        content = `${content}${lineString}${nl}`
    });
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


//first function called to begin taking user input to create README
async function startPrompt() {
    let README = {
        project: "",
        sections: [],
        formattedData: ''
    };

    let startPrompt = [{
        type: "input",
        name: "projectName",
        message: "What's the name of your project?",
    }, {
        type: "input",
        name: "descripton",
        message: "Please decrible your project",
    }, {
        type: "confirm",
        name: "incomplete",
        message: "Would you like to make some sections?",

    }];
    // object to store readme data while we prep it for storing

    //
    README.sections = await inquirer.prompt(startPrompt).then(response => {
        let rdme = { project: response.name };
        let sections = [];
        // README.sections.push({ heading: `${response.heading} Description`, content: response.description });

        if (response.incomplete) {
            sections.push(generateSectionA());
        }
        debugger;
    })


}

async function generateSection() {
    let sectionPrompt = [{
        type: 'input',
        name: 'heading',
        message: "Please enter the heading name for this section"
    }, {
        type: "editor",
        name: "content",
        message: `Please enter first line of content`
    }]


    // content is an arrary of prompt responses that will be formatted in formatContent(commentLines)
   
    return await inquirer.prompt(sectionPrompt).then(response => {
        // set content to resopnse.content
        let heading = response.heading;
        let content = [(`${response.content}${nl}`)];
        // push response.content onto the content array. if they user wishes to continue call addContent

        if (response.incomplete == true) {

            return {heading: heading, content: content.push(addContent(content, contentPrompt))}
          
        } else {
            return  {heading: heading, content: content};
        }

        console.log('content:', content);
        console.log("section", { heading: heading, content: content })
        return { heading: heading, content: content };
        //ask the user if they want to add more lines to the content section
        /*  inquirer.prompt(addContentPrompt).then(response => {
             
          });*/
    });
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
