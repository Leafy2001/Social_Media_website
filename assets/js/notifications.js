{
    var timeouts = [];

    function display_notification(success, message){
        const box = document.querySelector('.notif');
        const box_text = document.querySelector('.notif p');

        if(success){
            box.style.backgroundColor = "green";
        }else{
            box.style.backgroundColor = "#E75480";
        }

        box.classList.add('animate__bounceInRight');
        box.classList.add('block')
        box_text.innerHTML = message;
        
        for(t of timeouts){
            window.clearTimeout(t);
        }

        let slide_in = setTimeout(() => {
            box.classList.remove('animate__bounceInRight');
            box.classList.add('animate__bounceOutRight');
        }, 1600);

        let slide_out = setTimeout(() => {
            box.classList.remove('block');
            box.classList.remove('animate__bounceOutRight');
        }, 2500);

        timeouts.push(slide_in);
        timeouts.push(slide_out);
    }
}