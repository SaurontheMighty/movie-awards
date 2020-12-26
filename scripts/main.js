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
            </section>
            <img class="poster" src="https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg">
        </article> */

        data.Search.forEach(element => {
            console.log(element);
            result = document.createElement('article');
            result.className = "movieResult card";
            details = document.createElement('section');
            title = document.createElement('p');
            title.textContent = element.Title;
            date = document.createElement('p');
            date.textContent = `(${element.Year})`;
            details.appendChild(title);
            details.appendChild(date);
            result.appendChild(details);
            image = document.createElement('img');
            image.className = "poster";
            if(element.Poster!="N/A"){
                image.src=element.Poster;
            }
            result.appendChild(image);
            element1.appendChild(result);
        });
    })
    .catch((error)=>{
        document.getElementById("toHide").classList.remove("hidden");
    });
}