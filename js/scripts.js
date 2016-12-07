(function(){
  var form = $('form');
  var jobRole = $('#title');
  var tShirtDesign = $('#design');
  var tShirtColor = $('#color');
  var payment = $('#payment');
  var realTimeValidatedField = $('#name');


  // sets focus on the first text field
  form.find('input[type="text"]').first().focus();

  // dynamically set the default payment to "Credit Card"
  payment.val($(payment.children('option')[1]).val());

  tShirtDesign.find('option').first().val('default');
  tShirtColor.prepend('<option value="default">Select Color</option>').hide();
  tShirtColor.val('default');


  // adds or removes "other title" label and field elements based on the change event of the select element
  jobRole.change(function(){
    var selection = $(this).val();
    var firstFormFieldset = form.children('fieldset').first();
    var otherFieldId = 'other-title';

    if(selection === 'other'){

      firstFormFieldset.append(function(){
        var otherField = '';

        otherField += '<label for="' + otherFieldId + '">Specify Other:</label>';
        otherField += '<input type="text" id="' + otherFieldId + '" placeholder="Your Job Role">';

        return otherField;
      });
      return;
    }
    firstFormFieldset.find('[for="' + otherFieldId + '"], [id="' + otherFieldId + '"]').remove();
  });


  tShirtDesign.change(function(){
    var selection = $(this).val();

    tShirtColor.find('option').each(function(){
      var optionText = $(this).text().toLowerCase().replace('♥', 'heart');

      $(this).hide();

      if(new RegExp(selection).test(optionText)){
        $(this).show();
      }
    });

    var displayProp = (selection !== 'default') ? 'block' : 'none';

    tShirtColor.attr('style', 'display:' + displayProp);
    tShirtColor.val('default');
  });


  function changePaymentMethod(){
    var selection = $(this).val().replace(' ', '-');
    var creditCard = $('#credit-card');
    var parent = $(this).closest('fieldset');

    $('div:has(> p)').children('p').hide();

    if(selection !== 'credit-card'){
      creditCard.hide();

      parent.find('p').each(function(){
        var textString = $(this).text().toLowerCase();

        $(this).hide();

        if(new RegExp(selection).test(textString)){
          $(this).show();
        }
      });

    }else{
      creditCard.show();
    }
  }
  payment.change(changePaymentMethod);
  changePaymentMethod.call(payment);


  function formSubmit(event){
    var name = $('#name').val();
    var email = $('#mail');
    var activities = $(this).find('.activities').find('input[type="checkbox"]');
    var paymentMethod = payment.val();
    var zipCode = $('#zip').val();
    var cvv = $('#cvv').val();

    var emailCheck = /^([\w]+)@([\w]+)\.([\D]){2,4}$/;
    var activityChecked;
    var errors = [];

    // simulate failed form submission and display errors
    function formError(message){
      if(event.type === 'submit'){
        event.preventDefault();
      }
      errors.push(message);
    }

    $(this).find('.submission-errors').remove();

    if(name === ''){
      formError('Please enter your name.');

    }else if(name.length < 2){
      formError('Your name must be 2 or more characters.');
    }

    if(!emailCheck.test(email.val())){
      formError('Please enter a valid email address.');
    }

    activities.each(function(){
      if($(this).prop('checked')){
        activityChecked = true;
      }
    });

    if(!activityChecked){
      formError('Please choose an activity.');
    }

    if(paymentMethod === 'credit card'){
      var creditCard = $('#cc-num').val();

      if(creditCard === ''){
        formError('Please enter your credit card number.');

      }else if(!(creditCard.length > 12 && creditCard.length < 17)){
        formError('Please enter a credit card number that is between 13 and 16 digits.');

      }else if(isNaN(Number(creditCard))){
        formError('There is a problem with the credit card number you provided, please check this field again for errors.');
      }

      if(zipCode.length !== 5){
        formError('The zip code you entered is not 5 digits.');

      }else if(isNaN(Number(zipCode))){
        formError('Please enter a valid zip code.');
      }

      if(cvv.length !== 3){
        formError('The CVV must be 3 digits.');

      }else if(isNaN(Number(cvv))){
        formError('The CVV provided is 3 digits, however it does not validate properly.');
      }
    }

    // outputs form errors to the page
    if(errors.length > 0){
      var formErrors = '';

      errors.forEach(function(value){
        formErrors += '<p>' + value + '</p>';
      });

      $(this).prepend('<div style="color:red" class="submission-errors">' + formErrors + '</div>');
      $(window).scrollTop(0);
    }
  }
  realTimeValidatedField.bind('keyup', $.proxy(formSubmit, form));
  form.submit(formSubmit);
})();
