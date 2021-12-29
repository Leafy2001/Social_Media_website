{
    function toggle_like(){
        let like_btn = $(" .toggle_like").each((id, link) => {
            // console.log(id, link);
            attach(link);

        });
        
    }

    function attach(link){
        $(link).click((e) => {
            e.preventDefault();
            // console.log($(link).prop('href'));
            $.ajax({
                type: 'POST',
                url: $(link).prop('href'),
                beforeSend: () => {
                    $('#loader-div').css("visibility", "visible");
                },
                success: (data) => {
                    // console.log(data);

                    let model, deleted, id;
                    model = data.data.model;
                    deleted = data.data.deleted;
                    id = data.data.likeable;
                    let count = data.data.count;
                    

                    if(model == "Post"){
                        let counter = document.querySelector(`#post-${id} .likes_count`);
                        if(!deleted){
                            counter.innerHTML = count.toString() + " ";
                        }else{
                            counter.innerHTML = count.toString() + " ";
                        }
                    }else if(model == "Comment"){
                        let counter = document.querySelector(`#comment-${id} .likes_count`);
                        if(!deleted){
                            counter.innerHTML = count.toString() + " ";
                        }else{
                            counter.innerHTML = count.toString() + " ";
                        }
                    }

                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: (err) => {
                    // console.log("ERROR");
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
            });
        });
    }

    toggle_like();
}