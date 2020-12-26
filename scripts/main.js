function getMovie(){ //Gets all the movies containing the string from OMDb
    var currentResult = document.getElementsByClassName('movieResult');
    console.log(currentResult);
    currentResult.forEach(element =>{
        element.classList.add('hidden');
    });
    var name = document.getElementById('searchMovies').value;
    var element1 = document.getElementById('results');
    console.log(name);
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

        document.getElementById("toHide").classList.add("hidden");

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
            image.src=element.Poster;
            result.appendChild(image);
            element1.appendChild(result);
        });
    })
    .catch("ERROR!");
}