var SGT = (function(){


	var getLogradouro = (function(){
		var cache = {};

		return function(cep,cb) {
			var promise;
			if (!cache[cep]) {
				var dfd = $.Deferred();
				promise = dfd.promise();
				cache[cep] = promise;

				var callback = function(resp) {
					var data = false;
					if (resp.success) {
						data = resp.data[0];	

						var logradouro = /(.+) \- de (\d+) a (\d+) \- lado (.+)$/.exec(data.logradouro);
						if (logradouro) {
							data.logradouro = logradouro[1];
							data.numeros = {
								de: logradouro[2],
								ate: logradouro[3]
							};
							data.lado = logradouro[4];
						}
					}
					dfd.resolve(data);
				}

				$.ajax({
					url: 'https://www.studiogt.com.br/wsdl/api.php/location/getLogradouro?cep='+cep.replace(/\D/igm,''),							
					dataType: 'json',
					success: callback,
					error: function() {
						callback({success:false});
					}
				});
			} else {
				promise = cache[cep];
			}

			promise.done(cb);
		};
	}());

	return {
		location: {
			getLogradouro: getLogradouro
		}
	};
}());

/*
$('body').on('keyup','[alt=cep]',function() {
	var $self = $(this);

	if ($self.data('enviando')) return;
	
	//TROCAR O CONTAINER
	var $container = $self.closest('.clone');

	var cep = $self.val().replace(/\D/igm,'');
	if (cep.length!=8) return;

	$self.data('enviando',true);
	$.fancybox.showLoading();

	SGT.location.getLograduro(cep,function(resp) {
		$self.data('enviando',false);
		$.fancybox.hideLoading();

		var data = resp||{logradouro:'',bairro:'',cidade:'',uf:''};
		
		$.each(data,function(i,val) {		

			//Para o caso <input name="endereco[0][cidade]" />
			$container.find('[name$='+i+'\\]]').val(val);	

			//Para o caso <input name="cidade" />
			//$container.find('[name='+i+']').val(val);
		});

	});
});
*/