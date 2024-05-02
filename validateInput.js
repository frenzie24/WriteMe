// validateInput is used in every prompt
const validateInput = (input) => {
    if (!input.length) {
        return 'Input required';
    }
    return true;
};
exports.validateInput = validateInput;
