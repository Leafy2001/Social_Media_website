{
    function add_comment(comment_form){

        $(comment_form).submit((e) => {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(comment_form).serialize(),
                beforeSend: () => {
                    $('#loader-div').css("visibility", "visible");
                },
                success: (data) => {
                    let post_id = data.data.comment.post;
                    let dom = comment_dom(data);
                    let btn = $(' .delete-comment', dom);
                    deleteComment(btn);
                    $(`#post-comments-${post_id}`).prepend(dom);
                    let like_btn = $(' .toggle_like', dom);
                    attach(like_btn);
                    // toggle_like();
                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: (err) => {
                    // console.log(err.responseText);
                    new Noty({
                        theme: 'relax',
                        text: "Comment Not Added",
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

    function comment_dom(data){
        let comment = data.data.comment;
        let comment_id = comment._id;
        let comment_content = comment.content;
        let comment_date = comment.createdAt;

        let user = data.data.user;
        let user_id = user._id;
        let user_name = user.name;
        let user_avatar = user.avatar;

        let dom2 = $(`
            <li id = "comment-${comment_id}" class="list-group-item single_comment">
                
                <div class="comment_heading">
                    <div class="profile-pic-comment">
                        <a href = "/users/profile/${user_id}"><img src="${user_avatar}" class = "post-user-pic rounded-circle" width="30px"></a>
                    </div>
                    <div class="comment_user_info">
                        <a class="comment_user_name" href="/users/profile/${user_id}">${user_name}</a>
                        <small class="comment_date">${comment_date}</small>
                        <a class = "delete-comment" href="/comments/destroy/${comment_id}"><i class="fas fa-trash-alt"></i></a>
                    </div>
                </div>

                <div class="comment_body">
                    <div class="comment_content col-lg-10 col-md-12">
                        <b>${comment_content}</b>
                    </div>
                    <div class="comment_likes_container">
                        <span class = "likes_count">0 </span>    
                        <a href = "/likes/toggle?id=${comment_id}&type=Comment" class = "toggle_like"><i class="far fa-thumbs-up"></i> </a>
                    </div>
                </div>
            </li>
        `);

        return dom2;
    }

    function attach_ajax_to_comments_form() {
        let forms = document.querySelectorAll('.new-comment-form');
        // console.log(forms);
        forms.forEach((form) => {
            add_comment(form);
            // console.log(form);
        })
    };
    attach_ajax_to_comments_form();


    // COMMENT DELETION
    function deleteComment(link){
        $(link).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(link).prop('href'),
                beforeSend: () => {
                    $('#loader-div').css("visibility", "visible");
                },
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
                        text: "POST NOT DELETED",
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
    function add_del_link(){
        const comments = document.querySelectorAll('.delete-comment');
        for(comment of comments){
            deleteComment(comment);
        }
    }
    add_del_link();
}