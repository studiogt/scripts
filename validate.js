;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.
    
    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'validate';


    $.fn[pluginName] = function() {
        var self = this;
        var valido = true;              
        self.each(function(){
            var $input = $(this);
            if (!valido) return false;
            if ($input.is(':text,[type=email],:password,select,textarea') && $.trim($input.val())=='') {
                valido = false;
                var msg = 'Campo obrigatório';
                if ($input.data('msg')) {
                    msg = $input.data('msg');
                } else if ($input.data('name')) {
                    msg = "O campo "+$input.data('name')+" é obrigatório.";
                }
                alert(msg);
                $input.focus();             
            } else if ($input.is(':text,:password,select,textarea') && $input.data('validtype')) {
                validType = $input.data('validtype');
                var v = true;               
                switch (validType) {
                    case 'email': 
                        if (!$input.val().isEmail()) {
                            v = false;                          
                        }
                        break;
                    case 'cpf':
                        if (!$input.val().isCPF()) {
                            v = false;
                        }
                        break;
                    case 'cnpj':
                        if (!$input.val().isCNPJ()) {
                            v = false;
                        }
                        break;
                    case 'phone':
                        if (!$input.val().isPhone()) {
                            v = false;
                        }
                        break;
                    case 'date':
                        if (!$input.val().isDate()) {
                            v = false;
                        }
                        break;
                    case 'fullname':
                        if (!$input.val().isFullName()) {
                            v = false;
                        }
                        break;
                    case 'cep':
                        if (!$input.val().isCEP()) {
                            v = false;
                        }
                        break;
                    default:
                        break;
                } 
                if ($input.is(':text,:password,select,textarea') && $input.data('validateurl')) {
                    if (!$input.validateUrl()) {
                        v = false;
                    }
                }
                if (!v) {
                    valido = false;
                    var msg = "Campo informado incorretamente.";
                    if ($input.data('invalidmsg')) {
                        msg = $input.data('invalidmsg');
                    } else if ($input.data('name')) {
                        msg = "O campo "+$input.data('name')+" foi informado incorretamente."
                    }
                    alert(msg);
                    $input.focus();
                }               

            } else if ($(this).is(':radio,:checkbox')) {
                var name = $input.attr('name').replace(/\[/igm,'\\[').replace(/\]/igm,'//]');
                if ($('[name='+name+']:checked').length==0) {
                    valido = false;
                    var msg = 'Campo obrigatório';
                    if ($input.data('msg')) {
                        msg = $input.data('msg');
                    } else if ($input.data('name')) {
                        msg = "O campo "+$input.data('name')+" é obrigatório.";
                    }
                    alert(msg);                 
                }
            }
            
        });
        return valido;
    };

}(jQuery, window, document));



String.prototype.isEmail = function() {
    var regex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    return regex.test(this);
}


String.prototype.isPhone = function() {
    var regex = /\([1-9][1-9]\) [2-9][0-9]{3}-[0-9]{4,5}/;
    return regex.test(this);
}

String.prototype.isFullName = function() {
    var regex = /\w+\s+\w+[\s\w]*/;
    return regex.test(this);
}

String.prototype.isDate = function() {
    var regex = /[0-3][0-9]\/[0-1][0-9]\/[1-9][0-9][0-9][0-9]/;
    return regex.test(this);
}

String.prototype.isCNPJ = function() {
    cnpj = this;
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}
String.prototype.isCPF = function() {
    cpf = this;
    cpf = cpf.replace(/[^\d]+/g,'');
 
    if(cpf == '') return false;
 
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
        return false;
     
    // Valida 1o digito
    add = 0;
    for (i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
     
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
         
    return true;
    
}

String.prototype.isCEP = function() {
    var regex = /[0-9]{5}-[0-9]{3}/;
    return regex.test(this);
}
$.fn.validateUrl = function() {
    var $self = $(this);
    if ($self.data('enviando')) return false;
    var cnpj = $self.val();
   
    var valido = true;                  
    $self.data('enviando',true);
    $.fancybox.showLoading();
    var callback = function(resp) {
        $self.data('enviando',false);
        $.fancybox.hideLoading();

        if (resp.success) {
            valido = true;
        } else {                            
            valido = false;
        }
    }
    $.ajax({
        url: $self.data('validateurl'),
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            cnpj: cnpj
        },
        success: callback,
        error: function() {
            callback({success: false, msg: 'Não foi possível validar o cnpj.'});
        }
    });
    return valido;
    
}


$(window).on('keyup',function(e){
    var keys = window.keys||[];
    var codigo = [38,38,40,40,37,39,37,39,66,65];

    while(keys.length>=codigo.length) {
        keys.shift();
    }
    keys.push(e.keyCode);
    
    if (keys.join(',')===codigo.join(',')) {
        $(window).trigger('konami');
    }
    window.keys = keys;
    
});
$(window).on('konami',function() {
    $('[alt=cep]').val('91130-000');
    $('[alt=phone]').val('(51) 9999-99999');
    $('[alt=cnpj]').val('04.091.717/0001-47');
    $('[alt=cpf]').val('007.550.71026');
    $('[alt=decimal]').val('10,50');
    $('[alt=date]').val('10/10/2015');
    $('[data-validType=email]').val('fabioteste@studiogt.com.br');
    $(':checkbox').attr('checked','checked');
    $(':radio').attr('checked','checked');
    $('select').each(function(){
        $(this).find('option').attr('selected','selected');
    });
    $(':text:visible,textarea').each(function(){
        var value=$(this).val();
        if (value!='') return;
        var alt = $(this).attr('alt');
        
        if (/^\d+$/igm.test(alt)) {
            $(this).val('99');
            return;
        }
        $(this).val("Lorem Ipsum Dolor");
    });
    $(':text:visible,textarea,select,:radio,:checkbox').trigger('change');
});

String.prototype.cardType = function(number) {
    var number = this.replace(/\D/igm,'');
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };
    if (re.electron.test(number)) {
        return 'visa';
    } else if (re.maestro.test(number)) {
        return 'mastercard';
    } else if (re.dankort.test(number)) {
        return '';
    } else if (re.interpayment.test(number)) {
        return '';
    } else if (re.unionpay.test(number)) {
        return '';
    } else if (re.visa.test(number)) {
        return 'visa';
    } else if (re.mastercard.test(number)) {
        return 'mastercard';
    } else if (re.amex.test(number)) {
        return 'amex';
    } else if (re.diners.test(number)) {
        return 'diners';
    } else if (re.discover.test(number)) {
        return 'discover';
    } else if (re.jcb.test(number)) {
        return 'jcb';
    } else {
        return '';
    }
}

String.prototype.number_format = function(decimals, dec_point, thousands_sep) {
    number = this;

  number = (number + '')
    .replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + (Math.round(n * k) / k)
        .toFixed(prec);
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
    .split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '')
    .length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1)
      .join('0');
  }
  return s.join(dec);
}

Number.prototype.number_format = String.prototype.number_format;