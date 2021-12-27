{
    function add_comment(){
        let comment_form = $("#new-comment-form");

        comment_form.submit((e) => {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: comment_form.serialize(),
                success: (data) => {
                    let post_id = data.data.comment.post;
                    let dom = comment_dom(data);
                    let btn = $(' .delete-comment', dom);
                    deleteComment(btn);
                    $(`#post-comments-${post_id}`).prepend(dom);
                    
                    toggle_like();
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
        })
    }

    function comment_dom(data){
        let comment_id = data.data.comment._id;
        let content = data.data.comment.content;
        let user_name = data.data.comment.user.name;

        // console.log(comment_id, content, user_name);

        let dom = $(`
            <li id = "comment-${comment_id}">
                <p>
                <small><b>${content}</b></small>
                <small>| ${user_name}</small>
                <a href="/comments/destroy/${comment_id}" class = "delete-comment">X</a>
                </p>
                <span class="likes_count">0</span> Likes 
                    | 
                <a href = "/likes/toggle?id=${comment_id}&type=Comment" class = "toggle_like">Like</a>
            </li>
        `);

        return dom;
    }

    add_comment();


    // COMMENT DELETION
    function deleteComment(link){
        $(link).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(link).prop('href'),
                success: (data) => {
                    let comment_id = data.data.comment_id;
                    $(`#comment-${comment_id}`).remove();
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
        })
    }
    function add_del_link(){
        const comments = document.querySelectorAll('.delete-comment');
        for(comment of comments){
            deleteComment(comment);
        }
    }
    add_del_link();
}