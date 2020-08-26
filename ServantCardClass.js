var ServantCardClass = function ($interface, serialNumber, servantData) {
	let _self = this;
	let $skillTable;
	let $ascensionTable;
	let materialStorage = {
		"ascension" : {
			"sw" : false,
			"totalMaterial" : {}
		},
		"skill" :[
			{
				"sw" : false,
				"totalMaterial" : {}				
			},
			{
				"sw" : false,
				"totalMaterial" : {}				
			},
			{
				"sw" : false,
				"totalMaterial" : {}				
			}
		]	
	};
	
	_self.init = function() {
//		console.log(serialNumber);
		
		$interface.insertAfter('.main-title');
		_self.initInterface();
		_self.setEvent();
		
		$interface.show();
	}
	
	_self.initInterface = function() {
		$interface.find('.servant-name').html(`No.${servantData.id}<br/>${servantData.svtCnName}`);
		$interface.find('.servant-img').attr("src", servantData.imgSrc);
		
		$interface.find('.mtype-choose img').addClass("icon-unselect");
		$interface.find('.skill-icon').each( function (index, icon) { 
			$(icon).attr('skillIndex', index ); 
		});
		
		$skillTable = $interface.find('.skill-material-table');
		$skillTable.hide();
		$skillTable.find('tbody').empty();
		
		$ascensionTable = $interface.find('.ascension-material-table');
		$ascensionTable.hide();
		$ascensionTable.find('tbody').empty();
		
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
			if(materialStorage.ascension.sw) {
				$interface.find('.ascension-icon').addClass("icon-unselect");
				materialStorage.ascension.sw = false;
			}
			else {
				$interface.find('.ascension-icon').removeClass("icon-unselect");
				materialStorage.ascension.sw = true;
			}
			
			_self.displayAscensionTable();
			window.mainComponent.recalculateTotalMaterial();
		});
		
		$interface.find('.skill-icon').click( function (){
			let $skillIcon = $(this);
			let skillIndex = $skillIcon.attr('skillIndex');
		
			if(materialStorage.skill[skillIndex].sw) {
				$skillIcon.addClass("icon-unselect");
				materialStorage.skill[skillIndex].sw = false;
			}
			else {
				$skillIcon.removeClass("icon-unselect");
				materialStorage.skill[skillIndex].sw = true;
			}
			
			_self.displaySkillTable(skillIndex);
			window.mainComponent.recalculateTotalMaterial();
		});
	}
	
	_self.displayAscensionTable = function() {	
		$ascensionTable.find('tbody').empty();					
		materialStorage.ascension.totalMaterial = {};
		$ascensionTable.hide();
	
		if(materialStorage.ascension.sw) {
			let startAscension = $interface.find(".ascension-select.start-lv").val();
			let endAscension = $interface.find(".ascension-select.end-lv").val();
			let maxRow = 1;
				
			// display data and storage data
			for(let trNo = 0; trNo < maxRow; trNo++) {
				$tr = $(document.createElement("tr"));
				$ascensionTable.find('tbody').append( $tr );
				
				$.each(servantData.ascension, function(index, ascension){
					let $td = $(document.createElement("td"));
					let lv = index + 1;
					
					$tr.append($td);	
					
					if(startAscension <= lv && endAscension >= lv && ascension.length > trNo) {
						let singleAscension = ascension[trNo];
						let material = window.dataService.getMaterialData(singleAscension.name);
							
						$td.html(`<img class='material-icon' src='${material.imgSrc}'><div>${singleAscension.cnt}</div>`);
						
						// add to totalMaterial
						if(materialStorage.ascension.totalMaterial[singleAscension.name] == null ) {
							materialStorage.ascension.totalMaterial[singleAscension.name] = singleAscension.cnt;
						}
						else {
							materialStorage.ascension.totalMaterial[singleAscension.name] += singleAscension.cnt;
						}
					}
					
					maxRow = (ascension.length > maxRow) ? ascension.length : maxRow;
				});
			}
			
			$ascensionTable.show();
		}
	}
	
	_self.displaySkillTable = function(toggleSkillIndex) {
		let displayCheck = false;
		
		$.each(materialStorage.skill, function(index, skill) {
			if(skill.sw) displayCheck = true;
		})
		
		$skillTable[(displayCheck) ? "show" : "hide"]();
	}
	
	_self.getMaterialStorage = function() {
		return materialStorage;
	}
	
	_self.getInterface = function() {
		return $interface;
	}
	
	_self.getUuid = function() {
		return serialNumber;
	}	
	
	
	_self.init();
}