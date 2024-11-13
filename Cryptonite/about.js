function openAbout() {
    $("#shelfInfoTemp").append(`
    <div id="cardAbout" class="card w-75 shadow-lg border border-primary" style="display:none">
    <div class="row no-gutters">
        <div class="col-3">
            <img id="imgZG" src="Resources/ZaivGufeld.JPG" class="card-img rounded-circle img-fluid w-100 mt-3 ml-3 mr-3 mb-0 mb-md-3" alt="Zaiv Gufeld">
        </div>

        <div class="col-auto">
            <div class="card-body ml-2 mt-0">
                <h5 class="card-title">Cryptonite</h5>
                <p class="card-text"><strong>Training project</strong> of the Full Stack course<br>(<a
                        href="https://www.johnbryce.co.il/" target="_blank" class="card-link">John Bryce mega-school a
                        matrix company</a>).</p>
                <p class="card-text"><strong>Progammer:</strong> Zaiv Gufeld.<br>
                    <em>Software Engineer from 1998 <br>
                        | SQL Server | GUI | services | C# | VB6 | LINQ | <br>
                        Now a student of John Bryce - Full Stack</em>
                </p>
            </div>
        </div>
        <div class="row no-gutters">
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><a href="https://il.linkedin.com/in/zaiv-gufeld-b75453183" target="_blank"
                        class="card-link">Zaiv Gufeld in Linkedin</a></li>
                <li class="list-group-item"><a href="https://www.facebook.com/zaiv.gufeld" target="_blank"
                        class="card-link">Zaiv Gufeld in FaceBook</a></li>
                <li class="list-group-item"><a href="https://www.facebook.com/zaiv.gufeld.photos/" target="_blank"
                        class="card-link">The Intuitive Camera @ Zaiv Gufeld (FaceBook)</a></li>
            </ul>
        </div>

    </div>
</div>
<script>
    
</script>
    `);
    $("#cardAbout").fadeIn("slow");
} //openAbout()
