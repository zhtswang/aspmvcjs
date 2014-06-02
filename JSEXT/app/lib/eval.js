$(document).ready(function () {
    //Contact Us side tab on Contact Support link
		$(document).on('click','.contact-support', function (event) {
			$('.slide-handle').click();
			event.preventDefault();
		});
    //Contact Us side tab click handler
    $('.slide-handle').on('click',function(event){
        var $obj = $(this).parent(),
            containerWidth = $obj.outerWidth();

        event.preventDefault();

        if($obj.hasClass('open')){
            $obj.animate({right:'-'+containerWidth},300).removeClass('open');

            $('.contact-us-bg').remove();
            $('.contact-form').removeClass('with-shadow');
        }else{
            $('body').append('<div class="contact-us-bg"/>');
            $('.contact-form').addClass('with-shadow');
            $('.contact-support-success, .contact-support-error').html("");
            $('.details-field').val("");
            $obj.animate({right:0},300).addClass('open');
        }

    }); /* End of Contact Us side tab click handler */
});