// Treehouse Techdegree - Project 3
// Interactive Form Creation & Validation

// Global variables

// Shirt color
const $tshirtColor = $('#colors-js-puns');
const $jsPuns = $("#color option:contains('Puns')");
const $heart = $("#color option:contains('(I')");

// Activity variables
const $activity = $('.activites');
const $activityInput = $('.activities input');
let total = 0;

// Payment variables
const $bitcoin = $('div').last();
const $paypal = $('div').last().prev();

// Email regex validation from emailregex.com
function legitEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

// Error message text
const $nameCheck = $('<span class="error-message" id="name-error">New form. Who dis?</span>');
const $emailCheck = $('<span class="payment-error" id="email-error">Where can we send your registration ticket?</span>');
const $activityCheck = $('<span class="error-message" id="activity-error">Are you just going to loiter in the hallway?</span>');

$('#name-error').remove();
$('#email-error').remove();
$('#activity-error').remove();

/* ================================= 
Objective 1 Set focus on the first text field
==================================== */

$('#name').focus();

/* ================================= 
Objective 2 ”Job Role” section of the form
==================================== */

$('#other-title').hide();

$('div #title').on('change', function() {
    const value = $(this).val();
    if(value === 'other'){
        $('#other-title').show();
    } else {
        $('#other-title').hide();
    }
});

/* ================================= 
Objective 3 ”T-Shirt Info” section of the form
==================================== */
 
$tshirtColor.hide();

const dropDownColor = ($optionOne, $optionTwo) => {
    $tshirtColor.show();
    $optionOne.hide();
    $optionTwo.show();
    $optionTwo.first().attr('selected','selected');
    $optionOne.first().attr('selected',false);
};

$('#design').on('change', function() {
    const color = $(this).val();
    if(color === 'js puns'){
        dropDownColor($heart, $jsPuns);
    } else if(color ==='heart js') {
        dropDownColor($jsPuns, $heart);
    } else if(color === 'select theme'){
        $('#colors-js-puns').hide();
    }
});

/* ================================= 
Objective 4 ”Register for Activities” section of the form
==================================== */

const activityNotAvailabile = (activity) => {
    const $notAvailability = $(`input[name=${activity}]`);
    $notAvailability.prop('disabled', true);
    $notAvailability.parent().css({'text-decoration': 'line-through', 'color': '#D2D2D2'})
}

const activityAvailabile = (activity) => {
    const $activityAvailable = $(`input[name=${activity}]`);
    $activityAvailable.prop('disabled', false);
    $activityAvailable.parent().css({'text-decoration': 'none', 'color': '#000'});
}

$activityInput.on('change', function(e){
    const cost = (parseInt($(this).parent().text().slice(-3)));
    if(this.checked){
        total += cost;
        switch(this.name){
            case "js-frameworks":
            activityNotAvailabile("express");
                break;
            case "js-libs":
            activityNotAvailabile("node");
                break;
            case "express":
            activityNotAvailabile("js-frameworks");
                break;
            case "node":
            activityNotAvailabile("js-libs");
                break;
        }
    } else {
        total -= cost;
        switch (this.name) {
            case "js-frameworks":
            activityAvailabile("express");
                break;
            case "js-libs":
            activityAvailabile("node");
                break;
            case "express":
            activityAvailabile("js-frameworks");
                break;
            case "node":
            activityAvailabile("js-libs");
                break;

        }
    }
    const $totalPrint = $('<h3 class="total">Your Registration Total: $'+ total +'</h3>');
    // Remove legacy total
    if($('.total').length) {
        $('.total').remove();
    }
    // Append the total
    $('.activities').append($totalPrint);
});

/* ================================= 
Objective 5 Payment Info section of the form
==================================== */

$('#payment option[value="select_method"]').attr('hidden', true);
$('#payment option[value="credit card"]').attr('selected', true);
$('#payment option[value="credit card"]').attr('class', 'selected');
// Show Credit card details, hide Bitcoin & Paypal divs
$('#credit-card').show();
$bitcoin.hide();
$paypal.hide();

/* ================================= 
Objective 6 Form validation and messages
==================================== */

// Show correct payment elements after selection and clear errors if they exist
$('#payment').on('change', function() {
    const paymentSelected = $(this).val();
    $('#cc-num').attr('class','');
    $('#zip').attr('class','');
    $('#cvv').attr('class','');
    $('.payment-error').remove();
    if(paymentSelected === 'credit card') {
        $('#credit-card').show();
        $('option[value="credit card"]').addClass('selected');
        $('div').last().hide();
        $('div').last().prev().hide();
    } else if(paymentSelected === 'paypal'){
        $('#credit-card').hide();
        $('option[value="credit card"]').removeClass('selected');
        $('div').last().hide();
        $('div').last().prev().show();
    } else if(paymentSelected === 'bitcoin'){
        $('#credit-card').hide();
        $('option[value="credit card"]').removeClass('selected');
        $('div').last().prev().hide();
        $('div').last().show();

    }
});

// Check email before page submit

$('#mail').on('keyup', function(){
   if(!legitEmail($('#mail').val())){
       $('#mail').attr('class', 'not-valid');
       $('#mail').prev().append($emailCheck);
    } else {
        $('#mail').attr('class', '');
        $('#email-error').remove();
    }
});

// Submit handler
$('button[type="submit"]').on('click', function(e){
   // Name field
    if($('#name').val() === ''){
        $('#name').attr('class', 'not-valid');
        $('#name').prev().append($nameCheck);

    } else {
        $('#name').attr('class', false);
        $nameCheck.remove();
    }
    // Email field
    if(!legitEmail($('#mail').val())){
       $('#mail').attr('class', 'not-valid');
       $('#mail').prev().append($emailCheck);
   } else {
       $('#mail').attr('class', '');
       $emailCheck.remove();
   }
   // Activity section
    let isChecked = false;
    $activityInput.each(function(){
        if(this.checked){
            isChecked = true;
        }
    });
    if(!isChecked){
        $('.activities').prepend($activityCheck);
    } else {
        $activityCheck.remove();
    }
    // Payment section
    if($('option[value="credit card"]').hasClass('selected')) {
        const $creditNum = $('#cc-num').val();
        const $zipNum = $('#zip').val();
        const $cvvNum = $('#cvv').val();
        const valid = ($numVal, field) => {
            let value = false;
            let message = "";
            let validate = "";
            if (field === "cc") {
                value = ($numVal.toString().length < 13) || ($numVal.toString().length > 16);
                if ($numVal.toString().length === 0) {
                    message = "Credit card number needed.";
                } else {
                    message = "Credit card numbers MUST be between 13 an 16 numbers.";
                }
                validate = "cc-num";
            } else if (field === 'zip') {
                value = ($numVal.toString().length !== 5);
                if ($numVal.toString().length === 0) {
                    message = "Please enter a zip code.";
                } else {
                    message = "Please enter 5 digit zip code."
                }
                validate = field;
            } else if (field === 'cvv') {
                value = ($numVal.toString().length !== 3);
                if ($numVal.toString().length === 0) {
                    message = "Please enter a credit CVV code.";
                } else {
                    message = "Please enter 3 digit CVV code on back of card."
                }
                validate = field;
            }
            if (!($.isNumeric($numVal)) || value) {
                $(`#${validate}`).attr('class', 'not-valid');
                if ($(`#${field}-num-error`).length) {
                    $(`#${field}-num-error`).remove();
                }
                $('#credit-card').after($(`<span class="payment-error" id="${field}-num-error">${message}</span>`));
            } else {
                $(`#${validate}`).attr('class', '');
                $(`#${field}-num-error`).remove();
            }
        }
        valid($creditNum, "cc");
        valid($zipNum, "zip");
        valid($cvvNum, "cvv");
    }
    // Cancel page refresh if errors exist
    if(!((document.querySelectorAll('.error-message').length === 0)&&(document.querySelectorAll('.not-valid').length === 0))){
        e.preventDefault();
    }
});