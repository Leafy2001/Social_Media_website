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
                    console.log(post_id);
                    let dom = comment_dom(data);
                    console.log(dom);
                    $(`#post-comments-${post_id}`).prepend(dom);
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

        console.log(comment_id, content, user_name);

        let dom = $(`
            <li>
                <p>
                <small><b>${content}</b></small>
                <small>| ${user_name}</small>
                <a href="/comments/destroy/${comment_id}">X</a>
                </p>
                0 Likes 
                    | 
                <a href = "/likes/toggle?id=${comment_id}&type=Comment">Like</a>
            </li>
        `);

        return dom;
    }

    add_comment();
}