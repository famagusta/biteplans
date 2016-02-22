 $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        
    $(".button-collapse").sideNav();
        
    $('.modal-trigger').leanModal();
    
       $('#signupModal').click(function() {
           $('#modal1').hide();
       });
       $('#loginModal').click(function() {
           $('#modal2').hide();
       });
        $('#continueToForm2').click(function() {
           $('#modal2').hide();
       });
    $("#modal1").width($("#modal1").width());
    $("#modal2").width($("#modal2").width());
    $("#modal3").width($("#modal3").width());
        

  });
