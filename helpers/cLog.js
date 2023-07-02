// customerized console.log with time in HH:MM:SS format, for better logging
const cLog = (input) => {
    let date = new Date();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');  
    let string = `[${hours}:${minutes}:${seconds}] ${input}`;
    console.log(string);  
};

module.exports = cLog;