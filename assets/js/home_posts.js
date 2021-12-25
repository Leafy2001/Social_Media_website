{
    function create_post(){
        let form = $('#new-post-form');
        
        form.submit((e) => {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: form.serialize(),
                success: (data) => {
                    let dom = get_dom(data);
                    $('#post-list-container').prepend(dom);
                    // display_notification(true, data.message);
                    let btn = $(' .delete-post-button', dom);
                    deletePost(btn);
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
                        text: data.message,
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }
            })
        });

    }

    function get_dom(data){
        let post = data.data.post;
        let post_id = post._id;
        let post_content = post.content;
        let post_username = data.data.user_name;
        return $(`
                    <li id = "post-${post_id}">
                        <hr/>
                        <p>
                            <b>${post_content}</b> | 
                            <small>by: ${post_username}</small>
                            <a class = "delete-post-button" href="/posts/destroy/${post_id}">X</a>
                        </p>
                        ${post.likes.length} Likes | 
                        <a href = "/likes/toggle?id=${post_id}&type=Post">Like</a>

                        <div class="post-comments">
                            <form action = "/comments/create" method = "post">
                                <input type="text" name="content" placeholder="Type Here to add comment...">
                                <input type="hidden" name="post" value = "${post_id}">
                                <input type="submit" value="Post Comment">
                            </form>
                        </div>
                        <div class="post-comments-list">
                            <ul id="post-comments-${post_id}">
                            
                            </ul>
                        </div>
                        <hr/>
                    </li>
                    `);
    }

    create_post();



    // POST DELETION
    let deletePost = function(delLink){
        $(delLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(delLink).prop('href'),
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
                    console.log(err.responseText);
                    new Noty({
                        theme: 'relax',
                        text: "Could not perform action",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
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