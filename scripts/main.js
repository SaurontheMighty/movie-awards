//On load show welcome screen
window.onload = welcome;

function welcome(){

    //Add a dark overlay to the screen and show the welcome popup
    overlay = document.getElementById("overlay");
    overlay.classList.remove("hidden");

    popup = document.getElementById("welcome");
    popup.classList.remove("hidden");
}

//Close welcome screen
function closePopup(str){

    //Remove the dark overlay and hide the Welcome Popup
    overlay = document.getElementById("overlay");
    overlay.classList.add("hidden");

    popup = document.getElementById(`${str}`);
    popup.classList.add("hidden");
}

// Information Window (reusing code from welcome message)
function infoAlert(str){
    overlay = document.getElementById("overlay");
    overlay.classList.remove("hidden");

    popup = document.getElementById("infoAlert");
    document.getElementById("info").textContent = str;
    popup.classList.remove("hidden");
}

function getMovie(){ //Gets all the movies containing the string from OMDb
    var currentResult = document.querySelectorAll('.movieResult');
    console.log(currentResult);

    if(currentResult!=null){
        for(var i=0; i<currentResult.length;i++){
            console.log('inside FOR');
            console.log(currentResult[i]);
            currentResult[i].classList.add("hidden");
            console.log(currentResult[i]);
        }
    }

    document.getElementById("toHide").classList.add("hidden");

    var name = document.getElementById('searchMovies').value;
    var element1 = document.getElementById('results');

    fetch(`http://www.omdbapi.com/?s=${name}&apikey=b2051952`)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{

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

        data.Search.forEach(element => {
            console.log(element);
            if(element.Type=="movie"){ // Move Awards so only movies
                result = document.createElement('article');
                result.className = "movieResult card";
                details = document.createElement('section');
                title = document.createElement('p');
                title.textContent = element.Title;
                date = document.createElement('p');
                date.textContent = `(${element.Year})`;
                details.appendChild(title);
                details.appendChild(date);
                details.appendChild(document.createElement("br"));
                details.appendChild(document.createElement("br"));

                nominator1 = document.createElement("div");
                nominator1.classList.add("nominate");
                nominator1.textContent = "\u2606 Nominate";
                nominator1.setAttribute("id",`nominate${element.Title}`);
                nominator1.setAttribute("onclick",`nominator("${element.Title}")`);
                details.appendChild(nominator1);

                nominator2 = document.createElement("div");
                nominator2.classList.add("nominate");
                nominator2.classList.add("hidden");
                nominator2.textContent = "\u2605 Nominated!";
                nominator2.setAttribute("id",`nominated${element.Title}`);
                nominator2.setAttribute("onclick",`unnominator("${element.Title}")`);
                details.appendChild(nominator2);
                result.appendChild(details);

                image = document.createElement('img');
                image.className = "poster";

                if(element.Poster!="N/A"){
                    image.src=element.Poster;
                }
                result.appendChild(image);
                element1.appendChild(result);
            }
        });
    })
    .catch((error)=>{
        document.getElementById("toHide").classList.remove("hidden");
    });
}

function nominator(str){ //adds to nomination list and makes the nominated! button visible
    var i=1
    while(i!=6){
        element = document.getElementById(`n${i}`);
        if(element.textContent == "Nomination"){
            element.textContent = `${i}. ${str}`;

            //Nomination Button
            nominate = document.getElementById(`nominate${str}`);
            nominate.classList.add("hidden");
            nominated = document.getElementById(`nominated${str}`);
            nominated.classList.remove("hidden");
            
            if(i==5){
                infoAlert("Five Movies have been successfully nominated! Thank you for your time! To nominate a new movie, remove one of your earlier nominations.");
            }
            i=6
        }
        else{
            if(i==5){
                infoAlert("To nominate a new movie, remove one of your earlier nominations.");
            }
            i+=1;
        }
    }
}

function unnominator(str){ //un-nominate based on the string
    var i=1
    while(i!=6){
        element = document.getElementById(`n${i}`);
        nominate = document.getElementById(`nominate${str}`);
        nominate.classList.remove("hidden");
        nominated = document.getElementById(`nominated${str}`);
        nominated.classList.add("hidden");
        console.log(element.textContent);
        if(element.textContent.includes(str)){
            element.textContent = `Nomination`;
            i=6
        }
        else{
            i+=1;
        }
    }
}

function unnominator2(n){ //un-nominate based on position in the un-nomination list
    element = document.getElementById(`n${n}`);
    if(element.textContent!="Nomination"){
        console.log(element.textContent.substring(3));
        nominate = document.getElementById(`nominate${element.textContent.substring(3)}`);
        nominate.classList.remove("hidden");
        nominated = document.getElementById(`nominated${element.textContent.substring(3)}`);
        nominated.classList.add("hidden");
        element.textContent = 'Nomination';
    }
}