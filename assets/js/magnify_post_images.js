{
    let close_btn = $('#magnify-image i');
    let magnify_container = $('#magnify-image');
    $(close_btn).on("click", function(e){
        $(magnify_container).css("display", "none");
    });


    function attach_listener(post){
        $(post).on("click", (e) => {
            let source = $(post).attr('src');
            $('#magnify-image img').attr("src", source);
            $(magnify_container).css("display", "flex");
        });
    }

    function get_posts(){
        $('.post-pic').each((id, post) => {
            attach_listener(post);
        });
    }

    get_posts();
}