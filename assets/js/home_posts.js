{
    function create_post(){
        let form = $('#new-post-form');
        
        form.submit((e) => {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: form.serialize(),
                beforeSend: () => {
                    $('#loader-div').css("visibility", "visible");
                },
                success: (data) => {
                    let post = data.data.post;
                    let post_id = post._id;
                    
                    let dom = get_dom(data);
                    $('#post-list-container').prepend(dom);
                    // display_notification(true, data.message);
                    let btn = $(' .delete-post-button', dom);
                    deletePost(btn);

                    let comment_form = $(` .new-comment-form`, dom);
                    add_comment(comment_form);

                    let like_btn = $(' .toggle_like', dom);
                    attach(like_btn);

                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: (err) => {
                    console.log(err.responseText);
                    new Noty({
                        theme: 'relax',
                        text: "POST NOT ADDED",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                complete: () => {
                    $('#loader-div').css("visibility", "hidden");
                }
            })
        });

    }

    function get_dom(data){
        // console.log(data);
        let post = data.data.post;
        let post_id = post._id;
        let post_content = post.content;
        let createdAt = post.createdAt;

        let user = data.data.user;
        let user_id = user._id;
        let user_avatar = user.avatar;
        let user_name = user.name;
        
        let dom2 = $(`
                    <li id = "post-${post_id}" class="list-group-item single_post">
                    <div class="post_heading">
                        <div class="profile-pic">
                            <a href = "/users/profile/${user_id}"><img src="${user_avatar}" class = "post-user-pic rounded-circle" width="45px"></a>
                        </div>
                        <div class="user_info">
                            <a class="user_name" href="/users/profile/${user_id}">${user_name}</a>
                            <small class="post_date">${createdAt}</small>
                            <a class = "delete-post-button" href="/posts/destroy/${post_id}"><i class="fas fa-trash-alt"></i></a>
                        </div>
                    </div>
                    <div class="post_body">
                        <div class="post_content col-lg-10 col-md-12">
                            <b>${post_content}</b>
                        </div>
                        <div class="likes_container">
                            <span class = "likes_count">0 </span>
                            <a href = "/likes/toggle?id=${post_id}&type=Post" class = "toggle_like"><i class="far fa-thumbs-up"></i> </a>
                        </div>

                        <div class="post-comments-form">
                                <form class="new-comment-form comments-form-${post_id}" action = "/comments/create" method = "post">
                                    <input type="hidden" name="post" value = "${post_id}">
                                    <div class="form-group">
                                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="1" placeholder="Add Comment..." name="content"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary add_comment_button"><i class="fas fa-plus-square"></i> Add Comment</button>
                                </form>
                        </div>

                        <div class="post-comments-list">
                            <ul id="post-comments-${post_id}">
                            
                            </ul>
                        </div>
                    </div>
                </li>
        `);

        return dom2;
    }

    create_post();



    // POST DELETION
    let deletePost = function(delLink){
        $(delLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(delLink).prop('href'),
                beforeSend: () => {
                    $('#loader-div').css("visibility", "visible");
                },
                success: (data) => {
                    let post_id = data.data.post_id;
                    $(`#post-${post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                    // display_notification(true, data.message);
                },
                error: (err) => {
                    // console.log(err.responseText);
                    new Noty({
                        theme: 'relax',
                        text: "Could not perform action",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                complete: () => {
                    $('#loader-div').css("visibility", "hidden");
                }
            })
        })
    }

    function add_ajax_del(){
        const posts = document.querySelectorAll('.delete-post-button');
        for(post of posts){
            deletePost(post);
        }
    }

    add_ajax_del();

}