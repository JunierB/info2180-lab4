const SUPERHEROES_DATA = [
    { "id": 1, "name": "Steve Rogers", "alias": "Captain America", "biography": "Recipient of the Super-Soldier serum, World War II hero Steve Rogers fights for American ideals as one of the world’s mightiest heroes and the leader of the Avengers." },
    { "id": 2, "name": "Tony Stark", "alias": "Ironman", "biography": "Genius. Billionaire. Playboy. Philanthropist. Tony Stark's confidence is only matched by his high-flying abilities as the hero called Iron Man." },
    { "id": 3, "name": "Peter Parker", "alias": "Spiderman", "biography": "Bitten by a radioactive spider, Peter Parker’s arachnid abilities give him amazing powers he uses to help others, while his personal life continues to offer plenty of obstacles." },
    { "id": 4, "name": "Carol Danvers", "alias": "Captain Marvel", "biography": "Carol Danvers becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war between two alien races." },
    { "id": 5, "name": "Natasha Romanov", "alias": "Black Widow", "biography": "Despite super spy Natasha Romanoff’s checkered past, she’s become one of S.H.I.E.L.D.’s most deadly assassins and a frequent member of the Avengers." },
    { "id": 6, "name": "Bruce Banner", "alias": "Hulk", "biography": "Dr. Bruce Banner lives a life caught between the soft-spoken scientist he’s always been and the uncontrollable green monster powered by his rage." },
    { "id": 7, "name": "Clint Barton", "alias": "Hawkeye", "biography": "A master marksman and longtime friend of Black Widow, Clint Barton serves as the Avengers’ amazing archer." },
    { "id": 8, "name": "T'challa", "alias": "Black Panther", "biography": "T’Challa is the king of the secretive and highly advanced African nation of Wakanda - as well as the powerful warrior known as the Black Panther." },
    { "id": 9, "name": "Thor Odinson", "alias": "Thor", "biography": "The son of Odin uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike." },
    { "id": 10, "name": "Wanda Maximoff", "alias": "Scarlett Witch", "biography": "Notably powerful, Wanda Maximoff has fought both against and with the Avengers, attempting to hone her abilities and do what she believes is right to help the world." }
];

$(document).ready(function() {
    const $searchInput = $('#search-input');
    const $searchBtn = $('#search-btn');
    const $resultDiv = $('#result');

    if ($searchInput.length === 0) console.error('Missing element: #search-input');
    if ($searchBtn.length === 0) console.error('Missing element: #search-btn');
    if ($resultDiv.length === 0) console.error('Missing element: #result');
    if ($searchInput.length === 0 || $searchBtn.length === 0 || $resultDiv.length === 0) return;

    /**
     * Safely sanitizes a string for HTML output (prevents XSS).
     * @param {string} str The string to sanitize.
     * @returns {string} The sanitized string.
     */
    function sanitizeHTML(str) {
        return $('<div>').text(str).html();
    }


    function renderFullList() {
        $.ajax({
            url: 'superheroes.php',
            method: 'GET',
            dataType: 'html',
            cache: false,
            success: function(data) {

                $resultDiv.html(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $resultDiv.html('<p class="not-found">ERROR: Could not fetch data from superheroes.php.</p>');
                console.error("AJAX Error:", textStatus, errorThrown);
            }
        });
    }
    function renderSpecificSearch(rawQuery) {
        const query = (typeof rawQuery === 'string' ? rawQuery.trim() : '');
        const lower = query.toLowerCase();

        const foundSuperhero = SUPERHEROES_DATA.find(hero =>
            hero.alias.toLowerCase() === lower ||
            hero.name.toLowerCase() === lower
        );
        if (foundSuperhero) {
            const alias = sanitizeHTML(foundSuperhero.alias);
            const name = sanitizeHTML(foundSuperhero.name);
            const bio = sanitizeHTML(foundSuperhero.biography);

            const htmlContent = `<h3>${alias}</h3><h4>${name}</h4><p>${bio}</p>`;
            $resultDiv.html(htmlContent);
        } else {
            $resultDiv.html('<p class="not-found">Superhero not found</p>');
        }
        $.ajax({
            url: 'superheroes.php',
            method: 'GET',
            data: { query: query },
            cache: false
        });
    }

    function performSearch() {
        const raw = $searchInput.val();
        const query = (typeof raw === 'string') ? raw.trim() : '';

        if (query === "") {
            renderFullList();
        } else {
            renderSpecificSearch(query);
        }
    }
    $searchBtn.on('click', performSearch);
    $searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            performSearch();
        }
    });
    performSearch();
});