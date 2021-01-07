//On load show welcome screen
window.onload = welcome;

//When they're about to leave, save choices as cookies if enabled
window.onbeforeunload = saveCookies;

let played = false; // Animation played

//Cookie Enabled has a default true because:
//Case 1: New User: In this case this value will be changed soon
//Case 2: Returning user: In this case the user would be restoring previous session data so this value will have to have been true.
let cookieEnabled = true;

let nominationList = [];

function welcome(){
    let title = document.getElementById("page-header");
    title.addEventListener("animationend", aniEnd, false);

    if(getCookie(1)!=null){
        console.log("Restoring session");
        // Restore a User's previous session:
        played=true;

        let pholder = document.getElementById("placeholder");
        pholder.classList.add("hidden");
        console.log("Moving up more");

        document.getElementById("page-header").style.animation = "move-up-more 2s forwards";
        document.getElementById("welcome-details").classList.add("hidden");

        // Show Cool Headline
        let headline = document.getElementById("page-heading");
        headline.style.textShadow = "#f5f5f5 1px 0 7px";
        headline.textContent = "🏆 The 1st Annual Shoppie Awards 🏆";

        // Hide the welcome messages
        document.getElementById("welcome-details").classList.add("hidden");

        // Show Main Content
        main = document.getElementById("main");
        main.classList.remove("hidden");
        main.style.animation = "fadein 3s forwards";

        // Show Footer
        document.getElementById("footer").classList.remove("hidden");
        console.log(document.cookie);
        
        for(let i=1; i<=getCookie(1);i++){

            //Update Nomination List
            let nomination = getCookie(` ${i+1}`);
            nominationList.push(nomination);

            //Update panels
            element = document.getElementById(`n${i}`);
            document.getElementById(`n${i}p`).classList.remove("hidden");
            console.log(`${i}. ${nomination}`);
            element.textContent = `${i}. ${nomination}`;
        }
    }
}

function aniEnd(event){ //When the animation is over

    if(played==false){
        document.getElementById("welcome-details").classList.remove("hidden");
        document.getElementById("welcome-details").style.animation = "fadein 1s forwards";
    }
    else{
        // document.getElementById("page-header").style.borderBottom = "1px solid #ededed";
        let headline = document.getElementById("page-heading");
        headline.style.textShadow = "#f5f5f5 1px 0 7px";
        headline.textContent = "🏆 The 1st Annual Shoppie Awards 🏆";
        main = document.getElementById("main");
        main.classList.remove("hidden");
        main.style.animation = "fadein 3s forwards";
        document.getElementById("footer").classList.remove("hidden");

    }
}

function gotIt(){
    document.getElementById("page-header").style.animation = "move-up-more 2s forwards";
    document.getElementById("welcome-details").classList.add("hidden");
    played = true;
    cookieEnabled = document.getElementById("cookieCheck").checked; 
}

//Close welcome screen based on its ID, allows reuse of a single method for closing all the popups.
function closePopup(str){

    //Remove the dark overlay and hide the Welcome Popup
    overlay = document.getElementById("overlay");
    overlay.classList.add("hidden");

    popup = document.getElementById(str);
    popup.classList.add("hidden");
}

//Cookies! To save your nominations for 30 days.
function createCookie(name,value,expiry){ //Expiry in days
    let date = new Date();
    date.setTime(date.getTime()+expiry*24*60*60*1000); //Converted to milliseconds
    let expires = "expires="+date.toUTCString();
    document.cookie = name+"="+value+";"+expires;
}

function getCookie(cookiename) {
    let cookies = document.cookie.split(';');

    for(let i = 0; i < cookies.length; i++) {
        let element = cookies[i].split("=");
        let name = element[0];
        let value = element[1];

        if(name == cookiename){
            return value;
        }
    }
    return null;
}

function checkCookie(){ //Are Cookies enabled
    if(getCookie("enabled")!=null){
        return true;
    }
    else{
        return false;
    }
}

// Information Window
function infoAlert(str){
    overlay = document.getElementById("overlay");
    overlay.classList.remove("hidden");

    popup = document.getElementById("infoAlert");

    let block = document.getElementById("info-block");
    block.innerHTML="";
    for(let i=0; i<str.length;i++){
        m1 = document.createElement("p");
        m1.classList.add("w-text");
        m1.textContent=str[i];
        block.appendChild(m1);
    }

    popup.classList.remove("hidden");
}

async function getMovie(){ //Gets all the movies containing the string from OMDb
    
    //The current movie results
    let currentResult = document.querySelectorAll('.movieResult');
    console.log(currentResult);

    //Removes all current results from the search
    if(currentResult!=null){

        for(let i=0; i<currentResult.length;i++){
            console.log(currentResult[i]);
            currentResult[i].classList.add("hidden");
            console.log(currentResult[i]);
        }
    }

    //Hides the "Find movies by searching..."
    document.getElementById("toHide").classList.add("hidden");
    document.getElementById("loading").classList.remove("hidden");

    let name = document.getElementById('searchMovies').value;
    let element1 = document.getElementById('results');

    //Fetch from OMDb API
    const response = await fetch(`https://www.omdbapi.com/?s=${name}&apikey=b2051952`)

    const data = await response.json();
    
    document.getElementById("loading").classList.add("hidden");

    //This is how a result will look:
    /* <article class="movieResult card">
            <!-- Name -->
            <section>
                <p>Star Wars: A New Hope</p>
                <p class="p2">(1999)</p>
                <br>
                <br>
                <div id="nominate" class="nominate">&#9734; Nominate</div>
                <div id="nominated" class="nominated hidden">&#9733; Nominated!</div>
            </section>
            <img class="poster" src="https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg">
        </article> */

    if (data.Response == "False"){

        document.getElementById("toHide").classList.remove("hidden");
        document.getElementById("findMovieText").textContent = "No such movies were found!";

    }else{
        try {
            data.Search.forEach(element => {
                console.log(element);//for debugging
    
                if(element.Type=="movie"){ // Move Awards so only movies
                    console.log(element)
                    
                    //Creates the Results
                    result = document.createElement('article');
                    result.className = "movieResult card";
                    details = document.createElement('section');
        
                    //The title and date
                    title = document.createElement('p');
                    title.textContent = element.Title;
                    date = document.createElement('p');
                    date.textContent = `(${element.Year})`;
        
                    details.appendChild(title);
                    details.appendChild(date);
        
                    //Breaklines between the title&date and the buttons
                    details.appendChild(document.createElement("br"));
                    details.appendChild(document.createElement("br"));
        
                    let inList = nominationList.includes(element.Title);
        
                    //The Nominate button
                    nominator1 = document.createElement("div");
                    nominator1.classList.add("nominate");
        
                    if(inList){
                        nominator1.classList.add("hidden");
                    }
        
                    nominator1.textContent = "\u2606 Nominate";
                    nominator1.setAttribute("id",`nominate${element.Title}`);
                    nominator1.setAttribute("onclick",`nominator("${element.Title}")`);
                    details.appendChild(nominator1);
        
                    //The Nominated! button
                    nominator2 = document.createElement("div");
                    nominator2.classList.add("nominate");
                    
                    if(inList==false){
                        nominator2.classList.add("hidden");
                    }
        
                    nominator2.textContent = "\u2605 Nominated!";
                    nominator2.setAttribute("id",`nominated${element.Title}`);
                    nominator2.setAttribute("onclick",`unnominator("${element.Title}")`);
                    details.appendChild(nominator2);
                    result.appendChild(details);
        
                    image = document.createElement('img');
                    image.className = "poster";
        
                    //The poster
                    if(element.Poster!="N/A"){ //In case a movie poster isn't available
                        image.src=element.Poster;
                    }
        
                    result.appendChild(image);
                    element1.appendChild(result);
                }
            });
        }catch(e){
            console.log(e);
            document.getElementById("toHide").classList.remove("hidden");
        }
    }
}

function nominator(str){ //adds to nomination list and makes the nominated! button visible
    let i=1

    if(nominationList.length==5){
        infoAlert(["To nominate a new movie, remove one of your earlier nominations."]);
    }
    else{
        nominationList.push(str);
        console.log(nominationList);

        while(i!=6){
            element = document.getElementById(`n${i}`);
            if(element.textContent == "Nomination"){
                element.textContent = `${i}. ${str}`;

                if(i==1){ //The find movies box
                    pholder = document.getElementById("placeholder");
                    pholder.classList.add("hidden");
                }

                //Once a nomination is chosen show it
                document.getElementById(`n${i}p`).classList.remove("hidden");

                //Nomination Button
                nominate = document.getElementById(`nominate${str}`);
                nominate.classList.add("hidden");
                nominated = document.getElementById(`nominated${str}`);
                nominated.classList.remove("hidden");

                if(i==5){
                    infoAlert(["Five Movies have been successfully nominated! ","Thank you for your time!","To nominate a new movie, remove one of your earlier nominations."]);
                }
                i=6
            }
            else{
                i+=1;
            }
        }
    }
}

// Two Functions for un-nominating a film: 
// One for doing it from search results and one for doing it from the Nomination list.
// I could've used the unnominator function for both but that would mean doing a while loop when its not necessary.

function unnominator(str){ //un-nominate based on the string

    let i=1

    while(i!=6){ //Loops through the nomination list until it finds the movie with a matching name

        //Hides the Nominated! button and shows the Nominate button
        element = document.getElementById(`n${i}`);
        nominate = document.getElementById(`nominate${str}`);
        nominate.classList.remove("hidden");
        nominated = document.getElementById(`nominated${str}`);
        nominated.classList.add("hidden");

        //Since the content will be somthing like "1. Star Wars..." we need to use include, = won't work since the result will have a number in front.
        if(element.textContent.includes(str)){
            nominationList.splice(i-1,1);
            element.textContent = `Nomination`;
            document.getElementById(`n${i}p`).classList.add("hidden");
            i=6;
        }
        else if (element.textContent == 'Nomination') {
            i=6; //reorder ensures that there are no gaps
        }
        else{
            i+=1;
        }
    }
    reorder();
}

function unnominator2(n){ //un-nominate based on position in the un-nomination list
    element = document.getElementById(`n${n}`);
    
    nominationList.splice(n-1,1);

    //If element's textContent is nomination then don't do anything because there is nothing to remove.
    if(element.textContent!="Nomination"){

        element.textContent = 'Nomination';
        document.getElementById(`n${n}p`).classList.add("hidden");

        //Hide the Nominated! button and show the Nominate button
        nominate = document.getElementById(`nominate${element.textContent.substring(3)}`);
        
        if(nominate!=null){
            nominate.classList.remove("hidden");
        }

        nominated = document.getElementById(`nominated${element.textContent.substring(3)}`);
        
        if(nominated!=null){
            nominated.classList.add("hidden");
        }
    }

    reorder();
}

//Reorder Nominations when a Nomination is Removed
function reorder(){

    j=1;

    for(let i=0; i<5;i++){

        if(i<=nominationList.length-1){

            element = document.getElementById(`n${i+1}`);
            document.getElementById(`n${i+1}p`).classList.remove("hidden");

            console.log(`${j}. ${nominationList[i]}`);
            element.textContent = `${j}. ${nominationList[i]}`;

            j=j+1;
        }
        else{
            document.getElementById(`n${i+1}`).textContent ="Nomination";
            document.getElementById(`n${i+1}p`).classList.add("hidden");
        }
    }

}

//Theme Switcher
function switchTheme(){
    
    let switchButton = document.getElementById("theme-switch");
    let theme = document.getElementById("theme");

    if(switchButton.checked) {
        theme.href = "styles/dark-theme.css";
    }else{
        theme.href = "styles/light-theme.css";
    }
}

//Save Cookies!
function saveCookies(){
    
    if(cookieEnabled && played==true){

        createCookie(1,nominationList.length,30); //The first cookie is the number of following cookies.
        
        for(let i=0; i<nominationList.length;i++){
            let j=i+2;
            createCookie(`${j}`,nominationList[i],30);
        }
    }
}