<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Vendor CSS -->
    <link rel="stylesheet" href="libs/armin/armin.min.css">
    <link rel="stylesheet" href="libs/fonts/foundation-icons/foundation-icons.css">
    <title>Hello, Armin!</title>
</head>

<body>
    <div class="container">
        <div class="conta">
            <div class="bl-main" id="bl-main">
                <section>
                    <div class="bl-box">
                        <h1>A</h1>
                    </div>

                    <div class="bl-content">
                        <h2>About</h2>

                        <p>I'm an Indonesia web developer; I work on many enthusiastic projects for clients as a freelancer, mainly handmade websites or web applications.</p><br>
                        <p>I spend time every day helping people using PHP Form Builder worldwide.</p><br />
                        <p>Your support is greatly appreciated and helps us to continue working on Assegai for the benefit of the entire PHP community. Thank you for considering a contribution..</p>
                    </div><span class="bl-icon bl-icon-close"></span>
                </section>

                <section>
                    <div class="bl-box">
                        <h1>R</h1>
                    </div>

                    <div class="bl-content">
                        <h2>Experience</h2>

                        <p>Pinterest semiotics single-origin coffee craft beer
                            thundercats irony, tumblr bushwick intelligentsia pickled.
                            Narwhal mustache godard master cleanse street art, occupy
                            ugh selfies put a bird on it cray salvia four loko
                            gluten-free shoreditch. Occupy american apparel freegan
                            cliche. Mustache trust fund 8-bit jean shorts mumblecore
                            thundercats. Pour-over small batch forage cray, banjo
                            post-ironic flannel keffiyeh cred ethnic semiotics next
                            level tousled fashion axe. Sustainable cardigan keytar fap
                            bushwick bespoke.</p>
                    </div><span class="bl-icon bl-icon-close"></span>
                </section>

                <section>
                    <div class="bl-box">
                        <h1>M</h1>
                    </div>

                    <div class="bl-content">
                        <h2>Experiment</h2>

                        <p>This responsive layout is based on an initial grid of
                            four boxes. Once a box is clicked, it gets resized to
                            fullscreen and the other boxes scale down and fade out. In
                            the work section we experiment with another transition
                            which is to show a panel by making it appear from the
                            bottom while scaling the current one down. To see it in
                            action, open the work section and click on one of the
                            portfolio items and navigate through them.</p>
                    </div><span class="bl-icon bl-icon-close"></span>
                </section>

                <section id="bl-work-section">
                    <div class="bl-box">
                        <h1>I</h1>
                    </div>

                    <div class="bl-content">
                        <h2>My Works</h2>

                        <p>Mung bean maize dandelion sea lettuce catsear bunya nuts
                            ricebean tatsoi caulie horseradish pea.</p>

                        <ul id="bl-work-items">
                            <!-- Populated by js/portfolio.js -->
                        </ul>

                        <p>Illustrations by <a href="http://dribbble.com/isaac317/click">Isaac
                                Montemayor</a></p>
                    </div><span class="bl-icon bl-icon-close"></span>
                </section>

                <section>
                    <div class="bl-box">
                        <h1>N</h1>
                    </div>

                    <div class="bl-content">
                        <h2>My Social</h2>

                        <article>
                            <h3>Being a Freelance Designer</h3>

                            <p>Stumptown helvetica cardigan, odd future seitan
                                tattooed flannel. Kale chips direct trade cray beard.
                                8-bit etsy butcher post-ironic blog lo-fi mcsweeney's,
                                sustainable pickled umami flexitarian DIY ethical plaid
                                trust fund. Wolf cred organic, terry richardson
                                aesthetic four loko occupy vegan chillwave readymade
                                deep... <a href="#">Read more</a></p>
                        </article>

                        <article>
                            <h3>Working with Photoshop</h3>

                            <p>Cosby swea seitan twee... <a href="#">Read
                                    more</a></p>
                        </article>
                    </div><span class="bl-icon bl-icon-close"></span>
                </section><!-- Panel items for the works -->

                <div class="bl-panel-items" id="bl-panel-work-items">
                    <!-- Panels populated by js/portfolio.js -->

                    <nav>
                        <span class="bl-next-work">&gt; Next Project</span>
                        <span class="bl-icon bl-icon-close"></span>
                    </nav>
                </div>
            </div>
        </div>
    </div><!-- /container -->

    <!-- Shared JS utilities -->
    <script src="libs/armin/jquery.min.js"></script>
    <script src="libs/armin/armin.min.js"></script>
    <script src="js/portfolio.js"></script>
    <script>
        var portfolioData = [
            { panel: 'panel-1', image: 'images/1.jpg', title: 'Fixie bespoke', description: 'Iphone artisan direct trade ethical Austin. Fixie bespoke banh mi ugh, deep v vinyl hashtag. Tumblr gentrify keffiyeh pop-up iphone twee biodiesel. Occupy american apparel freegan cliche. Mustache trust fund 8-bit jean shorts mumblecore thundercats.' },
            { panel: 'panel-2', image: 'images/2.jpg', title: 'Chillwave mustache', description: 'Squid vinyl scenester literally pug, hashtag tofu try-hard typewriter polaroid craft beer mlkshk cardigan photo booth PBR. Chillwave 90s gentrify american apparel carles disrupt.' },
            { panel: 'panel-3', image: 'images/3.jpg', title: 'Austin hella', description: 'Ethical cray wayfarers leggings vice, seitan banksy small batch ethnic master cleanse. Pug chillwave etsy, scenester meh occupy blue bottle tousled blog tonx pinterest selvage mixtape swag cosby sweater.' },
            { panel: 'panel-4', image: 'images/4.jpg', title: 'Brooklyn dreamcatcher', description: 'Fashion axe 90s pug fap. Blog wayfarers brooklyn dreamcatcher, bicycle rights retro YOLO. Wes anderson lomo 90s food truck 3 wolf moon, twee jean shorts.' },
            { panel: 'panel-5', image: 'images/5.jpg', title: 'Testing Panel 5', description: 'Fashion axe 90s pug fap. Blog wayfarers brooklyn dreamcatcher, bicycle rights retro YOLO. Wes anderson lomo 90s food truck 3 wolf moon, twee jean shorts.' },
            { panel: 'panel-6', image: 'images/6.jpg', title: 'Testing Panel 6', description: 'Fashion axe 90s pug fap. Blog wayfarers brooklyn dreamcatcher, bicycle rights retro YOLO. Wes anderson lomo 90s food truck 3 wolf moon, twee jean shorts.' },
            { panel: 'panel-7', image: 'images/7.jpg', title: 'Testing Panel 7', description: 'Fashion axe 90s pug fap. Blog wayfarers brooklyn dreamcatcher, bicycle rights retro YOLO. Wes anderson lomo 90s food truck 3 wolf moon, twee jean shorts.' },
            { panel: 'panel-8', image: 'images/8.png', title: 'Testing Panel 8', description: 'Fashion axe 90s pug fap. Blog wayfarers brooklyn dreamcatcher, bicycle rights retro YOLO. Wes anderson lomo 90s food truck 3 wolf moon, twee jean shorts.' }
        ];

        $(function () {
            Portfolio.renderWorkItems('bl-work-items', portfolioData);
            Portfolio.renderPanelItems('bl-panel-work-items', portfolioData);
            Boxlayout.init();
        });
    </script>
</body>

</html>
<!-- 

Hi, hope you like that layout idea, 
the original tutorial you will find
here: https://tympanus.net/codrops/2013/04/23/fullscreen-layout-with-page-transitions/ 

code is under the MIT License
-->