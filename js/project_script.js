var window_height = $(window).height(),
    loadingError = '<p class="alert">The Content cannot be loaded.</p>',
    current,
    next,
    prev,
    target,
    hash,
    url,
    page,
    title,
    projectIndex,
    scrollPosition,
    projectLength,
    ajaxLoading = false,
    wrapperHeight,
    pageRefresh = true,
    content = false,
    loader = $('div#project_loader'),
    portfolioGrid = $('div.portfolio_wrapper'),
    projectContainer = $('div#project_container'),
    projectNav = $('#project_nav ul'),
    exitProject = $('div#close_project a'),
    easing = 'easeOutExpo',
    folderName = 'projects',
    player;


// Load project working when project
(function ($) {
    "use strict";
    // checks everytime hash changes in the URL bar
    $(window).bind('hashchange', function () {

        // getting the hash address
        hash = $(window.location).attr('hash');
        var root = '#!' + folderName + '/';
        var rootLength = root.length;

        // if hash length is zero then will stop working and not equal to the #![folder_name] (#!projects)
        if (hash.substr(0, rootLength) != root) {
            return;
        } else {  //if hash length is equal to the #![folder_name] (#!projects)

            var correction = 50;
            var headerH = $('.portfolio_nav').outerHeight() + correction;
            hash = $(window.location).attr('hash');
            url = hash.replace(/[#\!]/g, '');


            portfolioGrid.find('div.isotope-item.current').find('.view').removeClass('active');
            portfolioGrid.find('div.isotope-item.current').removeClass('current');

            // check whther URL is pasted in URL bar and page is refreshed
            if (pageRefresh === true && hash.substr(0, rootLength) == root) {
                $('html,body').stop().animate({scrollTop: (projectContainer.offset().top - 20) + 'px'}, 1500, 'easeOutExpo', function () {
                    loadProject();
                });

                // else checking whether clicked on portfolio in portfolio section or in header or through navigation, all works same
            } else if (pageRefresh === false && hash.substr(0, rootLength) == root) {
                $('html,body').stop().animate({scrollTop: (projectContainer.offset().top - headerH) + 'px'}, 1500, 'easeOutExpo', function () {

                    if (content === false) {
                        loadProject();
                    } else {
                        projectContainer.animate({opacity: 0, height: wrapperHeight}, function () {
                            loadProject();
                        });
                    }

                    projectNav.fadeOut('100');
                    exitProject.fadeOut('100');

                });

                // else checking whether brwosers back button is used
            } else if (hash === '' && pageRefresh === false || hash.substr(0, rootLength) != root && pageRefresh === false || hash.substr(0, rootLength) != root && pageRefresh === true) {
                scrollPosition = hash;
                console.log(scrollPosition);
                $('html,body').stop().animate({scrollTop: scrollPosition + 'px'}, 1000, function () {
                    deleteProject();
                });
            }


            // adding active and current classes to the currently active portfolio item in 1-Portfolio section
            portfolioGrid.find('div.isotope-item .single_work .links a[href="#!' + url + '"]').closest('.isotope-item').addClass('current'); // for Porfolio section
            portfolioGrid.find('div.isotope-item.current').find('.view').addClass('active');	// for Porfolio section


        }

    });

    // Function for loading project
    function loadProject() {
        //var player="";
        //player.dispose();
        if ($('#project_ajax_content').find('.video_post').length > 0) {
            console.log("Disposed");
            player.dispose();
        }
        loader.fadeIn().removeClass('projectError').html('');
        if (!ajaxLoading) {
            ajaxLoading = true;
            projectContainer.load(url + ' div#project_ajax_content', function (xhr, statusText, request) {
                if (statusText == "success") {
                    ajaxLoading = false;
                    page = $('div#project_ajax_content');

                    if ($('#project_ajax_content').find('.rslides').length > 0) {
                        $(".rslides").responsiveSlides({
                            auto: true,
                            pager: true,
                            nav: true,
                            speed: 500,
                            maxwidth: 1170,
                            prevText: "",
                            nextText: "",
                            namespace: "transparent-btns"
                        });
                        console.log('rslides');
                    }

                    hideLoader();

                    if ($('#project_ajax_content').find('.v_y_video_post').length > 0) {
                        $(".featured_image").fitVids();
                        console.log('fitvideos');
                    }

                    if ($('#project_ajax_content').find('.video_post').length > 0) {
                        $(".featured_image").fitVids();
                        var video_div = $('#project_ajax_content').find('.video-js')
                        player = videojs(video_div[0], {}, function () {
                            // Player (this) is initialized and ready.
                        });
                        console.log(video_div);

                    }


                }

                if (statusText == "error") {

                    loader.addClass('projectError').append(loadingError);

                    loader.find('p').slideDown();

                }

            });

        }

    }


    // function for hiding the loader  and displaying the project in place of it
    function hideLoader() {
        loader.fadeOut('fast', function () {
            showProject();
        });
    }

    // displaying the loaded project
    function showProject() {
        if (content === false) {
            wrapperHeight = projectContainer.children('div#project_ajax_content').outerHeight() + 'px';
            projectContainer.animate({opacity: 1, height: wrapperHeight}, function () {
                $(".featured_image").fitVids();
                scrollPosition = $('html,body').scrollTop();
                projectNav.fadeIn();
                exitProject.fadeIn();
                content = true;

            });
        } else {
            wrapperHeight = projectContainer.children('div#project_ajax_content').outerHeight() + 'px';
            projectContainer.animate({opacity: 1, height: wrapperHeight}, function () {
                $(".featured_image").fitVids();
                scrollPosition = $('html,body').scrollTop();
                projectNav.fadeIn();
                exitProject.fadeIn();
            });
        }

        projectIndex = portfolioGrid.find('div.isotope-item.current').index();
        projectLength = $('div.isotope-item').length - 1;

        if (projectIndex == projectLength) {
            $('ul li#next_project a').addClass('disabled');
            $('ul li#previous_project a').removeClass('disabled');

        } else if (projectIndex === 0) {
            $('ul li#previous_project a').addClass('disabled');
            $('ul li#next_project a').removeClass('disabled');

        } else {
            $('ul li#next_project a,ul li#previous_project a').removeClass('disabled');

        }
    }

    // fucntion for deleting the project from the displayed section
    function deleteProject(closeURL) {
        projectNav.fadeOut(100);
        exitProject.fadeOut(100);
        projectContainer.animate({opacity: 0, height: '0px'});
        projectContainer.html('');

        if (typeof closeURL != 'undefined' && closeURL !== '') {
            var location;
            location = '#_';
        }
        portfolioGrid.find('div.isotope-item.current').find('.view').removeClass('active');
        portfolioGrid.find('div.isotope-item.current').removeClass('current');

    }

    // working of project navigation for next project
    $('#next_project a').on('click', function () {
        current = portfolioGrid.find('.isotope-item.current');
        next = current.next('.isotope-item');
        target = $(next).children('div').find('a').attr('href');
        $(this).attr('href', target);

        if (next.length === 0) {
            return false;
        }
        current.find('.view').removeClass('active');
        current.removeClass('current');
        next.addClass('current');
        next.find('.view').addClass('active');
    });

    // working of project navigation for next project
    $('#previous_project a').on('click', function () {
        current = portfolioGrid.find('.isotope-item.current');
        prev = current.prev('.isotope-item');
        next = current.next('.isotope-item');
        target = $(prev).children('div').find('a').attr('href');
        $(this).attr('href', target);

        if (prev.length === 0) {
            return false;
        }


        current.removeClass('current');
        current.children().removeClass('active');
        prev.addClass('current');
        prev.children().addClass('active');

        current.find('.view').removeClass('active');
        current.removeClass('current');
        next.addClass('current');
        next.find('.view').addClass('active');

    });


    // working of closing the project it will delete the project in ajax project section
    $('#close_project a').on('click', function () {
        deleteProject($(this).attr('href'));
        loader.fadeOut();
        return false;
    });

    pageRefresh = false;

})(jQuery);

// when window is loaded then check that if haschange is trigerred in URL or window is resized so that project can be loaded		 
$(window).load(function () {
    $('#load').fadeOut().remove();
    $(window).trigger('hashchange');
    $(window).trigger('resize');
});

// projectContainer height is resized everytime browser window is resized
$(window).bind('resize', function () {
    $(projectContainer).css({height: 'auto'});
});
