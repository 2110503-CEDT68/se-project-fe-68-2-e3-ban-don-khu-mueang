function getCurrentGreeting() {
    const currentHour = new Date().getHours();
    console.log(currentHour);
    //convert to utc+7
    const utc7Hour = (currentHour + 7) % 24;
    
    let greetingMessage;

    if (utc7Hour < 12) {
        greetingMessage = "Good Morning";
    } else if (utc7Hour < 18) {
        greetingMessage = "Good Afternoon";
    } else {
        greetingMessage = "Good Evening";
    }

    return greetingMessage;
}

export default getCurrentGreeting;