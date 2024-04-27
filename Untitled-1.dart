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
        message: "What's the name of your project?",
        validate: (projectName) => {
            if (!projectName.length) {
                return 'Input required';
            }

            return true;
        },
        filter: (projectName) => {
            return projectName.trim();
        }
    },

{//  descriptionPrompt  
    type: "editor",
        name: "description",
            message: "Please decrible your project",
            
},
{//installPrompt  
    type: 'input',
        name: 'install',
            message: 'Please list any installation steps'
},

{// usagePrompt  
    type: 'input',
        name: 'usage',
            message: 'What is your projects intended usage?',
   },

{// licensePrompt  
    type: 'list',
        name: 'license',
            message: 'Please select the license you will be using for this project',
                choices: choices,
   },

{// contributingPrompt  
    type: 'editor',
        name: 'contributing',
            message: 'Please list contribution guidelines',
   },

{// testPrompt  
    type: "editor",
        name: "tests",
            message: 'Please list any tests',
   },

{//  githubPrompt  
    type: "input",
        name: "github",
            message: 'Please provide your github username.'
},

{//  emailPrompt  
    type: "input",
        name: "email",
            message: "Please enter your email address"
},
   ]