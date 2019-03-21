$(function() {

    $("a.nav-link[href^='#']").click(
        function (e) {
    
            // Disable default click event and scrolling
            e.preventDefault();
            var hash = $(this).attr('href');
            hash = hash.slice(hash.indexOf('#') + 1);
            
            // Scroll to
            $("#s4-workspace").scrollTo($('#' + hash), 800);
            
            window.location.hash = '#' + hash;
        }
    );

});

function printSection(elSelector) {

    $('.page-section')
        .remove('printy')
        .addClass('hide-printy');

    $(elSelector)
        .removeClass('printy')
        .removeClass('hide-printy')
        .addClass('printy');

    window.print();

}
