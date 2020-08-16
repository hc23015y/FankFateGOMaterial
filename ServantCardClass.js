var ServantCardClass = function ($interface, serialNumber, servantData) {
	let _self = this;
	let $skillTable;
	let $ascensionTable;
	let calculateSw = {
		"ascension" : false,
		"skill-1" : false,
		"skill-2" : false,
		"skill-3" : false,
	}
	
	_self.init = function() {
//		console.log(serialNumber);
		
		$interface.insertAfter('.main-title');
		_self.initInterface();
		_self.setEvent();
	}
	
	_self.initInterface = function() {
		$interface.find('.servant-name').html(`No.${servantData.id}<br/>${servantData.svtCnName}`);
		$interface.find('.servant-img').attr("src", servantData.imgSrc);
		
		$interface.find('.mtype-choose img').addClass("icon-unselect");
		$interface.find('.skill-icon').each( function (index, icon) { 
			$(icon).attr('skillNo', 'skill-' + (index + 1) ) 
		});
		
		$skillTable = $interface.find('.skill-material-table');
		$skillTable.hide();
		
		$ascensionTable = $interface.find('.ascension-material-table');
		$ascensionTable.hide();
	}
	
	_self.setEvent = function() {
		$interface.find('.servant-delete-button').click(function(){
			window.mainComponent.removeServant(_self.getUuid());
		})
		
		$interface.find('.hide-material-check').change(function(){
			if($(this).prop('checked')) {
				$interface.find('.hide-area').hide();
			}
			else {
				$interface.find('.hide-area').show();
			}
		})
		
		$interface.find('.ascension-icon').click( function (){
			if(calculateSw.ascension) {
				$interface.find('.ascension-icon').addClass("icon-unselect");
				calculateSw.ascension = false;
			}
			else {
				$interface.find('.ascension-icon').removeClass("icon-unselect");
				calculateSw.ascension = true;
			}
			
			_self.resetAscensionTable();
		});
		
		$interface.find('.skill-icon').click( function (){
			let $skillIcon = $(this);
			
			if(calculateSw[$skillIcon.attr('skillNo')]) {
				$skillIcon.addClass("icon-unselect");
				calculateSw[$skillIcon.attr('skillNo')] = false;
			}
			else {
				$skillIcon.removeClass("icon-unselect");
				calculateSw[$skillIcon.attr('skillNo')] = true;
			}
			
			_self.resetSkillTable();
		});
	}
	
	_self.resetAscensionTable = function() {
		if(calculateSw.ascension) {
			$ascensionTable.show();
		}
		else {
			$ascensionTable.hide();
		}
	}
	
	_self.getInterface = function() {
		return $interface;
	}
	
	_self.getUuid = function() {
		return serialNumber;
	}	
	
	
	_self.init();
}