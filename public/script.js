let alertIsActive = false;

window.addEventListener('resize', function(){
    if ((this.window.innerHeight < 700 || this.window.innerWidth < 1000) && !alertIsActive){
        this.alert('Screen size is to small.\nThis site can\'t work normally, you will not be able to play any games.\nPlease resize your window.');
        alertIsActive = true;
    } else if (this.window.innerHeight > 700 && this.window.innerWidth > 1000) {
        alertIsActive = false;
    }
});
