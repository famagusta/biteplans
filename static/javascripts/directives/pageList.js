// DIRECTIVE FOR PAGE NO. LIST

app.directive('pageList', function () {
    return {
        template: '<div class="row"><div class="col s12"><ul class="pagination center"><li><a href="#!"><i class="material-icons">chevron_left</i></a></li><li class="active"><a href="#!">1</a></li><li class="waves-effect"><a href="#!" class="teal-text">2</a></li><li class="waves-effect"><a href="#!" class="teal-text">3</a></li><li class="waves-effect"><a href="#!" class="teal-text">4</a></li><li class="waves-effect"><a href="#!" class="teal-text">5</a></li><li class="waves-effect"><a href="#!" class="teal-text">6</a></li><li class="waves-effect"><a href="#!" class="teal-text">7</a></li><li class="waves-effect"><a href="#!" class="teal-text">8</a></li><li class="waves-effect"><a href="#!" class="teal-text">9</a></li><li class="waves-effect teal-text"><a href="#!"><i class="material-icons">chevron_right</i></a></li></ul></div></div>',
        replace: true
    };
});