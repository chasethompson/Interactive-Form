// Treehouse Techdegree - Project 3
// Interactive Form Creation & Validation

// Global variables

const $form = $('form');
const $nameField = $('#name');
const $emailField = $('#mail');
const $jobRole = $('#title');
const $jobOtherRole = $('#other-title');
const $ccNum = $('#cc-num');
const $zipField = $('#zip');
const $cvvField = $('#cvv');
const $bitcoin = $('div').last();
const $paypal = $('div').last().prev();

const $shirtDesign = $('#design');
const $shirtColorDiv = $('#colors-js-puns');
const $shirtColor = $('#color');
const $colors = $('#color option');

const $activity = $('.activites');
const $activityInput = $('.activities input');

const $payment = $('#payment');
const $registerButton = $('button');
let total = 0;

// Create and hide error messages

const $nameCheck = $('<span class="error-message" id="name-error">New form. Who dis?</span>');
const $emailCheck = $('<span class="error-message" id="email-error">Where can we send your registration ticket?</span>');
const $activityCheck = $('<span class="error-message" id="activity-error">Are you just going to loiter in the hallway?</span>');
const $ccCheck = $('<span class="error-message" id="cc-error">Please enter a credit card number.</span>');
const $ccNumCheck = $('<span class="error-message" id="cc-num-error">Credit card numbers must be between 13 and 16 numbers.</span>');
const $zipCheck = $('<span class="error-message" id="zip-error">Please enter 5 digit zip code.</span>');
const $cvvCheck = $('<span class="error-message" id="cvv-error">Please enter 3 digit CVV code on back of card.</span>');


$('#name-error').remove();
$('#email-error').remove();
$('#activity-error').remove();
$('#cc-error').remove();
$('#cc-num-error').remove();
$('#zip-error').remove();
$('#cvv-error').remove();

// Setup initial look of form

$nameField.focus();
$jobOtherRole.hide();
$shirtColorDiv.hide();

// Show text field when 'Other' role is selected

$jobRole.on('change', function() {
    const selectedRole = $(this).val();
    if(selectedRole === 'other'){
        $('#other-title').show();
    } else {
        $('#other-title').hide();
    }
});

// Manage the Tshirt color section

const resetColors = () => {
    if ($shirtDesign.val() === 'Select Theme') {
        $shirtColorDiv.hide();
    }
}

$shirtDesign.on('change', () => {
    $shirtColorDiv.show();
    switch ($shirtDesign.val()) {
        case 'js puns' :
            $colors.each(function() {
                let puns = $(this).text();
                    if (puns.indexOf("JS Puns") > -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
                $colors.eq(0).prop('selected', true)
                break;

        case 'heart js':
                $colors.each(function() {
                    let heart = $(this).text();
                    if (heart.indexOf('JS shirt only') > -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
                $colors.eq(3).prop('selected', true)
                break;
    }
    resetColors(); 
});

// Manage the Activity section, re-time check validation for activities happening at the same time. Disable concurrent activity if another at the same time is selected. Also appends total $ for all selected activities

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
    $activity.append($totalPrint);
});

// Payment field adjustments
// Remove 'Select method' option, set 'Credit Card' to default

$('option[value="select_method"]').prop('disabled',true);
$('option[value = "credit card"]').prop('selected', true);
$('option[value="credit card"]').prop('class', 'selected');
// Show Credit card details, hide Bitcoin & Paypal divs
$('#credit-card').show();
$bitcoin.hide();
$paypal.hide();

// Show/hide correct payment element

$payment.on('change', function(){
    const val = $(this).val();
    // Remove any possible previous errors
    $ccNum.attr('class','');
    $zipField.attr('class','');
    $cvvField.attr('class','');
    $('.error-message').remove();
    // Manipulate section depending on selected option
    if(val === 'credit card') {
        $('#credit-card').show().addClass('paymentValid');
        $bitcoin.hide();
        $paypal.hide();
    } else if (val === 'paypal'){
        $('#credit-card').hide().removeClass('paymentValid');
        $bitcoin.hide();
        $paypal.show();        
    } else if (val === 'bitcoin'){
        $('#credit-card').hide().removeClass('paymentValid');
        $bitcoin.show();
        $paypal.hide();  
    }
});

// Regex functions for validation, including 'live' validation for email field

function legitEmail(email) {
    // Email regex validation from emailregex.com
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function legitCreditCard(credit) {
    let regex =/^[0-9]{13}(?:[0-9]{3})?$/;
    return regex.test(credit);
}

function legitZip(zip) {
    let regex =/^[0-9]{5}$/;
    return regex.test(zip);
}

function legitCVV(cvv) {
    let regex =/^[0-9]{3}$/;
    return regex.test(cvv);
}

$emailField.on('keyup', function(){
   if(!legitEmail($emailField.val())){
       $emailField.addClass('not-valid');
       $emailField.prev().append($emailCheck);
    } else {
        $emailField.removeClass('not-valid');
        $emailCheck.remove();
    }
});

// Submit button validation and functionality
$registerButton.on('click', function(e){
    // Name field
    if($nameField.val() === ''){
        $nameField.attr('class', 'not-valid');
        $nameField.prev().append($nameCheck);
    } else {
        $nameField.attr('class', '');
        $nameCheck.remove();
    }
    // Email field
   if(!legitEmail($emailField.val())){
       $emailField.attr('class', 'not-valid');
       $emailField.prev().append($emailCheck);
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
        // Credit card section
    if ($('#cc-num').val() === '') {
        $ccNum.attr('class', 'not-valid');
        $registerButton.prev().append($ccCheck);
    } else if ($ccNum.val() != '' || $ccNum.val() > 13 || $ccNum.val() < 16) {
        $ccCheck.remove();
        $registerButton.prev().append($ccNumCheck);
    } else {
        $('#cc-num').attr('class', '');
        $ccNumCheck.remove();
    }
    if(!legitZip($zipField.val())) {
        $zipField.attr('class', 'not-valid');
        $registerButton.prev().append($zipCheck);
    } else {
        $zipField.attr('class', '');
        $zipCheck.remove();
    }
    if(!legitCVV($cvvField.val())) {
        $cvvField.attr('class', 'not-valid');
        $registerButton.prev().append($cvvCheck);
    } else {
        $cvvField.attr('class', '');
        $cvvCheck.remove();
    }
    if(!((document.querySelectorAll('.not-valid').length === 0)&&(document.querySelectorAll('.error-message').length === 0))){
        e.preventDefault();
    }
});